export interface Player {
  id: string;
  name: string;
  buyIn: number;
  outcome: number;
  chips: number;
}

export interface Settlement {
  fromPlayerId: string;
  toPlayerId: string;
  amount: number;
}

export interface Game {
  id: string;
  shareId: string;
  createdAt: Date;
  players: Player[];
  settlements: Settlement[];
}

export interface ChipTransaction {
  playerId: string;
  amount: number;
  timestamp: Date;
  type: 'buy-in' | 'add-chips' | 'remove-chips';
}
