
export type UserRole = 'player' | 'coach' | 'admin' | 'medical';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
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
  type: 'contract' | 'medical' | 'admin' | 'training';
  uploadDate: string;
  userId: string;
  teamId?: string;
  url: string;
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

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  type: 'training' | 'match' | 'medical' | 'meeting';
  teamId?: string;
  attendees?: string[];
  location?: string;
  requiresMedical?: boolean;
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
  doctorId?: string;
}
