
import { Player, Team, Document, TrainingExercise, CalendarEvent, Notification, MedicalInfo } from '@/types';

// Players mock data
export const mockPlayers: Player[] = [
  {
    id: '1',
    name: 'Marco Rossi',
    email: 'marco@example.com',
    role: 'player',
    avatar: '/assets/avatars/player1.jpg',
    position: 'Attaccante',
    strongFoot: 'right',
    stats: {
      games: 20,
      minutesPlayed: 1450,
      goals: 12,
      assists: 5,
      yellowCards: 2,
      redCards: 0,
      absences: 1
    }
  },
  {
    id: '5',
    name: 'Luca Bianchi',
    email: 'luca@example.com',
    role: 'player',
    avatar: '/assets/avatars/player2.jpg',
    position: 'Centrocampista',
    strongFoot: 'left',
    stats: {
      games: 18,
      minutesPlayed: 1530,
      goals: 3,
      assists: 9,
      yellowCards: 4,
      redCards: 1,
      absences: 0
    }
  },
  {
    id: '6',
    name: 'Alessandro Verdi',
    email: 'alessandro@example.com',
    role: 'player',
    avatar: '/assets/avatars/player3.jpg',
    position: 'Difensore',
    strongFoot: 'right',
    stats: {
      games: 22,
      minutesPlayed: 1890,
      goals: 1,
      assists: 2,
      yellowCards: 3,
      redCards: 0,
      absences: 2
    }
  }
];

// Teams mock data
export const mockTeams: Team[] = [
  {
    id: '1',
    name: 'Prima Squadra',
    category: 'Senior',
    players: mockPlayers,
    coaches: [{
      id: '2',
      name: 'Paolo Bianchi',
      email: 'paolo@example.com',
      role: 'coach',
      avatar: '/assets/avatars/coach1.jpg'
    }]
  },
  {
    id: '2',
    name: 'Under 17',
    category: 'Juniores',
    players: [mockPlayers[0]], // Just a reference
    coaches: [{
      id: '2',
      name: 'Paolo Bianchi',
      email: 'paolo@example.com',
      role: 'coach',
      avatar: '/assets/avatars/coach1.jpg'
    }]
  }
];

// Documents mock data
export const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Contratto Marco Rossi',
    type: 'contract',
    uploadDate: '2024-01-15',
    userId: '1',
    url: '#'
  },
  {
    id: '2',
    title: 'Certificato Medico Luca Bianchi',
    type: 'medical',
    uploadDate: '2024-02-10',
    userId: '5',
    url: '#'
  },
  {
    id: '3',
    title: 'Programma Allenamento Settimanale',
    type: 'training',
    uploadDate: '2024-03-01',
    userId: '2',
    teamId: '1',
    url: '#'
  }
];

// Training Exercises mock data
export const mockExercises: TrainingExercise[] = [
  {
    id: '1',
    title: 'Passaggi in Triangolo',
    description: 'Esercizio di passaggi rapidi in triangolo con movimento senza palla',
    category: 'technical',
    duration: 15,
    createdBy: '2'
  },
  {
    id: '2',
    title: 'Lavoro Aerobico',
    description: 'Corsa a media intensità con variazioni di ritmo',
    category: 'physical',
    duration: 20,
    createdBy: '2'
  },
  {
    id: '3',
    title: 'Possesso Palla 5 vs 2',
    description: 'Esercizio di possesso con superiorità numerica',
    category: 'tactical',
    duration: 25,
    createdBy: '2',
    forPosition: ['Centrocampista', 'Difensore']
  }
];

// Calendar Events mock data
export const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Allenamento Prima Squadra',
    description: 'Lavoro tattico e aerobico',
    start: '2024-04-18T18:00:00',
    end: '2024-04-18T20:00:00',
    type: 'training',
    teamId: '1',
    location: 'Campo Principale'
  },
  {
    id: '2',
    title: 'Partita vs Sporting Club',
    description: 'Campionato - Giornata 24',
    start: '2024-04-21T15:00:00',
    end: '2024-04-21T17:00:00',
    type: 'match',
    teamId: '1',
    location: 'Stadio Comunale',
    requiresMedical: true
  },
  {
    id: '3',
    title: 'Visite Mediche Annuali',
    description: 'Controlli di routine per Under 17',
    start: '2024-04-19T09:00:00',
    end: '2024-04-19T13:00:00',
    type: 'medical',
    teamId: '2',
    attendees: ['4', '5', '6'],
    location: 'Centro Medico Sportivo'
  }
];

// Notifications mock data
export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Allenamento Spostato',
    message: 'L\'allenamento di oggi è spostato alle 18:30',
    date: '2024-04-17T10:00:00',
    read: false,
    type: 'info',
    forTeams: ['1']
  },
  {
    id: '2',
    title: 'Documento Aggiornato',
    message: 'Nuovo programma settimanale disponibile',
    date: '2024-04-16T14:30:00',
    read: true,
    type: 'info',
    forRoles: ['coach']
  },
  {
    id: '3',
    title: 'Visita Medica Programmata',
    message: 'Sei atteso per la visita medica venerdì 19 Aprile',
    date: '2024-04-15T09:15:00',
    read: false,
    type: 'warning',
    forUsers: ['1']
  }
];

// Medical Info mock data
export const mockMedicalInfo: MedicalInfo[] = [
  {
    id: '1',
    playerId: '1',
    certificateExpiry: '2024-12-15',
    notes: 'Nessuna controindicazione all\'attività sportiva',
    doctorId: '4'
  },
  {
    id: '2',
    playerId: '5',
    certificateExpiry: '2024-10-22',
    notes: 'Precedente infortunio al ginocchio, monitorare',
    conditions: ['Lieve tendinite'],
    doctorId: '4'
  },
  {
    id: '3',
    playerId: '6',
    certificateExpiry: '2024-11-05',
    notes: 'Nessuna controindicazione',
    doctorId: '4'
  }
];
