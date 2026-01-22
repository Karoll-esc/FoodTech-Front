import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useTables } from '../hooks/useTables';
import { useOrder } from '../hooks/useOrder';
import { useKitchenTasks } from '../hooks/useKitchenTasks';
import { useProducts } from '../hooks/useProducts';
import { TableSelector } from '../components/waiter/TableSelector';
import { CategoryFilter } from '../components/waiter/CategoryFilter';
import { ProductGrid } from '../components/waiter/ProductGrid';
import { OrderSummary } from '../components/waiter/OrderSummary';
import { KitchenStatus } from '../components/waiter/KitchenStatus';
import { TableStatusManager } from '../components/waiter/TableStatusManager';
import { ProductType } from '../models/Product';
import type { TableStatus } from '../models/Table';
import { TaskStatus } from '../models/Task';

/**
 * Vista principal del mesero
 * Orquesta todos los componentes y la lógica de negocio
 */
export const WaiterView = () => {
  // Estado de mesas
  const {
    tables,
    selectedTable,
    selectedTableId,
    selectTable,
    markTableAsOccupied,
    syncTablesWithTasks,
    updateTableStatus,
    fetchTables,
  } = useTables();

  // Estado del pedido
  const {
    orderProducts,
    totalItems,
    isSubmitting,
    error,
    addProduct,
    removeProduct,
    submitOrder,
  } = useOrder();

  // Estado de cocina
  const { tasks, isLoading, refreshTasks } = useKitchenTasks();

  // Estado de productos - fetch from backend
  const { products, loading: productsLoading } = useProducts(true); // only available products

  // Categoría seleccionada
  const [selectedCategory, setSelectedCategory] = useState<
    ProductType | 'ALL'
  >('ALL');

  // Tab seleccionada en el panel derecho
  const [selectedRightTab, setSelectedRightTab] = useState<'order' | 'kitchen' | 'tables'>('order');

  /**
   * Sincroniza el estado de las mesas con las tareas cada vez que cambian
   */
  useEffect(() => {
    syncTablesWithTasks(tasks);
    // También refrescar desde el backend para asegurar consistencia
    if (tasks.length > 0) {
      fetchTables();
    }
  }, [tasks]);

  /**
   * Maneja el cambio de estado de una mesa
   */
  const handleUpdateTableStatus = async (tableId: number, newStatus: TableStatus) => {
    try {
      await updateTableStatus(tableId, newStatus);
      // Refrescar mesas después del cambio
      await fetchTables();
      const statusLabels = {
        AVAILABLE: 'Disponible',
        OCCUPIED: 'Ocupada',
        SERVED: 'Servida',
        CLEANING: 'En limpieza',
      };
      toast.success(`Mesa actualizada a: ${statusLabels[newStatus]}`);
    } catch (error) {
      toast.error('Error al actualizar el estado de la mesa');
    }
  };

  /**
   * Marca una mesa como servida cuando todas las tareas están completadas
   */
  const handleMarkAsServed = async (tableNumber: string) => {
    console.log('handleMarkAsServed llamado con tableNumber:', tableNumber);
    console.log('Mesas disponibles:', tables);
    
    const table = tables.find(t => t.tableNumber === tableNumber);
    console.log('Mesa encontrada:', table);
    
    if (!table) {
      toast.error(`No se encontró la mesa ${tableNumber}`);
      return;
    }

    try {
      console.log('Actualizando mesa ID:', table.id, 'a estado SERVED');
      await updateTableStatus(table.id, 'SERVED' as TableStatus);
      // Refrescar tareas y mesas para que la UI se actualice
      await Promise.all([fetchTables(), refreshTasks()]);
      toast.success(`Mesa ${tableNumber} marcada como servida`);
      setSelectedRightTab('tables');
    } catch (error) {
      console.error('Error al marcar mesa como servida:', error);
      toast.error('Error al marcar mesa como servida');
    }
  };

  /**
   * Maneja el envío del pedido
   */
  const handleSubmitOrder = async () => {
    if (!selectedTable) {
      toast.error('Por favor selecciona una mesa');
      return;
    }

    if (isSubmitting) {
      // Prevenir doble envío
      return;
    }

    const response = await submitOrder(selectedTable.tableNumber);

    if (response) {
      // Marcar mesa como ocupada
      await markTableAsOccupied(selectedTable.id, response.tableNumber);

      // Refrescar tareas y mesas
      await Promise.all([refreshTasks(), fetchTables()]);

      toast.success(
        `Pedido enviado a cocina\nMesa: ${response.tableNumber}\nTareas creadas: ${response.tasksCreated}`,
        { duration: 5000 }
      );
    } else if (error) {
      toast.error(`Error al crear pedido: ${error}`);
    }
  };

  const orderProductNames = orderProducts.map((p) => p.name);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Panel Izquierdo - Mesas */}
      <TableSelector
        tables={tables}
        selectedTableId={selectedTableId}
        onSelectTable={selectTable}
      />

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col overflow-hidden bg-midnight">
        {/* Header */}
        <header className="h-24 border-b border-white/5 px-10 flex items-center justify-between shrink-0 bg-charcoal">
          <div className="flex items-center gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white-text">
                {selectedTable
                  ? `Mesa ${selectedTable.tableNumber}`
                  : 'Selecciona una Mesa'}
              </h2>
              <p className="text-silver-text text-sm">
                {selectedTable
                  ? 'Agrega productos al pedido'
                  : 'Elige una mesa de la zona activa'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <span className="material-symbols-outlined text-primary text-sm">
                schedule
              </span>
              <span className="text-white-text text-sm font-bold">
                {new Date().toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        </header>

        {/* Contenido con scroll */}
        <div className="flex-1 overflow-y-auto p-10 order-scroll">
          {/* Categorías */}
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Grid de Productos */}
          {productsLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ProductGrid
              products={products}
              selectedCategory={selectedCategory}
              orderProductNames={orderProductNames}
              onAddProduct={addProduct}
            />
          )}
        </div>
      </main>

      {/* Panel Derecho */}
      <aside className="w-[420px] bg-charcoal border-l border-white/5 flex flex-col shrink-0">
        {/* Tabs */}
        <div className="flex border-b border-white/10 bg-white/5">
          <button
            onClick={() => setSelectedRightTab('order')}
            className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
              selectedRightTab === 'order'
                ? 'text-primary border-b-2 border-primary bg-white/5'
                : 'text-silver-text hover:text-white-text'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-lg">shopping_cart</span>
              Pedido
              {totalItems > 0 && (
                <span className="bg-primary text-charcoal px-2 py-0.5 rounded-full text-xs font-bold">
                  {totalItems}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setSelectedRightTab('kitchen')}
            className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
              selectedRightTab === 'kitchen'
                ? 'text-primary border-b-2 border-primary bg-white/5'
                : 'text-silver-text hover:text-white-text'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-lg">restaurant</span>
              Cocina
              {tasks.length > 0 && (
                <span className="bg-primary text-charcoal px-2 py-0.5 rounded-full text-xs font-bold">
                  {tasks.filter(t => t.status !== TaskStatus.COMPLETED).length}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setSelectedRightTab('tables')}
            className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
              selectedRightTab === 'tables'
                ? 'text-primary border-b-2 border-primary bg-white/5'
                : 'text-silver-text hover:text-white-text'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-lg">table_restaurant</span>
              Mesas
              {tables.filter(t => t.status !== 'AVAILABLE').length > 0 && (
                <span className="bg-primary text-charcoal px-2 py-0.5 rounded-full text-xs font-bold">
                  {tables.filter(t => t.status !== 'AVAILABLE').length}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Contenido según tab seleccionada */}
        <div className="flex-1 overflow-hidden">
          {selectedRightTab === 'order' && (
            <OrderSummary
              products={orderProducts}
              totalItems={totalItems}
              isSubmitting={isSubmitting}
              onRemoveProduct={removeProduct}
              onSubmit={handleSubmitOrder}
            />
          )}

          {selectedRightTab === 'kitchen' && (
            <KitchenStatus
              tasks={tasks}
              isLoading={isLoading}
              onRefresh={refreshTasks}
              onMarkAsServed={handleMarkAsServed}
              tables={tables}
            />
          )}

          {selectedRightTab === 'tables' && (
            <div className="p-6 h-full overflow-y-auto custom-scrollbar">
              <TableStatusManager
                tables={tables}
                onUpdateStatus={handleUpdateTableStatus}
              />
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};
