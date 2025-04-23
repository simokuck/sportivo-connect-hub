

export interface BaseItem {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  category: string;
  supplier?: string;
  purchasePrice?: number;
  sellingPrice?: number;
  sku?: string;
  barcode?: string;
  attributes?: { key: string; value: string }[];
  createdAt: Date;
  updatedAt: Date;
  // Additional properties needed by the components
  image?: string;
  brand?: string;
  notes?: string[];
  lastUpdated?: string;
  status?: string;
  quantity?: number;
  color?: string;
  hasSizes?: boolean;
  location?: string;
  material?: string;
  features?: string[];
}

export interface ItemVariant {
  id: string;
  baseItemId: string;
  color?: string;
  size?: string;
  quantity: number;
  sku?: string;
  barcode?: string;
  purchasePrice?: number;
  sellingPrice?: number;
  attributes?: { key: string; value: string }[];
  createdAt: Date;
  updatedAt: Date;
  // Additional properties needed by the components
  uniqueSku?: string;
  minimumThreshold?: number;
  location?: string;
  status?: 'available' | 'low' | 'out' | 'low_stock' | 'out_of_stock';
  lastUpdated?: string;
}

// Movement type definition
export interface Movement {
  id: string;
  baseItemId: string;
  variantId?: string;
  type: MovementType;
  quantity: number;
  date: string;
  note?: string;
  userId?: string;
  assigneeId?: string;
  color?: string;
  size?: string;
  status?: 'pending' | 'completed' | 'cancelled';
  // Additional properties needed
  variant?: ItemVariant;
  baseItem?: BaseItem;
  item?: BaseItem;
  operator?: { name: string };
  playerName?: string;
  playerId?: string;
  performedBy?: string;
}

export type MovementType = 'in' | 'out' | 'assign' | 'return' | 'lost' | 'damaged';

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Supplier {
  id: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ItemAssignment type
export interface ItemAssignment {
  id: string;
  variantId: string;
  playerId: string;
  playerName: string;
  assignDate: string;
  expectedReturnDate?: string;
  returnDate?: string;
  quantity: number;
  notes?: string;
  status: 'assigned' | 'returned' | 'lost';
  baseItem?: BaseItem;
  variant?: ItemVariant;
  returnedCondition?: string;
}

// ItemSize type
export interface ItemSize {
  id?: string;
  name?: string;
  order?: number;
  label: string;
  quantity: number;
  status?: 'available' | 'low' | 'out';
}

// WarehouseItem type used by some components
export interface WarehouseItem extends BaseItem {
  variants: ItemVariant[];
  sizes?: ItemSize[];
  quantity?: number;
  status?: string;
  hasSizes?: boolean;
  color?: string;
  material?: string;
  features?: string[];
  location?: string;
}

// InventoryMovement type used in contexts - make it the same as Movement to resolve the errors
export interface InventoryMovement extends Movement {
  // Extends Movement with all the same properties
}

// Player type that matches both what our components need and what the database provides
export interface Player {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  position?: string;
  strong_foot?: string;
  avatar_url?: string;
  createdAt?: Date;
  updatedAt?: Date;
  // Required properties for compatibility with src/types/index.ts Player interface
  name: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

