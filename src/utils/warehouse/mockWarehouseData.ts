import {BaseItem, InventoryMovement, ItemAssignment, ItemVariant, Movement} from '@/types/warehouse';
// Import players from the mock data file
import {mockPlayers} from '@/data/mockData';

// Function to create Date objects
const createDate = (daysAgo: number = 0): Date => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
};

// Sample base items
export const mockBaseItems: BaseItem[] = [
  {
    id: 'item-1',
    name: 'Maglia da gara',
    category: 'kit',
    description: 'Maglia ufficiale da gara della stagione corrente',
    brand: 'Nike',
    sku: 'MAG-01',
    image: '/assets/items/jersey.jpg',
    notes: ['Lavare a 30°', 'Non usare candeggina'],
    lastUpdated: '2024-04-15T10:30:00',
    createdAt: createDate(90),
    updatedAt: createDate(5)
  },
  {
    id: 'item-2',
    name: 'Pantaloncino da gara',
    category: 'kit',
    description: 'Pantaloncino ufficiale da gara della stagione corrente',
    brand: 'Nike',
    sku: 'PAN-01',
    image: '/assets/items/shorts.jpg',
    notes: ['Lavare a 30°', 'Non usare candeggina'],
    lastUpdated: '2024-04-15T10:30:00',
    createdAt: createDate(90),
    updatedAt: createDate(5)
  },
  {
    id: 'item-3',
    name: 'Pallone da allenamento',
    category: 'palloni',
    description: 'Pallone da allenamento resistente',
    brand: 'Adidas',
    sku: 'PAL-01',
    image: '/assets/items/ball.jpg',
    lastUpdated: '2024-04-10T14:20:00',
    createdAt: createDate(120),
    updatedAt: createDate(10)
  }
];

// Sample variants
export const mockVariants: ItemVariant[] = [
  {
    id: 'variant-1',
    baseItemId: 'item-1',
    size: 'M',
    color: '#1976d2',
    uniqueSku: 'MAG-01-M-BLU',
    quantity: 10,
    minimumThreshold: 3,
    location: 'Armadio 1, Ripiano 2',
    status: 'available',
    lastUpdated: '2024-04-15T10:30:00',
    createdAt: createDate(90),
    updatedAt: createDate(5)
  },
  {
    id: 'variant-2',
    baseItemId: 'item-1',
    size: 'L',
    color: '#1976d2',
    uniqueSku: 'MAG-01-L-BLU',
    quantity: 8,
    minimumThreshold: 3,
    location: 'Armadio 1, Ripiano 2',
    status: 'available',
    lastUpdated: '2024-04-15T10:30:00',
    createdAt: createDate(90),
    updatedAt: createDate(5)
  },
  {
    id: 'variant-3',
    baseItemId: 'item-1',
    size: 'XL',
    color: '#1976d2',
    uniqueSku: 'MAG-01-XL-BLU',
    quantity: 2,
    minimumThreshold: 3,
    location: 'Armadio 1, Ripiano 2',
    status: 'low',
    lastUpdated: '2024-04-15T10:30:00',
    createdAt: createDate(90),
    updatedAt: createDate(5)
  },
  {
    id: 'variant-4',
    baseItemId: 'item-1',
    size: 'S',
    color: '#1976d2',
    uniqueSku: 'MAG-01-S-BLU',
    quantity: 0,
    minimumThreshold: 3,
    location: 'Armadio 1, Ripiano 2',
    status: 'out',
    lastUpdated: '2024-04-15T10:30:00',
    createdAt: createDate(90),
    updatedAt: createDate(5)
  },
  {
    id: 'variant-5',
    baseItemId: 'item-2',
    size: 'M',
    color: '#1976d2',
    uniqueSku: 'PAN-01-M-BLU',
    quantity: 10,
    minimumThreshold: 3,
    location: 'Armadio 1, Ripiano 3',
    status: 'available',
    lastUpdated: '2024-04-15T10:30:00',
    createdAt: createDate(90),
    updatedAt: createDate(5)
  },
  {
    id: 'variant-6',
    baseItemId: 'item-2',
    size: 'L',
    color: '#1976d2',
    uniqueSku: 'PAN-01-L-BLU',
    quantity: 8,
    minimumThreshold: 3,
    location: 'Armadio 1, Ripiano 3',
    status: 'available',
    lastUpdated: '2024-04-15T10:30:00',
    createdAt: createDate(90),
    updatedAt: createDate(5)
  },
  {
    id: 'variant-7',
    baseItemId: 'item-2',
    size: 'XL',
    color: '#1976d2',
    uniqueSku: 'PAN-01-XL-BLU',
    quantity: 6,
    minimumThreshold: 3,
    location: 'Armadio 1, Ripiano 3',
    status: 'available',
    lastUpdated: '2024-04-15T10:30:00',
    createdAt: createDate(90),
    updatedAt: createDate(5)
  },
  {
    id: 'variant-8',
    baseItemId: 'item-3',
    size: 'Taglia 5',
    color: '#FFFFFF',
    uniqueSku: 'PAL-01-5-BIA',
    quantity: 15,
    minimumThreshold: 5,
    location: 'Armadio 2, Ripiano 1',
    status: 'available',
    lastUpdated: '2024-04-10T14:20:00',
    createdAt: createDate(120),
    updatedAt: createDate(10)
  }
];

// Sample movements
export const mockMovements: Movement[] = [
  {
    id: 'mov-1',
    baseItemId: 'item-1',
    variantId: 'variant-1',
    type: 'in',
    quantity: 5,
    date: '2024-04-01T09:00:00',
    note: 'Consegna fornitore'
  },
  {
    id: 'mov-2',
    baseItemId: 'item-1',
    variantId: 'variant-1',
    type: 'out',
    quantity: 2,
    date: '2024-04-05T14:30:00',
    note: 'Prelevato per evento'
  },
  {
    id: 'mov-3',
    baseItemId: 'item-1',
    variantId: 'variant-3',
    type: 'assign',
    quantity: 1,
    date: '2024-04-10T10:15:00',
    note: 'Assegnato a Marco Rossi',
    playerId: '1',
    playerName: 'Marco Rossi'
  },
  {
    id: 'mov-4',
    baseItemId: 'item-2',
    variantId: 'variant-5',
    type: 'assign',
    quantity: 1,
    date: '2024-04-10T10:20:00',
    note: 'Assegnato a Marco Rossi',
    playerId: '1',
    playerName: 'Marco Rossi'
  },
  {
    id: 'mov-5',
    baseItemId: 'item-3',
    variantId: 'variant-8',
    type: 'out',
    quantity: 2,
    date: '2024-04-12T16:45:00',
    note: 'Allenamento'
  }
];

// Mappa i movimenti a InventoryMovement
export const mockInventoryMovements: InventoryMovement[] = mockMovements.map(mov => mov as InventoryMovement);

// Sample assignments
export const mockAssignments: ItemAssignment[] = [
  {
    id: 'assign-1',
    variantId: 'variant-3',
    playerId: '1',
    playerName: 'Marco Rossi',
    assignDate: '2024-04-10T10:15:00',
    expectedReturnDate: '2024-04-20T18:00:00',
    quantity: 1,
    notes: 'Kit da gara per partita del 15/04',
    status: 'assigned'
  },
  {
    id: 'assign-2',
    variantId: 'variant-5',
    playerId: '1',
    playerName: 'Marco Rossi',
    assignDate: '2024-04-10T10:20:00',
    expectedReturnDate: '2024-04-20T18:00:00',
    quantity: 1,
    notes: 'Kit da gara per partita del 15/04',
    status: 'assigned'
  },
  {
    id: 'assign-3',
    variantId: 'variant-6',
    playerId: '5',
    playerName: 'Luca Bianchi',
    assignDate: '2024-04-10T10:25:00',
    expectedReturnDate: '2024-04-20T18:00:00',
    quantity: 1,
    notes: 'Kit da gara per partita del 15/04',
    status: 'assigned'
  },
  {
    id: 'assign-4',
    variantId: 'variant-7',
    playerId: '6',
    playerName: 'Alessandro Verdi',
    assignDate: '2024-04-10T10:30:00',
    returnDate: '2024-04-16T19:15:00',
    quantity: 1,
    notes: 'Kit da gara per partita del 15/04',
    status: 'returned',
    returnedCondition: 'good'
  }
];

export const mockWarehousePlayers = mockPlayers;
