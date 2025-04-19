export type Team = {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  teamId?: string;
};

export type Item = {
  id: string;
  name: string;
  description?: string;
  images?: string[];
  category: string;
  brand?: string;
  purchasePrice: number;
  salePrice: number;
  sku?: string;
  barcode?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

export type ItemVariant = {
  id: string;
  itemId: string;
  color: string;
  size: string;
  quantity: number;
  status: 'available' | 'low_stock' | 'out_of_stock';
  createdAt: Date;
  updatedAt: Date;
};

export type Event = {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  type: "training" | "match" | "medical" | "meeting";
  location?: string;
  isPrivate: boolean;
  teamId?: string;
  requiresMedical?: boolean;
  lat?: number;
  lng?: number;
};
