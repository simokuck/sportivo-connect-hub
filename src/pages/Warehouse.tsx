import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from 'sonner';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { useNotifications } from '@/context/NotificationContext';
import { Player } from '@/types';
import { 
  BaseItem, 
  ItemVariant, 
  InventoryMovement, 
  ItemAssignment 
} from '@/types/warehouse';

// Import components
import { WarehouseDashboard } from '@/components/warehouse/WarehouseDashboard';
import { BaseItemsList } from '@/components/warehouse/BaseItemsList';
import { ItemVariantsList } from '@/components/warehouse/ItemVariantsList';
import { InventoryMovements } from '@/components/warehouse/InventoryMovements';
import { ItemAssignments } from '@/components/warehouse/ItemAssignments';
import { BaseItemForm } from '@/components/warehouse/BaseItemForm';
import { ItemVariantForm } from '@/components/warehouse/ItemVariantForm';
import { MovementForm } from '@/components/warehouse/MovementForm';
import { AssignmentForm } from '@/components/warehouse/AssignmentForm';
import { ReturnForm } from '@/components/warehouse/ReturnForm';

// Mock data for players
const mockPlayers: Player[] = [
  {
    id: '1',
    name: 'Marco Rossi',
    firstName: 'Marco',
    lastName: 'Rossi',
    email: 'marco@example.com',
    role: 'player',
    position: 'Attaccante',
    strongFoot: 'right',
    stats: {
      games: 10,
      minutesPlayed: 450,
      goals: 5,
      assists: 3,
      yellowCards: 2,
      redCards: 0,
      absences: 1
    }
  },
  {
    id: '2',
    name: 'Paolo Bianchi',
    firstName: 'Paolo',
    lastName: 'Bianchi',
    email: 'paolo@example.com',
    role: 'player',
    position: 'Centrocampista',
    strongFoot: 'left',
    stats: {
      games: 12,
      minutesPlayed: 520,
      goals: 2,
      assists: 6,
      yellowCards: 1,
      redCards: 0,
      absences: 0
    }
  },
  {
    id: '3',
    name: 'Giuseppe Verdi',
    firstName: 'Giuseppe',
    lastName: 'Verdi',
    email: 'giuseppe@example.com',
    role: 'player',
    position: 'Difensore',
    strongFoot: 'right',
    stats: {
      games: 9,
      minutesPlayed: 400,
      goals: 0,
      assists: 1,
      yellowCards: 3,
      redCards: 1,
      absences: 2
    }
  }
];

// Mock data for base items
const mockBaseItems: BaseItem[] = [
  {
    id: '1',
    name: 'Maglia Gara Home',
    category: 'Kit',
    description: 'Maglia ufficiale da gara, colore blu',
    brand: 'Nike',
    sku: 'MG-HOME',
    image: 'https://images.unsplash.com/photo-1580087608321-298cd7d4c599?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3',
    notes: ['Maglia 2023-2024', 'Logo sponsor frontale'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Maglia Gara Away',
    category: 'Kit',
    description: 'Maglia ufficiale da trasferta, colore bianco',
    brand: 'Nike',
    sku: 'MG-AWAY',
    image: 'https://images.unsplash.com/photo-1565693413579-8ff3fdc1b03d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3',
    notes: ['Maglia 2023-2024'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Pantaloncino Gara',
    category: 'Kit',
    description: 'Pantaloncino ufficiale da gara',
    brand: 'Nike',
    sku: 'PG',
    image: 'https://images.unsplash.com/photo-1515355758951-ba5f6bafc0b3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3',
    lastUpdated: new Date().toISOString()
  }
];

// Mock data for item variants
const mockVariants: ItemVariant[] = [
  {
    id: '1',
    baseItemId: '1',
    size: 'S',
    color: '#0000FF',
    uniqueSku: 'MG-HOME-S-BLUE',
    quantity: 5,
    minimumThreshold: 2,
    location: 'Armadio A, Scaffale 1',
    status: 'available',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '2',
    baseItemId: '1',
    size: 'M',
    color: '#0000FF',
    uniqueSku: 'MG-HOME-M-BLUE',
    quantity: 8,
    minimumThreshold: 3,
    location: 'Armadio A, Scaffale 1',
    status: 'available',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '3',
    baseItemId: '1',
    size: 'L',
    color: '#0000FF',
    uniqueSku: 'MG-HOME-L-BLUE',
    quantity: 1,
    minimumThreshold: 2,
    location: 'Armadio A, Scaffale 1',
    status: 'low',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '4',
    baseItemId: '1',
    size: 'XL',
    color: '#0000FF',
    uniqueSku: 'MG-HOME-XL-BLUE',
    quantity: 0,
    minimumThreshold: 2,
    location: 'Armadio A, Scaffale 1',
    status: 'out',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '5',
    baseItemId: '2',
    size: 'S',
    color: '#FFFFFF',
    uniqueSku: 'MG-AWAY-S-WHITE',
    quantity: 3,
    minimumThreshold: 2,
    location: 'Armadio A, Scaffale 2',
    status: 'available',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '6',
    baseItemId: '2',
    size: 'M',
    color: '#FFFFFF',
    uniqueSku: 'MG-AWAY-M-WHITE',
    quantity: 4,
    minimumThreshold: 2,
    location: 'Armadio A, Scaffale 2',
    status: 'available',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '7',
    baseItemId: '3',
    size: 'S',
    color: '#000000',
    uniqueSku: 'PG-S-BLACK',
    quantity: 6,
    minimumThreshold: 3,
    location: 'Armadio B, Scaffale 1',
    status: 'available',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '8',
    baseItemId: '3',
    size: 'M',
    color: '#000000',
    uniqueSku: 'PG-M-BLACK',
    quantity: 6,
    minimumThreshold: 3,
    location: 'Armadio B, Scaffale 1',
    status: 'available',
    lastUpdated: new Date().toISOString()
  }
];

// Mock data for movements
const mockMovements: InventoryMovement[] = [
  {
    id: '1',
    variantId: '1',
    type: 'in',
    quantity: 10,
    date: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
    notes: 'Ordine iniziale',
    performedBy: 'Admin'
  },
  {
    id: '2',
    variantId: '2',
    type: 'in',
    quantity: 10,
    date: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
    notes: 'Ordine iniziale',
    performedBy: 'Admin'
  },
  {
    id: '3',
    variantId: '1',
    type: 'assign',
    quantity: 2,
    date: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
    notes: 'Consegna kit inizio stagione',
    performedBy: 'Admin',
    playerId: '1'
  },
  {
    id: '4',
    variantId: '2',
    type: 'assign',
    quantity: 2,
    date: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
    notes: 'Consegna kit inizio stagione',
    performedBy: 'Admin',
    playerId: '2'
  },
  {
    id: '5',
    variantId: '1',
    type: 'out',
    quantity: 3,
    date: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    notes: 'Danneggiati durante il trasporto',
    performedBy: 'Admin'
  }
];

// Mock data for assignments
const mockAssignments: ItemAssignment[] = [
  {
    id: '1',
    variantId: '1',
    playerId: '1',
    playerName: 'Marco Rossi',
    assignDate: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
    quantity: 2,
    notes: 'Maglia gara numerata',
    status: 'assigned'
  },
  {
    id: '2',
    variantId: '2',
    playerId: '2',
    playerName: 'Paolo Bianchi',
    assignDate: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
    quantity: 2,
    notes: 'Maglia gara numerata',
    status: 'assigned'
  },
  {
    id: '3',
    variantId: '7',
    playerId: '1',
    playerName: 'Marco Rossi',
    assignDate: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
    returnDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    quantity: 1,
    notes: 'Pantaloncino gara',
    status: 'returned'
  }
];

// Dialog types
type DialogType = 'addItem' | 'editItem' | 'addVariant' | 'editVariant' | 
                 'addMovement' | 'addAssignment' | 'returnItem' | 'none';

const Warehouse = () => {
  const { showNotification } = useNotifications();
  
  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [items, setItems] = useState<(BaseItem & { variants: ItemVariant[] })[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [assignments, setAssignments] = useState<ItemAssignment[]>([]);
  
  // View management
  const [selectedItem, setSelectedItem] = useState<BaseItem | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ItemVariant | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<ItemAssignment | null>(null);
  const [showVariants, setShowVariants] = useState(false);
  
  // Dialog management
  const [dialogType, setDialogType] = useState<DialogType>('none');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string, type: 'item' | 'variant' } | null>(null);
  
  // Initialize data
  useEffect(() => {
    // Create objects with relationships
    const itemsWithVariants = mockBaseItems.map(item => ({
      ...item,
      variants: mockVariants.filter(v => v.baseItemId === item.id)
    }));
    
    const movementsWithRelations = mockMovements.map(movement => {
      const variant = mockVariants.find(v => v.id === movement.variantId);
      const baseItem = variant ? mockBaseItems.find(item => item.id === variant.baseItemId) : undefined;
      const player = movement.playerId ? mockPlayers.find(p => p.id === movement.playerId) : undefined;
      
      return {
        ...movement,
        variant,
        baseItem,
        playerName: player ? `${player.firstName} ${player.lastName}` : undefined
      };
    });
    
    const assignmentsWithRelations = mockAssignments.map(assignment => {
      const variant = mockVariants.find(v => v.id === assignment.variantId);
      const baseItem = variant ? mockBaseItems.find(item => item.id === variant.baseItemId) : undefined;
      
      return {
        ...assignment,
        variant,
        baseItem
      };
    });
    
    setItems(itemsWithVariants);
    setMovements(movementsWithRelations);
    setAssignments(assignmentsWithRelations);
  }, []);
  
  // Handle create base item
  const handleCreateBaseItem = (data: any) => {
    const newItem: BaseItem = {
      ...data,
      id: `item-${Date.now()}`,
      lastUpdated: new Date().toISOString()
    };
    
    setItems(prev => [...prev, { ...newItem, variants: [] }]);
    setDialogType('none');
    
    showNotification('success', 'Articolo creato', {
      description: "Il nuovo articolo è stato aggiunto al magazzino",
    });
  };
  
  // Handle update base item
  const handleUpdateBaseItem = (data: any) => {
    if (!selectedItem) return;
    
    const updatedItems = items.map(item => {
      if (item.id === selectedItem.id) {
        return { 
          ...item, 
          ...data, 
          lastUpdated: new Date().toISOString() 
        };
      }
      return item;
    });
    
    setItems(updatedItems);
    setDialogType('none');
    
    showNotification('success', 'Articolo aggiornato', {
      description: "Le modifiche all'articolo sono state salvate",
    });
  };
  
  // Handle delete base item
  const handleDeleteBaseItem = (itemId: string) => {
    // Delete the item and all its variants
    setItems(prev => prev.filter(item => item.id !== itemId));
    
    // Delete movements related to the variants of this item
    const variantIds = items.find(item => item.id === itemId)?.variants.map(v => v.id) || [];
    setMovements(prev => prev.filter(m => !variantIds.includes(m.variantId)));
    
    // Delete assignments related to the variants of this item
    setAssignments(prev => prev.filter(a => !variantIds.includes(a.variantId)));
    
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
      lastUpdated: new Date().toISOString()
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
        variantId: newVariant.id,
        type: 'in',
        quantity: data.quantity,
        date: new Date().toISOString(),
        notes: 'Creazione variante',
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
                lastUpdated: new Date().toISOString()
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
        variantId: selectedVariant.id,
        type: quantityDifference > 0 ? 'in' : 'out',
        quantity: Math.abs(quantityDifference),
        date: new Date().toISOString(),
        notes: 'Aggiornamento variante',
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
    const player = data.playerId ? mockPlayers.find(p => p.id === data.playerId) : undefined;
    
    if (!baseItem || !variant) return;
    
    // Create new movement
    const newMovement: InventoryMovement = {
      id: `mov-${Date.now()}`,
      variantId: data.variantId,
      type: data.type,
      quantity: data.quantity,
      date: data.date.toISOString(),
      notes: data.notes,
      performedBy: 'Admin', // In a real app, this would be the logged-in user
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
                               newQuantity <= v.minimumThreshold ? 'low' :
                               'available' as 'available' | 'low' | 'out';
              
              return {
                ...v,
                quantity: newQuantity,
                status: newStatus,
                lastUpdated: new Date().toISOString()
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
    const player = mockPlayers.find(p => p.id === data.playerId);
    
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
      variantId: data.variantId,
      type: 'assign',
      quantity: data.quantity,
      date: data.assignDate.toISOString(),
      notes: data.notes,
      performedBy: 'Admin',
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
                lastUpdated: new Date().toISOString()
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
        variantId: selectedAssignment.variantId,
        type: 'return',
        quantity: selectedAssignment.quantity,
        date: data.returnDate.toISOString(),
        notes: data.notes,
        performedBy: 'Admin',
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
                  lastUpdated: new Date().toISOString()
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
        variantId: selectedAssignment.variantId,
        type: data.returnedCondition === 'damaged' ? 'damaged' : 'lost',
        quantity: selectedAssignment.quantity,
        date: data.returnDate.toISOString(),
        notes: data.notes,
        performedBy: 'Admin',
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
  
  return (
    <div className="container mx-auto p-2 sm:p-4 space-y-6 content-wrapper">
      <div className="flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold">Magazzino</h1>
      </div>

      <Tabs defaultValue="dashboard" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full sm:w-auto flex overflow-x-auto">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="catalog">Catalogo</TabsTrigger>
          <TabsTrigger value="movements">Movimenti</TabsTrigger>
          <TabsTrigger value="assignments">Assegnazioni</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6 p-1">
          <WarehouseDashboard 
            lowStockItems={lowStockItems}
            recentAssignments={recentAssignments}
          />
        </TabsContent>

        <TabsContent value="catalog" className="p-1">
          {showVariants && selectedItem ? (
            <ItemVariantsList
              variants={items.find(item => item.id === selectedItem.id)?.variants || []}
              onEdit={(variant) => {
                setSelectedVariant(variant);
                setDialogType('editVariant');
              }}
              onDelete={(variant) => {
                setDeleteTarget({ id: variant.id, type: 'variant' });
                setIsDeleteModalOpen(true);
              }}
              onAddVariant={() => {
                setDialogType('addVariant');
              }}
            />
          ) : (
            <BaseItemsList
              items={items}
              onSelectItem={(item) => {
                setSelectedItem(item);
                setShowVariants(true);
              }}
              onEditItem={onEditItem}
              onDeleteItem={(item) => {
                setSelectedItem(item);
                setDeleteTarget({ id: item.id, type: 'item' });
                setIsDeleteModalOpen(true);
              }}
              onAddItem={() => setDialogType('addItem')}
            />
          )}
        </TabsContent>

        <TabsContent value="movements" className="p-1">
          <InventoryMovements 
            movements={movements}
            onAddMovement={() => setDialogType('addMovement')}
          />
        </TabsContent>
        
        <TabsContent value="assignments" className="p-1">
          <ItemAssignments 
            assignments={assignments}
            players={mockPlayers}
            onAddAssignment={() => setDialogType('addAssignment')}
            onMarkReturned={(assignment) => {
              setSelectedAssignment(assignment);
              setDialogType('returnItem');
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Base Item Dialog */}
      <Dialog open={dialogType === 'addItem' || dialogType === 'editItem'} onOpenChange={(open) => {
        if (!open) setDialogType('none');
      }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {dialogType === 'addItem' ? 'Aggiungi articolo' : 'Modifica articolo'}
            </DialogTitle>
          </DialogHeader>
          <BaseItemForm 
            item={dialogType === 'editItem' ? selectedItem || undefined : undefined}
            onSubmit={dialogType === 'addItem' ? handleCreateBaseItem : handleUpdateBaseItem}
            onCancel={() => setDialogType('none')}
          />
        </DialogContent>
      </Dialog>

      {/* Item Variant Dialog */}
      <Dialog open={dialogType === 'addVariant' || dialogType === 'editVariant'} onOpenChange={(open) => {
        if (!open) setDialogType('none');
      }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {dialogType === 'addVariant' ? 'Aggiungi variante' : 'Modifica variante'}
            </DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <ItemVariantForm 
              baseItem={selectedItem}
              variant={dialogType === 'editVariant' ? selectedVariant || undefined : undefined}
              onSubmit={dialogType === 'addVariant' ? handleCreateVariant : handleUpdateVariant}
              onCancel={() => setDialogType('none')}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Movement Dialog */}
      <Dialog open={dialogType === 'addMovement'} onOpenChange={(open) => {
        if (!open) setDialogType('none');
      }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Registra movimento</DialogTitle>
          </DialogHeader>
          <MovementForm 
            items={items}
            players={mockPlayers}
            onSubmit={handleAddMovement}
            onCancel={() => setDialogType('none')}
          />
        </DialogContent>
      </Dialog>

      {/* Assignment Dialog */}
      <Dialog open={dialogType === 'addAssignment'} onOpenChange={(open) => {
        if (!open) setDialogType('none');
      }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Nuova assegnazione</DialogTitle>
          </DialogHeader>
          <AssignmentForm 
            items={items}
            players={mockPlayers}
            onSubmit={handleAddAssignment}
            onCancel={() => setDialogType('none')}
          />
        </DialogContent>
      </Dialog>

      {/* Return Dialog */}
      <Dialog open={dialogType === 'returnItem'} onOpenChange={(open) => {
        if (!open) setDialogType('none');
      }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Registra restituzione</DialogTitle>
          </DialogHeader>
          {selectedAssignment && (
            <ReturnForm 
              assignment={selectedAssignment}
              onSubmit={handleMarkReturned}
              onCancel={() => {
                setDialogType('none');
                setSelectedAssignment(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={() => {
          if (deleteTarget) {
            if (deleteTarget.type === 'item') {
              handleDeleteBaseItem(deleteTarget.id);
            } else {
              handleDeleteVariant(deleteTarget.id);
            }
          }
        }}
        title={`Conferma eliminazione ${deleteTarget?.type === 'item' ? 'articolo' : 'variante'}`}
        description={`Sei sicuro di voler eliminare ${deleteTarget?.type === 'item' ? 'questo articolo e tutte le sue varianti' : 'questa variante'}? Questa azione non può essere annullata.`}
        confirmText="Elimina"
        cancelText="Annulla"
        toastMessage={`${deleteTarget?.type === 'item' ? 'Articolo' : 'Variante'} eliminato`}
        toastDescription={`${deleteTarget?.type === 'item' ? 'L\'articolo' : 'La variante'} è stato rimosso dal magazzino`}
      />
    </div>
  );
};

export default Warehouse;
