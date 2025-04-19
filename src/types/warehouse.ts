
export interface ItemSize {
  label: string;
  quantity: number;
  status?: 'available' | 'low' | 'out';
}

export interface BaseItem {
  id: string;
  name: string;
  category: string;
  description?: string;
  brand?: string;
  image?: string;
  sku: string;
  notes?: string[];
  lastUpdated?: string;
}

export interface ItemVariant {
  id: string;
  baseItemId: string;
  size: string;
  color: string;
  uniqueSku: string;
  quantity: number;
  minimumThreshold: number;
  location?: string;
  status: 'available' | 'low' | 'out';
  lastUpdated?: string;
}

export type MovementType = 'in' | 'out' | 'assign' | 'return' | 'lost' | 'damaged';

export interface InventoryMovement {
  id: string;
  variantId: string;
  type: MovementType;
  quantity: number;
  date: string;
  notes?: string;
  performedBy?: string;
  playerId?: string;
  baseItem?: BaseItem;
  variant?: ItemVariant;
  playerName?: string;
}

export interface ItemAssignment {
  id: string;
  variantId: string;
  playerId: string;
  playerName: string;
  assignDate: string;
  returnDate?: string;
  expectedReturnDate?: string;
  returnedCondition?: 'good' | 'damaged' | 'lost';
  notes?: string;
  quantity: number;
  status: 'assigned' | 'returned' | 'pending';
  baseItem?: BaseItem;
  variant?: ItemVariant;
}

export interface WarehouseItem {
  id: string;
  name: string;
  category: string;
  quantity?: number;
  sizes?: ItemSize[];
  status?: 'available' | 'low' | 'out';
  image?: string;
  lastUpdated?: string;
  location?: string;
  supplier?: string;
  color?: string;
  material?: string;
  features?: string[];
  notes?: string[];
  hasSizes?: boolean;
  sizesType?: 'numeric' | 'letter' | 'standard' | 'custom';
}
