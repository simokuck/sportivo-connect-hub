
import { BaseItem, InventoryMovement, ItemAssignment, ItemVariant, Player } from '@/types/warehouse';

export type DialogType = 'addItem' | 'editItem' | 'addVariant' | 'editVariant' | 
                        'addMovement' | 'addAssignment' | 'returnItem' | 'none';

export interface DeleteTarget {
  id: string;
  type: 'item' | 'variant';
}

export interface WarehouseContextType {
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
