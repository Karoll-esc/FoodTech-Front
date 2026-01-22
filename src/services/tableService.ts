import { apiClient } from './apiClient';
import type { Table, TableStatus, CreateTableRequest } from '../models/Table';

/**
 * Servicio para gestionar mesas
 */
class TableService {
  /**
   * Obtiene todas las mesas
   */
  async list(): Promise<Table[]> {
    return apiClient.get<Table[]>('/api/tables');
  }

  /**
   * Obtiene una mesa por ID
   */
  async getById(id: number): Promise<Table> {
    return apiClient.get<Table>(`/api/tables/${id}`);
  }

  /**
   * Crea una nueva mesa (Admin)
   */
  async create(request: CreateTableRequest): Promise<Table> {
    return apiClient.post<CreateTableRequest, Table>('/api/tables', request);
  }

  /**
   * Actualiza el estado de una mesa
   */
  async updateStatus(id: number, status: TableStatus): Promise<Table> {
    return apiClient.patch<Table>(`/api/tables/${id}/status?status=${status}`);
  }

  /**
   * Elimina una mesa (Admin)
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/tables/${id}`);
  }
}

export const tableService = new TableService();
