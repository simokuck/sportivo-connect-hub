
export type UserRole = 'player' | 'coach' | 'admin' | 'medical' | 'developer';

export type Player = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  position?: string;
  strongFoot?: string;
  avatar?: string;
  birthDate?: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  isCompliant?: boolean;
  stats?: {
    games: number;
    minutesPlayed: number;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
    absences: number;
  };
};

export type Team = {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  players?: Player[];
  coaches?: User[];
};

export type User = {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  image?: string;
  avatar?: string;
  role: UserRole;
  birthDate?: string;
  address?: string;
  city?: string;
  biometricEnabled?: boolean;
  teams?: Team[];
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

export type Document = {
  id: string;
  title: string;
  type: string;
  fileUrl: string;
  thumbnailUrl?: string;
  category: string;
  tags?: string[];
  uploadDate: string;
  playerId?: string;
  teamId?: string;
  expiryDate?: string;
  status?: 'valid' | 'expired' | 'pending';
  size?: number;
};

export type DocumentTemplate = {
  id: string;
  name: string;
  description?: string;
  fileUrl: string;
  category: string;
  tags?: string[];
  createdAt: string;
};

export type TrainingExercise = {
  id: string;
  name: string;
  description: string;
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  category: string;
  equipment?: string[];
  videoUrl?: string;
  imageUrl?: string;
  instructions?: string[];
  goals?: string[];
  variations?: string[];
};

export type CalendarEvent = Event;

export type Notification = {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  forRoles?: UserRole[];
  forUsers?: string[];
  type?: 'info' | 'warning' | 'error' | 'success';
};

export type MedicalInfo = {
  id: string;
  playerId: string;
  height?: number;
  weight?: number;
  bloodType?: string;
  allergies?: string[];
  medications?: string[];
  notes?: string;
  lastCheckup?: string;
  certificateExpiry?: string;
  certificateUrl?: string;
  status: 'valid' | 'expired' | 'pending';
};
