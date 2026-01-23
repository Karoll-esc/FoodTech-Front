import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useTables } from '../../hooks/useTables';
import { TableList } from '../../components/admin/TableList';
import { TableForm } from '../../components/admin/TableForm';
import type { Table } from '../../models/Table';

export function TableManagementView() {
  const { tables, loading, fetchTables, createTable, updateTableStatus, deleteTable } = useTables();
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchTables();
  }, []);

  const handleCreate = () => {
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: { tableNumber: string; capacity: number }) => {
    try {
      await createTable(data);
      toast.success('Mesa creada exitosamente');
      setIsFormOpen(false);
      await fetchTables();
    } catch (error: any) {
      toast.error(error.message || 'Error al crear la mesa');
    }
  };

  const handleStatusChange = async (table: Table, newStatus: string) => {
    try {
      await updateTableStatus(table.id, newStatus);
      toast.success('Estado de mesa actualizado');
      await fetchTables();
    } catch (error) {
      toast.error('Error al actualizar el estado');
    }
  };

  const handleDelete = async (table: Table) => {
    if (!confirm(`¿Eliminar mesa ${table.tableNumber}? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await deleteTable(table.id);
      toast.success('Mesa eliminada exitosamente');
      await fetchTables();
    } catch (error: any) {
      toast.error(error.message || 'Error al eliminar la mesa');
    }
  };

  return (
    <div className="min-h-screen bg-midnight pt-16">
      {/* Header */}
      <div className="bg-charcoal border-b border-white/5 px-10 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white-text mb-2">
              Gestión de Mesas
            </h1>
            <p className="text-silver-text">
              Administra las mesas del restaurante
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="btn-primary flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            Crear Mesa
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-10">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <TableList
            tables={tables}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <TableForm
          onSubmit={handleFormSubmit}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
