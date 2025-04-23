import React, {createContext, useContext, useState} from 'react';
import {BaseItem, InventoryMovement, ItemAssignment, ItemVariant, MovementType} from '@/types/warehouse';
import {Player} from '@/types';
import {useNotifications} from '@/context/NotificationContext';
import {useWarehouseData} from '@/hooks/useWarehouseData';

// Mock data imports
import {
  mockAssignments,
  mockBaseItems,
  mockMovements,
  mockVariants,
  mockWarehousePlayers as mockPlayers
} from '@/utils/warehouse/mockWarehouseData';

type DialogType = 'addItem' | 'editItem' | 'addVariant' | 'editVariant' | 
                 'addMovement' | 'addAssignment' | 'returnItem' | 'none';

interface DeleteTarget {
  id: string;
  type: 'item' | 'variant';
}

interface WarehouseContextType {
  // Data states
  items: (BaseItem & { variants: ItemVariant[] })[];
  movements: InventoryMovement[];
  assignments: ItemAssignment[];
  players: Player[];
  
  // View management
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedItem: BaseItem | null;
  setSelectedItem: (item: BaseItem | null) => void;
  selectedVariant: ItemVariant | null;
  setSelectedVariant: (variant: ItemVariant | null) => void;
  selectedAssignment: ItemAssignment | null;
  setSelectedAssignment: (assignment: ItemAssignment | null) => void;
  showVariants: boolean;
  setShowVariants: (show: boolean) => void;
  
  // Dialog management
  dialogType: DialogType;
  setDialogType: (type: DialogType) => void;
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
  deleteTarget: DeleteTarget | null;
  setDeleteTarget: (target: DeleteTarget | null) => void;
  
  // Operations
  handleCreateBaseItem: (data: any) => void;
  handleUpdateBaseItem: (data: any) => void;
  handleDeleteBaseItem: (itemId: string) => void;
  handleCreateVariant: (data: any) => void;
  handleUpdateVariant: (data: any) => void;
  handleDeleteVariant: (variantId: string) => void;
  handleAddMovement: (data: any) => void;
  handleAddAssignment: (data: any) => void;
  handleMarkReturned: (data: any) => void;
  onEditItem: (item: any) => void;
  
  // Dashboard data
  lowStockItems: (BaseItem & { variants: ItemVariant[] })[];
  recentAssignments: ItemAssignment[];
}

const WarehouseContext = createContext<WarehouseContextType | undefined>(undefined);

export const WarehouseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showNotification } = useNotifications();
  
  // Get data from the new hook
  const { 
    items, 
    movements, 
    assignments,
    createBaseItem,
    updateBaseItem,
    deleteBaseItem 
  } = useWarehouseData();
  
  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedItem, setSelectedItem] = useState<BaseItem | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ItemVariant | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<ItemAssignment | null>(null);
  const [showVariants, setShowVariants] = useState(false);
  
  // Dialog management
  const [dialogType, setDialogType] = useState<DialogType>('none');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  
  // Initialize data
  const [players] = useState<Player[]>(mockPlayers);
  
  // Handle create base item
  const handleCreateBaseItem = async (data: any) => {
    await createBaseItem.mutateAsync(data);
    setDialogType('none');
    
    showNotification('success', 'Articolo creato', {
      description: "Il nuovo articolo è stato aggiunto al magazzino",
    });
  };
  
  // Handle update base item
  const handleUpdateBaseItem = async (data: any) => {
    await updateBaseItem.mutateAsync(data);
    setDialogType('none');
    
    showNotification('success', 'Articolo aggiornato', {
      description: "Le modifiche all'articolo sono state salvate",
    });
  };
  
  // Handle delete base item
  const handleDeleteBaseItem = async (itemId: string) => {
    await deleteBaseItem.mutateAsync(itemId);
    
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
    
    showNotification('success', 'Articolo eliminato', {
      description: "L'articolo e tutte le sue varianti sono stati eliminati",
    });
  };
  
  // Handle create variant
  const handleCreateVariant = (data: any) => {
    if (!selectedItem) return;
    
    // Check if variant with same size and color already exists
    const isDuplicate = items.find(item => item.id === selectedItem.id)?.variants.some(
      v => v.size === data.size && v.color === data.color
    );
    
    if (isDuplicate) {
      toast.error("Esiste già una variante con questa taglia e colore");
      return;
    }
    
    const newVariant: ItemVariant = {
      ...data,
      id: `variant-${Date.now()}`,
      baseItemId: selectedItem.id,
      status: data.quantity === 0 ? 'out' : 
              data.quantity <= data.minimumThreshold ? 'low' : 
              'available' as 'available' | 'low' | 'out',
      lastUpdated: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setItems(prev => prev.map(item => {
      if (item.id === selectedItem.id) {
        return { 
          ...item, 
          variants: [...item.variants, newVariant]
        };
      }
      return item;
    }));
    
    // Create an 'in' movement for the initial quantity
    if (data.quantity > 0) {
      const newMovement: InventoryMovement = {
        id: `mov-${Date.now()}`,
        baseItemId: selectedItem.id,
        variantId: newVariant.id,
        type: 'in',
        quantity: data.quantity,
        date: new Date().toISOString(),
        note: 'Creazione variante',
        variant: newVariant,
        baseItem: selectedItem
      };
      
      setMovements(prev => [...prev, newMovement]);
    }
    
    setDialogType('none');
    
    showNotification('success', 'Variante creata', {
      description: "La nuova variante è stata aggiunta all'articolo",
    });
  };
  
  // Handle update variant
  const handleUpdateVariant = (data: any) => {
    if (!selectedItem || !selectedVariant) return;
    
    // Check for duplicate size and color, excluding the current variant
    const isDuplicate = items.find(item => item.id === selectedItem.id)?.variants.some(
      v => v.id !== selectedVariant.id && v.size === data.size && v.color === data.color
    );
    
    if (isDuplicate) {
      toast.error("Esiste già una variante con questa taglia e colore");
      return;
    }
    
    // Get current quantity to detect changes
    const currentVariant = items.find(item => item.id === selectedItem.id)?.variants
                               .find(v => v.id === selectedVariant.id);
    
    const currentQuantity = currentVariant?.quantity || 0;
    const newQuantity = data.quantity;
    const quantityDifference = newQuantity - currentQuantity;
    
    // Update variant
    const updatedItems = items.map(item => {
      if (item.id === selectedItem.id) {
        return {
          ...item,
          variants: item.variants.map(variant => {
            if (variant.id === selectedVariant.id) {
              return { 
                ...variant, 
                ...data,
                status: data.quantity === 0 ? 'out' : 
                        data.quantity <= data.minimumThreshold ? 'low' : 
                        'available' as 'available' | 'low' | 'out',
                lastUpdated: new Date().toISOString(),
                updatedAt: new Date()
              };
            }
            return variant;
          })
        };
      }
      return item;
    });
    
    setItems(updatedItems);
    
    // Create a movement if quantity changed
    if (quantityDifference !== 0) {
      const updatedVariant = updatedItems.find(item => item.id === selectedItem.id)?.variants
                                .find(v => v.id === selectedVariant.id);
                                
      const newMovement: InventoryMovement = {
        id: `mov-${Date.now()}`,
        baseItemId: selectedItem.id,
        variantId: selectedVariant.id,
        type: quantityDifference > 0 ? 'in' : 'out',
        quantity: Math.abs(quantityDifference),
        date: new Date().toISOString(),
        note: 'Aggiornamento variante',
        variant: updatedVariant,
        baseItem: selectedItem
      };
      
      setMovements(prev => [...prev, newMovement]);
    }
    
    setDialogType('none');
    
    showNotification('success', 'Variante aggiornata', {
      description: "Le modifiche alla variante sono state salvate",
    });
  };
  
  // Handle delete variant
  const handleDeleteVariant = (variantId: string) => {
    if (!selectedItem) return;
    
    // Delete the variant
    setItems(prev => prev.map(item => {
      if (item.id === selectedItem.id) {
        return {
          ...item,
          variants: item.variants.filter(v => v.id !== variantId)
        };
      }
      return item;
    }));
    
    // Delete related movements
    setMovements(prev => prev.filter(m => m.variantId !== variantId));
    
    // Delete related assignments
    setAssignments(prev => prev.filter(a => a.variantId !== variantId));
    
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
    
    showNotification('success', 'Variante eliminata', {
      description: "La variante è stata eliminata dal magazzino",
    });
  };
  
  // Handle stock adjustment (new movement)
  const handleAddMovement = (data: any) => {
    const baseItem = items.find(item => item.id === data.baseItemId);
    const variant = baseItem?.variants.find(v => v.id === data.variantId);
    const player = data.playerId ? players.find(p => p.id === data.playerId) : undefined;
    
    if (!baseItem || !variant) return;
    
    // Create new movement
    const newMovement: InventoryMovement = {
      id: `mov-${Date.now()}`,
      baseItemId: data.baseItemId,
      variantId: data.variantId,
      type: data.type as MovementType,
      quantity: data.quantity,
      date: data.date.toISOString(),
      note: data.notes,
      playerId: data.playerId,
      playerName: player ? `${player.firstName} ${player.lastName}` : undefined,
      baseItem,
      variant
    };
    
    setMovements(prev => [...prev, newMovement]);
    
    // Update variant quantity
    let quantityChange = data.quantity;
    if (['out', 'assign', 'lost', 'damaged'].includes(data.type)) {
      quantityChange = -quantityChange;
    }
    
    const updatedItems = items.map(item => {
      if (item.id === baseItem.id) {
        return {
          ...item,
          variants: item.variants.map(v => {
            if (v.id === variant.id) {
              const newQuantity = Math.max(0, v.quantity + quantityChange);
              const newStatus = newQuantity === 0 ? 'out' :
                               newQuantity <= (v.minimumThreshold || 0) ? 'low' :
                               'available' as 'available' | 'low' | 'out';
              
              return {
                ...v,
                quantity: newQuantity,
                status: newStatus,
                lastUpdated: new Date().toISOString(),
                updatedAt: new Date()
              };
            }
            return v;
          })
        };
      }
      return item;
    });
    
    setItems(updatedItems);
    
    // Create new assignment if needed
    if (data.type === 'assign' && data.playerId) {
      const newAssignment: ItemAssignment = {
        id: `assign-${Date.now()}`,
        variantId: data.variantId,
        playerId: data.playerId,
        playerName: player ? `${player.firstName} ${player.lastName}` : 'Unknown Player',
        assignDate: data.date.toISOString(),
        quantity: data.quantity,
        notes: data.notes,
        status: 'assigned',
        baseItem,
        variant
      };
      
      setAssignments(prev => [...prev, newAssignment]);
    }
    
    // Update assignment if it's a return
    if (data.type === 'return' && data.playerId) {
      const assignmentToUpdate = assignments.find(
        a => a.variantId === data.variantId && a.playerId === data.playerId && a.status === 'assigned'
      );
      
      if (assignmentToUpdate) {
        setAssignments(prev => prev.map(a => {
          if (a.id === assignmentToUpdate.id) {
            return {
              ...a,
              status: 'returned',
              returnDate: data.date.toISOString(),
              notes: data.notes ? `${a.notes ? `${a.notes}, ` : ''}${data.notes}` : a.notes
            };
          }
          return a;
        }));
      }
    }
    
    setDialogType('none');
    
    showNotification('success', 'Movimento registrato', {
      description: `${data.quantity} pezzi ${data.type === 'in' ? 'caricati' : 'scaricati'} dal magazzino`,
    });
  };
  
  // Handle new assignment
  const handleAddAssignment = (data: any) => {
    const baseItem = items.find(item => item.id === data.baseItemId);
    const variant = baseItem?.variants.find(v => v.id === data.variantId);
    const player = players.find(p => p.id === data.playerId);
    
    if (!baseItem || !variant || !player) return;
    
    // Check if there's enough quantity
    if (variant.quantity < data.quantity) {
      toast.error("Quantità non disponibile in magazzino");
      return;
    }
    
    // Create new assignment
    const newAssignment: ItemAssignment = {
      id: `assign-${Date.now()}`,
      variantId: data.variantId,
      playerId: data.playerId,
      playerName: `${player.firstName} ${player.lastName}`,
      assignDate: data.assignDate.toISOString(),
      expectedReturnDate: data.expectedReturnDate ? data.expectedReturnDate.toISOString() : undefined,
      quantity: data.quantity,
      notes: data.notes,
      status: 'assigned',
      baseItem,
      variant
    };
    
    setAssignments(prev => [...prev, newAssignment]);
    
    // Create movement for the assignment
    const newMovement: InventoryMovement = {
      id: `mov-${Date.now()}`,
      baseItemId: baseItem.id,
      variantId: data.variantId,
      type: 'assign',
      quantity: data.quantity,
      date: data.assignDate.toISOString(),
      note: data.notes,
      playerId: data.playerId,
      playerName: `${player.firstName} ${player.lastName}`,
      baseItem,
      variant
    };
    
    setMovements(prev => [...prev, newMovement]);
    
    // Update variant quantity
    const updatedItems = items.map(item => {
      if (item.id === baseItem.id) {
        return {
          ...item,
          variants: item.variants.map(v => {
            if (v.id === variant.id) {
              const newQuantity = Math.max(0, v.quantity - data.quantity);
              const newStatus = newQuantity === 0 ? 'out' :
                               newQuantity <= v.minimumThreshold ? 'low' :
                               'available' as 'available' | 'low' | 'out';
              
              return {
                ...v,
                quantity: newQuantity,
                status: newStatus,
                lastUpdated: new Date().toISOString(),
                updatedAt: new Date()
              };
            }
            return v;
          })
        };
      }
      return item;
    });
    
    setItems(updatedItems);
    
    setDialogType('none');
    
    showNotification('success', 'Assegnazione creata', {
      description: `${data.quantity} pezzi assegnati a ${player.firstName} ${player.lastName}`,
    });
  };
  
  // Handle mark assignment as returned
  const handleMarkReturned = (data: any) => {
    if (!selectedAssignment) return;
    
    // Update assignment
    setAssignments(prev => prev.map(a => {
      if (a.id === selectedAssignment.id) {
        return {
          ...a,
          status: 'returned',
          returnDate: data.returnDate.toISOString(),
          returnedCondition: data.returnedCondition,
          notes: data.notes ? `${a.notes ? `${a.notes}, ` : ''}${data.notes}` : a.notes
        };
      }
      return a;
    }));
    
    // Create movement if the item is returned in good condition
    if (data.returnedCondition === 'good') {
      const baseItem = selectedAssignment.baseItem;
      const variant = selectedAssignment.variant;
      
      if (!baseItem || !variant) return;
      
      const newMovement: InventoryMovement = {
        id: `mov-${Date.now()}`,
        baseItemId: baseItem.id,
        variantId: selectedAssignment.variantId,
        type: 'return',
        quantity: selectedAssignment.quantity,
        date: data.returnDate.toISOString(),
        note: data.notes,
        playerId: selectedAssignment.playerId,
        playerName: selectedAssignment.playerName,
        baseItem,
        variant
      };
      
      setMovements(prev => [...prev, newMovement]);
      
      // Update variant quantity
      const updatedItems = items.map(item => {
        if (item.id === baseItem.id) {
          return {
            ...item,
            variants: item.variants.map(v => {
              if (v.id === variant.id) {
                const newQuantity = v.quantity + selectedAssignment.quantity;
                const newStatus = newQuantity === 0 ? 'out' :
                                 newQuantity <= v.minimumThreshold ? 'low' :
                                 'available' as 'available' | 'low' | 'out';
                
                return {
                  ...v,
                  quantity: newQuantity,
                  status: newStatus,
                  lastUpdated: new Date().toISOString(),
                  updatedAt: new Date()
                };
              }
              return v;
            })
          };
        }
        return item;
      });
      
      setItems(updatedItems);
    } else {
      // Create movement for damaged or lost items
      const baseItem = selectedAssignment.baseItem;
      const variant = selectedAssignment.variant;
      
      if (!baseItem || !variant) return;
      
      const newMovement: InventoryMovement = {
        id: `mov-${Date.now()}`,
        baseItemId: baseItem.id,
        variantId: selectedAssignment.variantId,
        type: data.returnedCondition === 'damaged' ? 'damaged' : 'lost',
        quantity: selectedAssignment.quantity,
        date: data.returnDate.toISOString(),
        note: data.notes,
        playerId: selectedAssignment.playerId,
        playerName: selectedAssignment.playerName,
        baseItem,
        variant
      };
      
      setMovements(prev => [...prev, newMovement]);
    }
    
    setDialogType('none');
    setSelectedAssignment(null);
    
    showNotification('success', 'Restituzione registrata', {
      description: `Articolo segnato come ${
        data.returnedCondition === 'good' ? 'restituito in buone condizioni' : 
        data.returnedCondition === 'damaged' ? 'restituito danneggiato' : 
        'smarrito'
      }`,
    });
  };

  // Find the problematic onEditItem handler and update it
  const onEditItem = (item: any) => {
    setSelectedItem(item);
    setDialogType('editItem');
  };

  // Get low stock items for dashboard
  const lowStockItems = items.filter(item => 
    item.variants.some(v => v.status === 'low' || v.status === 'out')
  );
  
  // Get recent assignments for dashboard
  const recentAssignments = assignments
    .sort((a, b) => new Date(b.assignDate).getTime() - new Date(a.assignDate).getTime())
    .slice(0, 5);
    
  const value = {
    // Data states
    items,
    movements,
    assignments,
    players,
    
    // View management
    activeTab,
    setActiveTab,
    selectedItem,
    setSelectedItem,
    selectedVariant,
    setSelectedVariant, 
    selectedAssignment,
    setSelectedAssignment,
    showVariants,
    setShowVariants,
    
    // Dialog management
    dialogType,
    setDialogType,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    deleteTarget,
    setDeleteTarget,
    
    // Operations
    handleCreateBaseItem,
    handleUpdateBaseItem,
    handleDeleteBaseItem,
    handleCreateVariant,
    handleUpdateVariant,
    handleDeleteVariant,
    handleAddMovement,
    handleAddAssignment,
    handleMarkReturned,
    onEditItem,
    
    // Dashboard data
    lowStockItems,
    recentAssignments
  };
  
  return (
    <WarehouseContext.Provider value={value}>
      {children}
    </WarehouseContext.Provider>
  );
};

// Custom hook to use the warehouse context
export const useWarehouse = () => {
  const context = useContext(WarehouseContext);
  if (context === undefined) {
    throw new Error('useWarehouse must be used within a WarehouseProvider');
  }
  return context;
};
