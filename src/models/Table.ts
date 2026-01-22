/**
 * Estado de una mesa en el restaurante
 */
export const TableStatus = {
  AVAILABLE: 'AVAILABLE',
  OCCUPIED: 'OCCUPIED',
  SERVED: 'SERVED',
  CLEANING: 'CLEANING',
} as const;

export type TableStatus = (typeof TableStatus)[keyof typeof TableStatus];

/**
 * Modelo completo de mesa del backend
 */
export interface Table {
  id: number;
  tableNumber: string;
  capacity: number;
  status: TableStatus;
  activeOrderId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Request para crear una mesa (Admin)
 */
export interface CreateTableRequest {
  tableNumber: string;
  capacity: number;
}
