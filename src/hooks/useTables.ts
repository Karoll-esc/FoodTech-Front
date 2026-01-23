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
        // Refrescar mesas desde el backend para tener datos actualizados
        await fetchTables();
      } catch (err) {
        console.error('Error updating table status:', err);
      }
    },
    [fetchTables]
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
   * - Si hay tareas pendientes: OCCUPIED
   * - Si todas las tareas están completadas: SERVED (lista para que el mesero continúe el flujo)
   */
  const syncTablesWithTasks = useCallback((tasks: Task[]) => {
    setTables((prevTables) => {
      // Agrupar tareas por mesa
      const tableTasksMap = new Map<string, { allCompleted: boolean; orderId: string }>();

      tasks.forEach((task) => {
        const existing = tableTasksMap.get(task.tableNumber);
        if (!existing) {
          tableTasksMap.set(task.tableNumber, {
            allCompleted: task.status === TaskStatus.COMPLETED,
            orderId: task.orderId.toString(),
          });
        } else {
          // Si alguna tarea no está completada, la mesa no está lista
          existing.allCompleted = existing.allCompleted && task.status === TaskStatus.COMPLETED;
        }
      });

      // Actualizar el estado de las mesas
      return prevTables.map((table) => {
        const tableInfo = tableTasksMap.get(table.tableNumber);
        
        if (tableInfo) {
          if (tableInfo.allCompleted && table.status === TableStatus.OCCUPIED) {
            // Todas las tareas completadas: pasar a SERVED
            return {
              ...table,
              status: TableStatus.SERVED,
              activeOrderId: tableInfo.orderId,
            };
          } else if (!tableInfo.allCompleted) {
            // Aún hay tareas pendientes: mantener OCCUPIED
            return {
              ...table,
              status: TableStatus.OCCUPIED,
              activeOrderId: tableInfo.orderId,
            };
          }
        }
        
        // No cambiar el estado si no hay tareas (el mesero lo gestiona manualmente)
        return table;
      });
    });
  }, []);

  /**
   * Crea una nueva mesa
   */
  const createTable = useCallback(async (data: { tableNumber: string; capacity: number }) => {
    await tableService.create(data);
    await fetchTables();
  }, [fetchTables]);

  /**
   * Actualiza el estado de una mesa
   */
  const updateTableStatus = useCallback(async (tableId: number, status: string) => {
    await tableService.updateStatus(tableId, status as TableStatus);
    await fetchTables();
  }, [fetchTables]);

  /**
   * Elimina una mesa
   */
  const deleteTable = useCallback(async (tableId: number) => {
    await tableService.delete(tableId);
    await fetchTables();
  }, [fetchTables]);

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
    fetchTables,
    refreshTables: fetchTables,
    createTable,
    updateTableStatus,
    deleteTable,
  };
};
