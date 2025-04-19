
import { BaseItem, ItemVariant, InventoryMovement, ItemAssignment } from "@/types/warehouse";
import { Player } from "@/types";

// Mock data for players
export const mockPlayers: Player[] = [
  {
    id: '1',
    name: 'Marco Rossi',
    firstName: 'Marco',
    lastName: 'Rossi',
    email: 'marco@example.com',
    role: 'player',
    position: 'Attaccante',
    strongFoot: 'right',
    stats: {
      games: 10,
      minutesPlayed: 450,
      goals: 5,
      assists: 3,
      yellowCards: 2,
      redCards: 0,
      absences: 1
    }
  },
  {
    id: '2',
    name: 'Paolo Bianchi',
    firstName: 'Paolo',
    lastName: 'Bianchi',
    email: 'paolo@example.com',
    role: 'player',
    position: 'Centrocampista',
    strongFoot: 'left',
    stats: {
      games: 12,
      minutesPlayed: 520,
      goals: 2,
      assists: 6,
      yellowCards: 1,
      redCards: 0,
      absences: 0
    }
  },
  {
    id: '3',
    name: 'Giuseppe Verdi',
    firstName: 'Giuseppe',
    lastName: 'Verdi',
    email: 'giuseppe@example.com',
    role: 'player',
    position: 'Difensore',
    strongFoot: 'right',
    stats: {
      games: 9,
      minutesPlayed: 400,
      goals: 0,
      assists: 1,
      yellowCards: 3,
      redCards: 1,
      absences: 2
    }
  }
];

// Mock data for base items
export const mockBaseItems: BaseItem[] = [
  {
    id: '1',
    name: 'Maglia Gara Home',
    category: 'Kit',
    description: 'Maglia ufficiale da gara, colore blu',
    brand: 'Nike',
    sku: 'MG-HOME',
    image: 'https://images.unsplash.com/photo-1580087608321-298cd7d4c599?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3',
    notes: ['Maglia 2023-2024', 'Logo sponsor frontale'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Maglia Gara Away',
    category: 'Kit',
    description: 'Maglia ufficiale da trasferta, colore bianco',
    brand: 'Nike',
    sku: 'MG-AWAY',
    image: 'https://images.unsplash.com/photo-1565693413579-8ff3fdc1b03d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3',
    notes: ['Maglia 2023-2024'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Pantaloncino Gara',
    category: 'Kit',
    description: 'Pantaloncino ufficiale da gara',
    brand: 'Nike',
    sku: 'PG',
    image: 'https://images.unsplash.com/photo-1515355758951-ba5f6bafc0b3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3',
    lastUpdated: new Date().toISOString()
  }
];

// Mock data for item variants
export const mockVariants: ItemVariant[] = [
  {
    id: '1',
    baseItemId: '1',
    size: 'S',
    color: '#0000FF',
    uniqueSku: 'MG-HOME-S-BLUE',
    quantity: 5,
    minimumThreshold: 2,
    location: 'Armadio A, Scaffale 1',
    status: 'available',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '2',
    baseItemId: '1',
    size: 'M',
    color: '#0000FF',
    uniqueSku: 'MG-HOME-M-BLUE',
    quantity: 8,
    minimumThreshold: 3,
    location: 'Armadio A, Scaffale 1',
    status: 'available',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '3',
    baseItemId: '1',
    size: 'L',
    color: '#0000FF',
    uniqueSku: 'MG-HOME-L-BLUE',
    quantity: 1,
    minimumThreshold: 2,
    location: 'Armadio A, Scaffale 1',
    status: 'low',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '4',
    baseItemId: '1',
    size: 'XL',
    color: '#0000FF',
    uniqueSku: 'MG-HOME-XL-BLUE',
    quantity: 0,
    minimumThreshold: 2,
    location: 'Armadio A, Scaffale 1',
    status: 'out',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '5',
    baseItemId: '2',
    size: 'S',
    color: '#FFFFFF',
    uniqueSku: 'MG-AWAY-S-WHITE',
    quantity: 3,
    minimumThreshold: 2,
    location: 'Armadio A, Scaffale 2',
    status: 'available',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '6',
    baseItemId: '2',
    size: 'M',
    color: '#FFFFFF',
    uniqueSku: 'MG-AWAY-M-WHITE',
    quantity: 4,
    minimumThreshold: 2,
    location: 'Armadio A, Scaffale 2',
    status: 'available',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '7',
    baseItemId: '3',
    size: 'S',
    color: '#000000',
    uniqueSku: 'PG-S-BLACK',
    quantity: 6,
    minimumThreshold: 3,
    location: 'Armadio B, Scaffale 1',
    status: 'available',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '8',
    baseItemId: '3',
    size: 'M',
    color: '#000000',
    uniqueSku: 'PG-M-BLACK',
    quantity: 6,
    minimumThreshold: 3,
    location: 'Armadio B, Scaffale 1',
    status: 'available',
    lastUpdated: new Date().toISOString()
  }
];

// Mock data for movements
export const mockMovements: InventoryMovement[] = [
  {
    id: '1',
    variantId: '1',
    type: 'in',
    quantity: 10,
    date: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
    notes: 'Ordine iniziale',
    performedBy: 'Admin'
  },
  {
    id: '2',
    variantId: '2',
    type: 'in',
    quantity: 10,
    date: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
    notes: 'Ordine iniziale',
    performedBy: 'Admin'
  },
  {
    id: '3',
    variantId: '1',
    type: 'assign',
    quantity: 2,
    date: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
    notes: 'Consegna kit inizio stagione',
    performedBy: 'Admin',
    playerId: '1'
  },
  {
    id: '4',
    variantId: '2',
    type: 'assign',
    quantity: 2,
    date: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
    notes: 'Consegna kit inizio stagione',
    performedBy: 'Admin',
    playerId: '2'
  },
  {
    id: '5',
    variantId: '1',
    type: 'out',
    quantity: 3,
    date: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    notes: 'Danneggiati durante il trasporto',
    performedBy: 'Admin'
  }
];

// Mock data for assignments
export const mockAssignments: ItemAssignment[] = [
  {
    id: '1',
    variantId: '1',
    playerId: '1',
    playerName: 'Marco Rossi',
    assignDate: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
    quantity: 2,
    notes: 'Maglia gara numerata',
    status: 'assigned'
  },
  {
    id: '2',
    variantId: '2',
    playerId: '2',
    playerName: 'Paolo Bianchi',
    assignDate: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
    quantity: 2,
    notes: 'Maglia gara numerata',
    status: 'assigned'
  },
  {
    id: '3',
    variantId: '7',
    playerId: '1',
    playerName: 'Marco Rossi',
    assignDate: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
    returnDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    quantity: 1,
    notes: 'Pantaloncino gara',
    status: 'returned'
  }
];
