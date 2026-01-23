import type { Table } from '../../models/Table';
import { TableCard } from './TableCard';

interface TableSelectorProps {
  tables: Table[];
  selectedTableId: number | null;
  onSelectTable: (tableId: number) => void;
}

/**
 * Panel lateral con selector de mesas
 */
export const TableSelector = ({
  tables,
  selectedTableId,
  onSelectTable,
}: TableSelectorProps) => {
  return (
    <aside className="w-72 bg-charcoal border-r border-white/5 flex flex-col shrink-0">
      {/* Header */}
      

      {/* Active Zone */}
      <div className="mt-4 px-4 flex-1">
        <p className="text-[11px] uppercase tracking-widest text-silver-text px-3 mb-4">
          Zona Activa
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {tables.map((table) => (
            <TableCard
              key={table.id}
              table={table}
              isSelected={selectedTableId === table.id}
              onSelect={onSelectTable}
            />
          ))}
        </div>
      </div>
    </aside>
  );
};
