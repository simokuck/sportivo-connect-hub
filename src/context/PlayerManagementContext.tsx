
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, UserRole, Player } from '@/types';
import { 
  Season, 
  TeamCategory, 
  TeamGroup, 
  PlayerRegistration, 
  PlayerConsent, 
  PlayerTeamHistory 
} from '@/types/player-management';
import { useNotifications } from '@/context/NotificationContext';

// Mock data per simulare il database
const mockSeasons: Season[] = [
  {
    id: 'season-1',
    name: '2023/2024',
    startDate: '2023-09-01',
    endDate: '2024-06-30',
    isActive: false,
    createdAt: '2023-07-15T10:00:00.000Z',
  },
  {
    id: 'season-2',
    name: '2024/2025',
    startDate: '2024-09-01',
    endDate: '2025-06-30',
    isActive: true,
    createdAt: '2024-07-10T10:00:00.000Z',
  },
];

const mockCategories: TeamCategory[] = [
  {
    id: 'cat-1',
    name: 'Allievi',
    ageMin: 15,
    ageMax: 16,
    seasonId: 'season-2',
  },
  {
    id: 'cat-2',
    name: 'Juniores',
    ageMin: 17,
    ageMax: 18,
    seasonId: 'season-2',
  },
  {
    id: 'cat-3',
    name: 'Prima Squadra',
    ageMin: 19,
    seasonId: 'season-2',
  },
  {
    id: 'cat-4',
    name: 'Allievi',
    ageMin: 15,
    ageMax: 16,
    seasonId: 'season-1',
  },
];

const mockTeamGroups: TeamGroup[] = [
  {
    id: 'team-1',
    name: 'Allievi A',
    categoryId: 'cat-1',
    seasonId: 'season-2',
    isArchived: false,
    playersIds: ['player-1', 'player-2'],
    coachesIds: ['2'], // ID dell'utente coach
    createdAt: '2024-07-20T10:00:00.000Z',
  },
  {
    id: 'team-2',
    name: 'Allievi B',
    categoryId: 'cat-1',
    seasonId: 'season-2',
    isArchived: false,
    playersIds: ['player-3'],
    coachesIds: ['2'],
    createdAt: '2024-07-20T10:30:00.000Z',
  },
  {
    id: 'team-3',
    name: 'Juniores',
    categoryId: 'cat-2',
    seasonId: 'season-2',
    isArchived: false,
    playersIds: ['player-4', 'player-5'],
    coachesIds: ['2'],
    createdAt: '2024-07-21T10:00:00.000Z',
  },
  {
    id: 'team-4',
    name: 'Prima Squadra',
    categoryId: 'cat-3',
    seasonId: 'season-2',
    isArchived: false,
    playersIds: ['player-6'],
    coachesIds: ['2'],
    createdAt: '2024-07-22T10:00:00.000Z',
  },
  {
    id: 'team-5',
    name: 'Allievi 2023',
    categoryId: 'cat-4',
    seasonId: 'season-1',
    isArchived: true,
    playersIds: ['player-1', 'player-2'],
    coachesIds: ['2'],
    createdAt: '2023-07-20T10:00:00.000Z',
  },
];

const mockPlayerRegistrations: PlayerRegistration[] = [
  {
    id: 'reg-1',
    playerId: 'player-1',
    firstName: 'Marco',
    lastName: 'Rossi',
    birthDate: '2008-05-10',
    isMinor: true,
    contactEmail: 'genitore.rossi@example.com',
    guardianName: 'Paolo Rossi',
    guardianRelationship: 'Padre',
    status: 'active',
    registrationCompletedAt: '2024-07-25T14:30:00.000Z',
    seasonId: 'season-2',
    teamGroupsIds: ['team-1'],
    consentsIds: ['consent-1', 'consent-2', 'consent-3'],
  },
  {
    id: 'reg-2',
    playerId: 'player-2',
    firstName: 'Luca',
    lastName: 'Bianchi',
    birthDate: '2009-03-22',
    isMinor: true,
    contactEmail: 'genitore.bianchi@example.com',
    guardianName: 'Maria Bianchi',
    guardianRelationship: 'Madre',
    status: 'active',
    registrationCompletedAt: '2024-07-26T10:15:00.000Z',
    seasonId: 'season-2',
    teamGroupsIds: ['team-1'],
    consentsIds: ['consent-4', 'consent-5', 'consent-6'],
  },
  // ... altri giocatori
];

const mockPlayerConsents: PlayerConsent[] = [
  {
    id: 'consent-1',
    playerId: 'player-1',
    type: 'terms',
    version: '1.0',
    signedAt: '2024-07-25T14:15:00.000Z',
    signedByIp: '192.168.1.1',
    signedByEmail: 'genitore.rossi@example.com',
    isGuardian: true,
  },
  {
    id: 'consent-2',
    playerId: 'player-1',
    type: 'privacy',
    version: '1.0',
    signedAt: '2024-07-25T14:20:00.000Z',
    signedByIp: '192.168.1.1',
    signedByEmail: 'genitore.rossi@example.com',
    isGuardian: true,
  },
  {
    id: 'consent-3',
    playerId: 'player-1',
    type: 'regulations',
    version: '1.0',
    signedAt: '2024-07-25T14:25:00.000Z',
    signedByIp: '192.168.1.1',
    signedByEmail: 'genitore.rossi@example.com',
    isGuardian: true,
  },
  // ... altri consensi
];

const mockPlayerHistory: PlayerTeamHistory[] = [
  {
    id: 'history-1',
    playerId: 'player-1',
    teamGroupId: 'team-5',
    teamGroupName: 'Allievi 2023',
    categoryName: 'Allievi',
    seasonId: 'season-1',
    seasonName: '2023/2024',
    position: 'Attaccante',
    notes: 'Buona stagione, 10 goal segnati',
    startDate: '2023-09-01',
    endDate: '2024-06-30',
  },
  {
    id: 'history-2',
    playerId: 'player-1',
    teamGroupId: 'team-1',
    teamGroupName: 'Allievi A',
    categoryName: 'Allievi',
    seasonId: 'season-2',
    seasonName: '2024/2025',
    position: 'Attaccante',
    startDate: '2024-09-01',
  },
  // ... altro storico giocatori
];

// Tipi per il contesto
interface PlayerManagementContextType {
  // Data
  seasons: Season[];
  categories: TeamCategory[];
  teamGroups: TeamGroup[];
  playerRegistrations: PlayerRegistration[];
  playerConsents: PlayerConsent[];
  playerHistory: PlayerTeamHistory[];
  
  // State
  currentSeason: Season | null;
  loading: boolean;
  
  // Actions
  setCurrentSeason: (season: Season) => void;
  createPlayerRegistration: (data: Omit<PlayerRegistration, 'id' | 'status' | 'inviteSentAt' | 'registrationCompletedAt' | 'consentsIds'>) => Promise<string>;
  updatePlayerRegistration: (id: string, data: Partial<PlayerRegistration>) => Promise<void>;
  assignPlayerToTeam: (playerId: string, teamId: string) => Promise<void>;
  removePlayerFromTeam: (playerId: string, teamId: string) => Promise<void>;
  bulkReassignPlayers: (playersIds: string[], targetTeamId: string) => Promise<void>;
  createTeamGroup: (data: Omit<TeamGroup, 'id' | 'isArchived' | 'playersIds' | 'coachesIds' | 'createdAt'>) => Promise<string>;
  archiveTeamGroup: (teamId: string) => Promise<void>;
  createSeason: (data: Omit<Season, 'id' | 'createdAt'>) => Promise<string>;
  createTeamCategory: (data: Omit<TeamCategory, 'id'>) => Promise<string>;
  getPlayerHistory: (playerId: string) => PlayerTeamHistory[];
  getPlayerTeams: (playerId: string) => TeamGroup[];
  getTeamPlayers: (teamId: string) => PlayerRegistration[];
  getTeamsByCategory: (categoryId: string) => TeamGroup[];
  getCategoriesBySeason: (seasonId: string) => TeamCategory[];
  sendInvitation: (registrationId: string) => Promise<void>;
  checkPlayerAge: (birthDate: string, categoryId: string) => boolean;
}

// Creazione del contesto
const PlayerManagementContext = createContext<PlayerManagementContextType | undefined>(undefined);

// Provider del contesto
export function PlayerManagementProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { showNotification } = useNotifications();
  const [seasons, setSeasons] = useState<Season[]>(mockSeasons);
  const [categories, setCategories] = useState<TeamCategory[]>(mockCategories);
  const [teamGroups, setTeamGroups] = useState<TeamGroup[]>(mockTeamGroups);
  const [playerRegistrations, setPlayerRegistrations] = useState<PlayerRegistration[]>(mockPlayerRegistrations);
  const [playerConsents, setPlayerConsents] = useState<PlayerConsent[]>(mockPlayerConsents);
  const [playerHistory, setPlayerHistory] = useState<PlayerTeamHistory[]>(mockPlayerHistory);
  const [currentSeason, setCurrentSeason] = useState<Season | null>(null);
  const [loading, setLoading] = useState(false);

  // Inizializzazione: imposta la stagione attiva come corrente
  useEffect(() => {
    const activeSeason = seasons.find(season => season.isActive);
    if (activeSeason) {
      setCurrentSeason(activeSeason);
    }
  }, [seasons]);

  // Funzione per creare una nuova registrazione giocatore
  const createPlayerRegistration = async (data: Omit<PlayerRegistration, 'id' | 'status' | 'inviteSentAt' | 'registrationCompletedAt' | 'consentsIds'>): Promise<string> => {
    setLoading(true);
    try {
      // Simula una chiamata API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Genera un nuovo ID univoco
      const id = `player-${Date.now()}`;
      
      // Crea la nuova registrazione
      const newRegistration: PlayerRegistration = {
        ...data,
        id: `reg-${Date.now()}`,
        playerId: id,
        status: 'pending',
        inviteSentAt: new Date().toISOString(),
        consentsIds: [],
      };
      
      // Aggiorna lo stato
      setPlayerRegistrations(prev => [...prev, newRegistration]);
      
      // Invia notifica di successo
      showNotification(
        "success",
        "Giocatore creato",
        {
          description: `Il giocatore ${data.firstName} ${data.lastName} è stato registrato con successo`,
          duration: 5000,
        }
      );
      
      return id;
    } catch (error) {
      console.error('Errore durante la creazione del giocatore:', error);
      
      // Invia notifica di errore
      showNotification(
        "error",
        "Errore",
        {
          description: `Si è verificato un errore durante la creazione del giocatore`,
          duration: 5000,
        }
      );
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Aggiorna la registrazione di un giocatore
  const updatePlayerRegistration = async (id: string, data: Partial<PlayerRegistration>): Promise<void> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPlayerRegistrations(prev => 
        prev.map(reg => reg.id === id ? { ...reg, ...data } : reg)
      );
      
      showNotification(
        "success",
        "Giocatore aggiornato",
        {
          description: `I dati del giocatore sono stati aggiornati con successo`,
          duration: 5000,
        }
      );
    } catch (error) {
      console.error('Errore durante l\'aggiornamento del giocatore:', error);
      
      showNotification(
        "error",
        "Errore",
        {
          description: `Si è verificato un errore durante l'aggiornamento del giocatore`,
          duration: 5000,
        }
      );
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Assegna un giocatore a una squadra
  const assignPlayerToTeam = async (playerId: string, teamId: string): Promise<void> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Trova la registrazione del giocatore
      const registration = playerRegistrations.find(reg => reg.playerId === playerId);
      if (!registration) throw new Error('Giocatore non trovato');
      
      // Aggiorna la registrazione con il nuovo team
      if (!registration.teamGroupsIds.includes(teamId)) {
        setPlayerRegistrations(prev => 
          prev.map(reg => 
            reg.id === registration.id 
              ? { ...reg, teamGroupsIds: [...reg.teamGroupsIds, teamId] } 
              : reg
          )
        );
      }
      
      // Aggiorna il gruppo squadra
      setTeamGroups(prev => 
        prev.map(team => 
          team.id === teamId && !team.playersIds.includes(playerId)
            ? { ...team, playersIds: [...team.playersIds, playerId] }
            : team
        )
      );
      
      // Aggiungi alla storia del giocatore
      const team = teamGroups.find(t => t.id === teamId);
      const category = team ? categories.find(c => c.id === team.categoryId) : null;
      const season = currentSeason;
      
      if (team && season) {
        const newHistory: PlayerTeamHistory = {
          id: `history-${Date.now()}`,
          playerId,
          teamGroupId: teamId,
          teamGroupName: team.name,
          categoryName: category?.name,
          seasonId: season.id,
          seasonName: season.name,
          startDate: new Date().toISOString(),
        };
        
        setPlayerHistory(prev => [...prev, newHistory]);
      }
      
      showNotification(
        "success",
        "Giocatore assegnato",
        {
          description: `Il giocatore è stato assegnato alla squadra con successo`,
          duration: 5000,
        }
      );
    } catch (error) {
      console.error('Errore durante l\'assegnazione del giocatore:', error);
      
      showNotification(
        "error",
        "Errore",
        {
          description: `Si è verificato un errore durante l'assegnazione del giocatore`,
          duration: 5000,
        }
      );
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Rimuove un giocatore da una squadra
  const removePlayerFromTeam = async (playerId: string, teamId: string): Promise<void> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Trova la registrazione del giocatore
      const registration = playerRegistrations.find(reg => reg.playerId === playerId);
      if (!registration) throw new Error('Giocatore non trovato');
      
      // Aggiorna la registrazione rimuovendo il team
      setPlayerRegistrations(prev => 
        prev.map(reg => 
          reg.id === registration.id 
            ? { ...reg, teamGroupsIds: reg.teamGroupsIds.filter(id => id !== teamId) } 
            : reg
        )
      );
      
      // Aggiorna il gruppo squadra
      setTeamGroups(prev => 
        prev.map(team => 
          team.id === teamId
            ? { ...team, playersIds: team.playersIds.filter(id => id !== playerId) }
            : team
        )
      );
      
      // Aggiorna la storia del giocatore
      setPlayerHistory(prev => 
        prev.map(history => 
          history.playerId === playerId && 
          history.teamGroupId === teamId && 
          !history.endDate
            ? { ...history, endDate: new Date().toISOString() }
            : history
        )
      );
      
      showNotification(
        "success",
        "Giocatore rimosso",
        {
          description: `Il giocatore è stato rimosso dalla squadra con successo`,
          duration: 5000,
        }
      );
    } catch (error) {
      console.error('Errore durante la rimozione del giocatore:', error);
      
      showNotification(
        "error",
        "Errore",
        {
          description: `Si è verificato un errore durante la rimozione del giocatore`,
          duration: 5000,
        }
      );
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Riassegnazione massiva dei giocatori
  const bulkReassignPlayers = async (playersIds: string[], targetTeamId: string): Promise<void> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Per ogni giocatore, esegui l'assegnazione
      for (const playerId of playersIds) {
        // Trova la registrazione del giocatore
        const registration = playerRegistrations.find(reg => reg.playerId === playerId);
        if (!registration) continue;
        
        // Aggiorna la registrazione con il nuovo team
        if (!registration.teamGroupsIds.includes(targetTeamId)) {
          setPlayerRegistrations(prev => 
            prev.map(reg => 
              reg.id === registration.id 
                ? { ...reg, teamGroupsIds: [...reg.teamGroupsIds, targetTeamId], status: 'active' } 
                : reg
            )
          );
        }
        
        // Aggiorna il gruppo squadra
        setTeamGroups(prev => 
          prev.map(team => 
            team.id === targetTeamId && !team.playersIds.includes(playerId)
              ? { ...team, playersIds: [...team.playersIds, playerId] }
              : team
          )
        );
        
        // Aggiungi alla storia del giocatore
        const team = teamGroups.find(t => t.id === targetTeamId);
        const category = team ? categories.find(c => c.id === team.categoryId) : null;
        const season = currentSeason;
        
        if (team && season) {
          const newHistory: PlayerTeamHistory = {
            id: `history-${Date.now()}-${playerId}`,
            playerId,
            teamGroupId: targetTeamId,
            teamGroupName: team.name,
            categoryName: category?.name,
            seasonId: season.id,
            seasonName: season.name,
            startDate: new Date().toISOString(),
          };
          
          setPlayerHistory(prev => [...prev, newHistory]);
        }
      }
      
      showNotification(
        "success",
        "Giocatori riassegnati",
        {
          description: `${playersIds.length} giocatori sono stati riassegnati con successo`,
          duration: 5000,
        }
      );
    } catch (error) {
      console.error('Errore durante la riassegnazione dei giocatori:', error);
      
      showNotification(
        "error",
        "Errore",
        {
          description: `Si è verificato un errore durante la riassegnazione dei giocatori`,
          duration: 5000,
        }
      );
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Creazione di un nuovo gruppo squadra
  const createTeamGroup = async (data: Omit<TeamGroup, 'id' | 'isArchived' | 'playersIds' | 'coachesIds' | 'createdAt'>): Promise<string> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Genera un nuovo ID univoco
      const id = `team-${Date.now()}`;
      
      // Crea il nuovo gruppo squadra
      const newTeamGroup: TeamGroup = {
        ...data,
        id,
        isArchived: false,
        playersIds: [],
        coachesIds: [],
        createdAt: new Date().toISOString(),
      };
      
      // Aggiorna lo stato
      setTeamGroups(prev => [...prev, newTeamGroup]);
      
      showNotification(
        "success",
        "Squadra creata",
        {
          description: `La squadra ${data.name} è stata creata con successo`,
          duration: 5000,
        }
      );
      
      return id;
    } catch (error) {
      console.error('Errore durante la creazione della squadra:', error);
      
      showNotification(
        "error",
        "Errore",
        {
          description: `Si è verificato un errore durante la creazione della squadra`,
          duration: 5000,
        }
      );
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Archivia un gruppo squadra
  const archiveTeamGroup = async (teamId: string): Promise<void> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Aggiorna lo stato della squadra
      setTeamGroups(prev => 
        prev.map(team => 
          team.id === teamId 
            ? { ...team, isArchived: true } 
            : team
        )
      );
      
      // Chiudi la storia di tutti i giocatori in quella squadra
      const team = teamGroups.find(t => t.id === teamId);
      if (team) {
        setPlayerHistory(prev => 
          prev.map(history => 
            history.teamGroupId === teamId && !history.endDate
              ? { ...history, endDate: new Date().toISOString() }
              : history
          )
        );
      }
      
      showNotification(
        "success",
        "Squadra archiviata",
        {
          description: `La squadra è stata archiviata con successo`,
          duration: 5000,
        }
      );
    } catch (error) {
      console.error('Errore durante l\'archiviazione della squadra:', error);
      
      showNotification(
        "error",
        "Errore",
        {
          description: `Si è verificato un errore durante l'archiviazione della squadra`,
          duration: 5000,
        }
      );
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Creazione di una nuova stagione
  const createSeason = async (data: Omit<Season, 'id' | 'createdAt'>): Promise<string> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Genera un nuovo ID univoco
      const id = `season-${Date.now()}`;
      
      // Se la nuova stagione è attiva, disattiva le altre
      if (data.isActive) {
        setSeasons(prev => 
          prev.map(season => ({ ...season, isActive: false }))
        );
      }
      
      // Crea la nuova stagione
      const newSeason: Season = {
        ...data,
        id,
        createdAt: new Date().toISOString(),
      };
      
      // Aggiorna lo stato
      setSeasons(prev => [...prev, newSeason]);
      
      // Se è attiva, imposta come stagione corrente
      if (data.isActive) {
        setCurrentSeason(newSeason);
      }
      
      showNotification(
        "success",
        "Stagione creata",
        {
          description: `La stagione ${data.name} è stata creata con successo`,
          duration: 5000,
        }
      );
      
      return id;
    } catch (error) {
      console.error('Errore durante la creazione della stagione:', error);
      
      showNotification(
        "error",
        "Errore",
        {
          description: `Si è verificato un errore durante la creazione della stagione`,
          duration: 5000,
        }
      );
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Creazione di una nuova categoria
  const createTeamCategory = async (data: Omit<TeamCategory, 'id'>): Promise<string> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Genera un nuovo ID univoco
      const id = `cat-${Date.now()}`;
      
      // Crea la nuova categoria
      const newCategory: TeamCategory = {
        ...data,
        id,
      };
      
      // Aggiorna lo stato
      setCategories(prev => [...prev, newCategory]);
      
      showNotification(
        "success",
        "Categoria creata",
        {
          description: `La categoria ${data.name} è stata creata con successo`,
          duration: 5000,
        }
      );
      
      return id;
    } catch (error) {
      console.error('Errore durante la creazione della categoria:', error);
      
      showNotification(
        "error",
        "Errore",
        {
          description: `Si è verificato un errore durante la creazione della categoria`,
          duration: 5000,
        }
      );
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Ottiene lo storico di un giocatore
  const getPlayerHistory = (playerId: string): PlayerTeamHistory[] => {
    return playerHistory.filter(history => history.playerId === playerId);
  };

  // Ottiene le squadre di un giocatore
  const getPlayerTeams = (playerId: string): TeamGroup[] => {
    const registration = playerRegistrations.find(reg => reg.playerId === playerId);
    if (!registration) return [];
    
    return teamGroups.filter(team => registration.teamGroupsIds.includes(team.id));
  };

  // Ottiene i giocatori di una squadra
  const getTeamPlayers = (teamId: string): PlayerRegistration[] => {
    const team = teamGroups.find(t => t.id === teamId);
    if (!team) return [];
    
    return playerRegistrations.filter(reg => team.playersIds.includes(reg.playerId));
  };

  // Ottiene le squadre di una categoria
  const getTeamsByCategory = (categoryId: string): TeamGroup[] => {
    return teamGroups.filter(team => team.categoryId === categoryId && !team.isArchived);
  };

  // Ottiene le categorie di una stagione
  const getCategoriesBySeason = (seasonId: string): TeamCategory[] => {
    return categories.filter(cat => cat.seasonId === seasonId);
  };

  // Invia un invito di registrazione
  const sendInvitation = async (registrationId: string): Promise<void> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Aggiorna la registrazione con la data di invio dell'invito
      setPlayerRegistrations(prev => 
        prev.map(reg => 
          reg.id === registrationId 
            ? { ...reg, inviteSentAt: new Date().toISOString() } 
            : reg
        )
      );
      
      showNotification(
        "success",
        "Invito inviato",
        {
          description: `L'invito di registrazione è stato inviato con successo`,
          duration: 5000,
        }
      );
    } catch (error) {
      console.error('Errore durante l\'invio dell\'invito:', error);
      
      showNotification(
        "error",
        "Errore",
        {
          description: `Si è verificato un errore durante l'invio dell'invito`,
          duration: 5000,
        }
      );
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Verifica se l'età del giocatore è compatibile con una categoria
  const checkPlayerAge = (birthDate: string, categoryId: string): boolean => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return true; // Se la categoria non esiste, considera valida
    
    // Calcola l'età del giocatore
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    // Verifica se l'età è nel range della categoria
    if (category.ageMin !== undefined && age < category.ageMin) return false;
    if (category.ageMax !== undefined && age > category.ageMax) return false;
    
    return true;
  };

  return (
    <PlayerManagementContext.Provider value={{
      seasons,
      categories,
      teamGroups,
      playerRegistrations,
      playerConsents,
      playerHistory,
      currentSeason,
      loading,
      setCurrentSeason,
      createPlayerRegistration,
      updatePlayerRegistration,
      assignPlayerToTeam,
      removePlayerFromTeam,
      bulkReassignPlayers,
      createTeamGroup,
      archiveTeamGroup,
      createSeason,
      createTeamCategory,
      getPlayerHistory,
      getPlayerTeams,
      getTeamPlayers,
      getTeamsByCategory,
      getCategoriesBySeason,
      sendInvitation,
      checkPlayerAge,
    }}>
      {children}
    </PlayerManagementContext.Provider>
  );
}

// Hook per utilizzare il contesto
export function usePlayerManagement() {
  const context = useContext(PlayerManagementContext);
  if (context === undefined) {
    throw new Error('usePlayerManagement must be used within a PlayerManagementProvider');
  }
  return context;
}
