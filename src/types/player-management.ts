
export type Season = {
  id: string;
  name: string;  // es. "2024/2025"
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
};

export type TeamCategory = {
  id: string;
  name: string;  // es. "Allievi", "Juniores"
  ageMin?: number;
  ageMax?: number;
  seasonId: string | null;
  createdAt?: string;
};

export type TeamGroup = {
  id: string;
  name: string;  // es. "Allievi A", "Allievi B"
  categoryId: string;
  category?: TeamCategory;
  seasonId: string;
  isArchived: boolean;
  playersIds: string[];
  coachesIds: string[];
  createdAt: string;
};

export type PlayerRegistrationStatus = 'pending' | 'active' | 'inactive' | 'to_reassign';

export type PlayerTeamHistory = {
  id: string;
  playerId: string;
  teamGroupId: string;
  teamGroupName?: string;
  categoryName?: string;
  seasonId: string;
  seasonName?: string;
  position?: string;
  notes?: string;
  startDate: string;
  endDate?: string;
};

export type PlayerConsent = {
  id: string;
  playerId: string;
  type: 'terms' | 'privacy' | 'regulations';
  version: string;
  signedAt: string;
  signedByIp: string;
  signedByEmail: string;
  isGuardian: boolean;
};

export type PlayerRegistration = {
  id: string;
  playerId: string;
  firstName: string;
  lastName: string;
  birthDate: string | null;
  isMinor: boolean;
  contactEmail: string;
  guardianName?: string;
  guardianRelationship?: string;
  status: PlayerRegistrationStatus;
  inviteSentAt?: string;
  registrationCompletedAt?: string;
  seasonId: string;
  teamGroupsIds: string[];
  consentsIds: string[];
};
