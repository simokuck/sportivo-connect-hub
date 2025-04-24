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
  role?: UserRole; // Adding role property to match mock data
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
  status: 'available' | 'low_stock' | 'out_of_stock' | 'low' | 'out';
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
  recipients: string[];
  teamId?: string;
  requiresMedical?: boolean;
  lat?: number;
  lng?: number;
  canEdit?: boolean; // Adding properties used in mockData
  attendees?: string[]; // Adding properties used in mockData
};

export type Document = {
  id: string;
  title: string;
  type: string;
  fileUrl?: string; // Changed to optional since some places use 'url' instead
  url?: string; // Added to support existing code
  thumbnailUrl?: string;
  category: string;
  tags?: string[];
  uploadDate: string;
  playerId?: string;
  teamId?: string;
  userId?: string; // Added to support existing code
  expiryDate?: string;
  status?: 'valid' | 'expired' | 'pending';
  size?: number;
  isTemplate?: boolean;
  templateData?: {
    templateId: string;
    content: string;
    additionalFields?: Record<string, any>;
  };
};

export type DocumentTemplate = {
  id: string;
  name?: string; // Optional since some code uses title
  title?: string; // Added to support existing code
  description?: string;
  fileUrl?: string;
  content?: string; // Added to support existing code
  category?: string;
  tags?: string[];
  createdAt?: string;
  fields?: string[]; // Added to support existing code
  type?: string; // Added to support existing code
  createdBy?: string; // Added to support existing code
};

export type TrainingExercise = {
  id: string;
  name?: string; // Optional since some code uses title instead
  title?: string; // Added to support existing code
  description: string;
  duration: number;
  intensity?: 'low' | 'medium' | 'high';
  category: string;
  equipment?: string[];
  videoUrl?: string;
  imageUrl?: string;
  instructions?: string[];
  goals?: string[];
  variations?: string[];
  playersNeeded?: number; // Added to support existing code
  groupsNeeded?: number; // Added to support existing code
  forPosition?: string[]; // Added to support existing code
  createdBy?: string; // Added to support existing code
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
  forTeams?: string[]; // Added to support existing code
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
  doctorIdId?: string; // Added to support existing code
  conditions?: string[]; // Added to support existing code
};
