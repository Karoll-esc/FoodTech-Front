import type { Table } from '../../models/Table';
import { TableStatus } from '../../models/Table';

interface TableCardProps {
  table: Table;
  isSelected: boolean;
  onSelect: (tableId: number) => void;
}

/**
 * Tarjeta de mesa individual
 */
export const TableCard = ({ table, isSelected, onSelect }: TableCardProps) => {
  const isAvailable = table.status === TableStatus.AVAILABLE;
  const statusLabels: Record<string, string> = {
    [TableStatus.AVAILABLE]: 'Disponible',
    [TableStatus.OCCUPIED]: 'Ocupada',
    [TableStatus.SERVED]: 'Servida',
    [TableStatus.CLEANING]: 'Limpieza',
  };

  return (
    <div
      data-testid={`table-card-${table.tableNumber}`}
      data-table-id={table.id}
      data-table-number={table.tableNumber}
      data-table-status={table.status}
      onClick={() => isAvailable && onSelect(table.id)}
      className={`
        p-3 rounded-xl flex flex-col items-center justify-center gap-1 
        transition-all
        ${
          !isAvailable
            ? 'bg-gradient-to-br from-red-900/40 to-red-800/30 border border-red-700/50 cursor-not-allowed opacity-75'
            : isSelected
            ? 'glass-panel-dark border-primary/40 cursor-pointer'
            : 'bg-white/5 border border-white/5 hover:border-primary/30 cursor-pointer'
        }
      `}
    >
      <span
        data-testid={`table-number-${table.tableNumber}`}
        className={`text-[10px] font-bold ${
          !isAvailable
            ? 'text-red-400'
            : isSelected
            ? 'text-primary'
            : 'text-silver-text'
        }`}
      >
        {table.tableNumber}
      </span>
      <span
        data-testid={`table-status-${table.tableNumber}`}
        className={`text-sm font-bold ${
          !isAvailable
            ? 'text-red-300'
            : isSelected
            ? 'text-white-text'
            : 'text-silver-text'
        }`}
      >
        {statusLabels[table.status]}
      </span>
      <div
        className={`w-1 h-1 rounded-full ${
          isAvailable
            ? 'bg-green-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
            : isSelected
            ? 'bg-primary shadow-[0_0_8px_#C5A059]'
            : 'bg-white/20'
        }`}
      />
    </div>
  );
};
