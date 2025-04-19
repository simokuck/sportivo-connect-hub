export type UserRole = 'player' | 'coach' | 'admin' | 'medical' | 'developer';

export interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  avatar?: string;
  birthDate?: string;
  address?: string;
  city?: string;
  biometricEnabled?: boolean;
  role: UserRole;
  teams?: Team[];
}

export interface Team {
  id: string;
  name: string;
  category: string;
  players?: Player[];
  coaches?: User[];
}

export interface Player extends User {
  position: string;
  strongFoot: 'left' | 'right' | 'both';
  stats: PlayerStats;
  medicalInfo?: MedicalInfo;
  isCompliant?: boolean;
}

export interface PlayerStats {
  games: number;
  minutesPlayed: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  absences: number;
}

export interface Document {
  id: string;
  title: string;
  type: 'contract' | 'medical' | 'admin' | 'training' | 'template';
  uploadDate: string;
  userId: string;
  teamId?: string;
  url: string;
  templateData?: Record<string, any>; // For template documents
  isTemplate?: boolean;
}

export interface TrainingExercise {
  id: string;
  title: string;
  description: string;
  category: 'technical' | 'tactical' | 'physical' | 'mental';
  duration: number;
  createdBy: string;
  forPosition?: string[];
  playersNeeded?: number;
  groupsNeeded?: number;
  videoUrl?: string;
}

export interface TrainingPlan {
  id: string;
  title: string;
  description: string;
  exercises: TrainingExercise[];
  date: string;
  totalDuration: number;
  teamId?: string;
  createdBy: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  type: 'training' | 'match' | 'medical' | 'meeting';
  teamId?: string;
  userId?: string; // Added for private events
  attendees?: string[];
  location?: string;
  coordinates?: [number, number]; // Added for map integration
  requiresMedical?: boolean;
  canEdit: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'warning' | 'error' | 'success';
  forRoles?: UserRole[];
  forTeams?: string[];
  forUsers?: string[];
}

export interface MedicalInfo {
  id: string;
  playerId: string;
  certificateExpiry: string;
  notes?: string;
  conditions?: string[];
  doctorIdId?: string;
}

export interface DocumentTemplate {
  id: string;
  title: string;
  type: 'contract' | 'medical' | 'admin' | 'training';
  content: string;
  fields: string[]; // Fields that can be filled
  createdBy: string;
}
