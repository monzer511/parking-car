export enum SlotStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  MAINTENANCE = 'MAINTENANCE'
}

export type UserRole = 'ADMIN' | 'USER';

export interface ParkingSlot {
  id: number;
  label: string;
  status: SlotStatus;
  floor: number;
  occupiedBy?: string; // Plate Number
  entryTime?: Date;
}

export interface ParkingTransaction {
  id: string;
  plateNumber: string;
  slotLabel: string;
  entryTime: Date;
  exitTime?: Date;
  cost?: number;
  status: 'ACTIVE' | 'COMPLETED';
}

export interface ParkingStats {
  totalSlots: number;
  occupied: number;
  available: number;
  revenue: number;
}

export interface AIAnalysisResult {
  efficiencyScore: number;
  peakTimePrediction: string;
  pricingSuggestion: string;
  recommendations: string[];
}