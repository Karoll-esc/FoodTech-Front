import { useState, useCallback, useEffect } from 'react';
import type { Table } from '../models/Table';
import { TableStatus } from '../models/Table';
import type { Task } from '../models/Task';
import { TaskStatus } from '../models/Task';
import { tableService } from '../services/tableService';

/**
 * Hook para gestionar mesas del restaurante
 */
export const useTables = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedTable = tables.find((table) => table.id === selectedTableId);

  /**
   * Carga las mesas desde el backend
   */
  const fetchTables = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTables = await tableService.list();
      setTables(fetchedTables);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al cargar mesas';
      setError(errorMessage);
      console.error('Error fetching tables:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Carga inicial de mesas
   */
  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const selectTable = useCallback((tableId: number) => {
    setSelectedTableId(tableId);
  }, []);

  const markTableAsOccupied = useCallback(
    async (tableId: number, orderId: string) => {
      try {
        await tableService.updateStatus(tableId, TableStatus.OCCUPIED);
        setTables((prevTables) =>
          prevTables.map((table) =>
            table.id === tableId
              ? {
                  ...table,
                  status: TableStatus.OCCUPIED,
                  activeOrderId: orderId,
                }
              : table
          )
        );
      } catch (err) {
        console.error('Error updating table status:', err);
      }
    },
    []
  );

  const markTableAsAvailable = useCallback(async (tableId: number) => {
    try {
      await tableService.updateStatus(tableId, TableStatus.AVAILABLE);
      setTables((prevTables) =>
        prevTables.map((table) =>
          table.id === tableId
            ? {
                ...table,
                status: TableStatus.AVAILABLE,
                activeOrderId: undefined,
              }
            : table
        )
      );
    } catch (err) {
      console.error('Error updating table status:', err);
    }
  }, []);

  /**
   * Sincroniza el estado de las mesas con las tareas del backend
   * Marca una mesa como OCCUPIED si tiene tareas no completadas
   */
  const syncTablesWithTasks = useCallback((tasks: Task[]) => {
    setTables((prevTables) => {
      // Crear un mapa de mesas ocupadas basado en tareas no completadas
      const occupiedTables = new Map<string, string>();

      tasks.forEach((task) => {
        if (task.status !== TaskStatus.COMPLETED) {
          // Si la tarea no está completada, la mesa está ocupada
          occupiedTables.set(task.tableNumber, task.orderId.toString());
        }
      });

      // Actualizar el estado de las mesas
      return prevTables.map((table) => {
        const orderId = occupiedTables.get(table.tableNumber);
        
        if (orderId) {
          // Mesa ocupada
          return {
            ...table,
            status: TableStatus.OCCUPIED,
            activeOrderId: orderId,
          };
        } else if (table.status === TableStatus.OCCUPIED) {
          // Si estaba ocupada pero ya no hay tareas, marcarla como disponible
          return {
            ...table,
            status: TableStatus.AVAILABLE,
            activeOrderId: undefined,
          };
        }
        return table;
      });
    });
  }, []);

  return {
    tables,
    selectedTable,
    selectedTableId,
    loading,
    error,
    selectTable,
    markTableAsOccupied,
    markTableAsAvailable,
    syncTablesWithTasks,
    refreshTables: fetchTables,
  };
};
