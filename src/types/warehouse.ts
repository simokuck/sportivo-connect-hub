
export interface ItemSize {
  label: string;
  quantity: number;
  status?: 'available' | 'low' | 'out';
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
  // Item sizes fields
  hasSizes?: boolean;
  sizesType?: 'numeric' | 'letter' | 'standard' | 'custom';
}
