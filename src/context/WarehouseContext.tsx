
import React, {createContext, useContext, useState} from 'react';
import {BaseItem, InventoryMovement, ItemAssignment, ItemVariant, MovementType} from '@/types/warehouse';
import {Player} from '@/types';
import {useNotifications} from '@/context/NotificationContext';
import {useWarehouseData} from '@/hooks/useWarehouseData';
import { toast } from 'sonner';

// We're using the players mock data since we haven't migrated that to the database yet
import { mockWarehousePlayers as mockPlayers } from '@/utils/warehouse/mockWarehouseData';

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
    
    // This needs to be updated to use a mutation instead of directly modifying state
    // TODO: Implement createVariant mutation in the useWarehouseData hook
    showNotification('info', 'Funzionalità in sviluppo', {
      description: "La creazione di varianti è in fase di implementazione",
    });
    setDialogType('none');
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
    
    // This needs to be updated to use a mutation instead of directly modifying state
    // TODO: Implement updateVariant mutation in the useWarehouseData hook
    showNotification('info', 'Funzionalità in sviluppo', {
      description: "L'aggiornamento delle varianti è in fase di implementazione",
    });
    setDialogType('none');
  };
  
  // Handle delete variant
  const handleDeleteVariant = (variantId: string) => {
    if (!selectedItem) return;
    
    // This needs to be updated to use a mutation instead of directly modifying state
    // TODO: Implement deleteVariant mutation in the useWarehouseData hook
    showNotification('info', 'Funzionalità in sviluppo', {
      description: "L'eliminazione delle varianti è in fase di implementazione",
    });
    
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  };
  
  // Handle stock adjustment (new movement)
  const handleAddMovement = (data: any) => {
    // This needs to be updated to use a mutation instead of directly modifying state
    // TODO: Implement addMovement mutation in the useWarehouseData hook
    showNotification('info', 'Funzionalità in sviluppo', {
      description: "La registrazione dei movimenti è in fase di implementazione",
    });
    setDialogType('none');
  };
  
  // Handle new assignment
  const handleAddAssignment = (data: any) => {
    // This needs to be updated to use a mutation instead of directly modifying state
    // TODO: Implement addAssignment mutation in the useWarehouseData hook
    showNotification('info', 'Funzionalità in sviluppo', {
      description: "La creazione di assegnazioni è in fase di implementazione",
    });
    setDialogType('none');
  };
  
  // Handle mark assignment as returned
  const handleMarkReturned = (data: any) => {
    if (!selectedAssignment) return;
    
    // This needs to be updated to use a mutation instead of directly modifying state
    // TODO: Implement markAssignmentReturned mutation in the useWarehouseData hook
    showNotification('info', 'Funzionalità in sviluppo', {
      description: "La registrazione delle restituzioni è in fase di implementazione",
    });
    
    setDialogType('none');
    setSelectedAssignment(null);
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
