import type { Table } from '../../models/Table';
import { TableStatus } from '../../models/Table';

interface TableListProps {
  tables: Table[];
  onStatusChange: (table: Table, newStatus: string) => void;
  onDelete: (table: Table) => void;
}

const statusLabels: Record<TableStatus, string> = {
  [TableStatus.AVAILABLE]: 'Disponible',
  [TableStatus.OCCUPIED]: 'Ocupada',
  [TableStatus.SERVED]: 'Servida',
  [TableStatus.CLEANING]: 'Limpieza',
};

const statusColors: Record<TableStatus, string> = {
  [TableStatus.AVAILABLE]: 'bg-primary/20 text-primary border-primary/30',
  [TableStatus.OCCUPIED]: 'bg-red-500/20 text-red-400 border-red-500/30',
  [TableStatus.SERVED]: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  [TableStatus.CLEANING]: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

export function TableList({ tables, onStatusChange, onDelete }: TableListProps) {
  if (tables.length === 0) {
    return (
      <div className="glass-panel p-12 text-center">
        <span className="material-symbols-outlined text-6xl text-silver-text/30 mb-4 block">
          table_restaurant
        </span>
        <p className="text-silver-text">No hay mesas registradas</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
      {tables.map((table) => (
        <div
          key={table.id}
          className="glass-panel p-6 border border-amber-glow/40 bg-amber-glow/5 rounded-xl hover:border-primary/30 transition-colors"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4 ">
            <div>
              <h3 className="text-xl font-bold text-white-text mb-1">
                Mesa {table.tableNumber}
              </h3>
              <p className="text-sm text-silver-text">
                Capacidad: {table.capacity} personas
              </p>
            </div>
            <button
              onClick={() => onDelete(table)}
              className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-silver-text hover:text-red-400"
              title="Eliminar mesa"
            >
              <span className="material-symbols-outlined text-lg">delete</span>
            </button>
          </div>

          {/* Status Selector */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-silver-text mb-2">
              Estado
            </label>
            <select
              value={table.status}
              onChange={(e) => onStatusChange(table, e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white-text text-sm focus:outline-none focus:border-primary"
            >
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[table.status]}`}>
            <div className="w-2 h-2 rounded-full bg-current"></div>
            {statusLabels[table.status]}
          </div>

          {/* Active Order */}
          {table.activeOrderId && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-silver-text">
                Orden Activa: <span className="text-white-text font-medium">#{table.activeOrderId}</span>
              </p>
            </div>
          )}

          {/* Timestamps */}
          <div className="mt-4 pt-4 border-t border-white/10 space-y-1">
            <p className="text-[10px] text-silver-text">
              Creada: {new Date(table.createdAt).toLocaleDateString('es-ES')}
            </p>
            <p className="text-[10px] text-silver-text">
              Actualizada: {new Date(table.updatedAt).toLocaleString('es-ES')}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
