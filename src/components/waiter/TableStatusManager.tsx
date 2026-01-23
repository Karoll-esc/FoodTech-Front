import { useState } from 'react';
import type { Table, TableStatus } from '../../models/Table';
import { TableStatus as TS } from '../../models/Table';

interface TableStatusManagerProps {
  tables: Table[];
  onUpdateStatus: (tableId: number, newStatus: TableStatus) => Promise<void>;
}

const statusColors = {
  [TS.AVAILABLE]: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  [TS.OCCUPIED]: 'bg-primary/20 text-primary border-primary/30',
  [TS.SERVED]: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  [TS.CLEANING]: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

const statusIcons = {
  [TS.AVAILABLE]: 'check_circle',
  [TS.OCCUPIED]: 'restaurant',
  [TS.SERVED]: 'room_service',
  [TS.CLEANING]: 'cleaning_services',
};

const statusLabels = {
  [TS.AVAILABLE]: 'Disponible',
  [TS.OCCUPIED]: 'Ocupada',
  [TS.SERVED]: 'Servida',
  [TS.CLEANING]: 'Limpieza',
};

/**
 * Obtiene las transiciones válidas para cada estado
 * OCCUPIED → SERVED (cuando la comida ha sido servida)
 * SERVED → CLEANING (cuando el cliente se va)
 * CLEANING → AVAILABLE (cuando se termina de limpiar)
 */
const getValidTransitions = (currentStatus: TableStatus): TableStatus[] => {
  switch (currentStatus) {
    case TS.OCCUPIED:
      return [TS.SERVED];
    case TS.SERVED:
      return [TS.CLEANING];
    case TS.CLEANING:
      return [TS.AVAILABLE];
    case TS.AVAILABLE:
    default:
      return [];
  }
};

export function TableStatusManager({ tables, onUpdateStatus }: TableStatusManagerProps) {
  const [updatingTableId, setUpdatingTableId] = useState<number | null>(null);

  const handleStatusChange = async (table: Table, newStatus: TableStatus) => {
    setUpdatingTableId(table.id);
    try {
      await onUpdateStatus(table.id, newStatus);
    } finally {
      setUpdatingTableId(null);
    }
  };

  // Filtrar solo mesas que necesitan acción (no disponibles)
  const activeTables = tables.filter((t) => t.status !== TS.AVAILABLE);

  if (activeTables.length === 0) {
    return (
      <div className="glass-panel p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="material-symbols-outlined text-primary text-2xl">
            table_restaurant
          </span>
          <h3 className="text-lg font-bold text-white-text">Gestión de Mesas</h3>
        </div>
        <div className="text-center py-8">
          <span className="material-symbols-outlined text-6xl text-silver-text/30 mb-2 block">
            event_available
          </span>
          <p className="text-silver-text text-sm">
            Todas las mesas están disponibles
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="material-symbols-outlined text-primary text-2xl">
          table_restaurant
        </span>
        <h3 className="text-lg font-bold text-white-text">Gestión de Mesas</h3>
        <span className="ml-auto bg-primary/20 text-primary px-2 py-1 rounded-full text-xs font-bold">
          {activeTables.length}
        </span>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
        {activeTables.map((table) => {
          const validTransitions = getValidTransitions(table.status);
          const isUpdating = updatingTableId === table.id;

          return (
            <div
              key={table.id}
              className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3"
            >
              {/* Header con info de mesa */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white-text font-bold text-lg">
                      Mesa {table.tableNumber}
                    </span>
                    <span className="text-xs text-silver-text">
                      · {table.capacity} personas
                    </span>
                  </div>
                  {table.activeOrderId && (
                    <div className="text-xs text-silver-text mt-1">
                      Orden: {table.activeOrderId}
                    </div>
                  )}
                </div>

                {/* Badge de estado actual */}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${
                    statusColors[table.status]
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {statusIcons[table.status]}
                  </span>
                  <span className="text-xs font-semibold">
                    {statusLabels[table.status]}
                  </span>
                </div>
              </div>

              {/* Timestamp */}
              <div className="text-xs text-silver-text">
                Actualizado: {new Date(table.updatedAt).toLocaleString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                  day: '2-digit',
                  month: 'short',
                })}
              </div>

              {/* Botones de transición */}
              {validTransitions.length > 0 && (
                <div className="pt-2 border-t border-white/10 space-y-2">
                  {validTransitions.map((nextStatus) => (
                    <button
                      key={nextStatus}
                      onClick={() => handleStatusChange(table, nextStatus)}
                      disabled={isUpdating}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-lg text-primary font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? (
                        <>
                          <span className="animate-spin material-symbols-outlined text-sm">
                            progress_activity
                          </span>
                          Actualizando...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-sm">
                            {statusIcons[nextStatus]}
                          </span>
                          Marcar como {statusLabels[nextStatus]}
                        </>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Info de siguiente paso */}
              {validTransitions.length === 0 && table.status === TS.AVAILABLE && (
                <div className="pt-2 border-t border-white/10 text-center">
                  <p className="text-xs text-silver-text">
                    Mesa lista para nuevos clientes
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
