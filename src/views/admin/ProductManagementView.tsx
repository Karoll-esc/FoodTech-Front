import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { productService } from '../../services/productService';
import type { Product } from '../../models/Product';
import { ProductType } from '../../models/Product';
import { ProductTable } from '../../components/admin/ProductTable';
import { ProductForm } from '../../components/admin/ProductForm';

export function ProductManagementView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<ProductType | 'ALL'>('ALL');
  const [filterAvailable, setFilterAvailable] = useState<boolean | 'ALL'>('ALL');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.list();
      console.log('Productos recibidos del backend:', data);
      console.log('Cantidad de productos:', data.length);
      console.log('🔍 Primer producto con detalles:', data[0]);
      console.log('🖼️ URLs de imágenes:', data.map(p => ({ name: p.name, imageUrl: p.imageUrl })));
      setProducts(data);
    } catch (error) {
      toast.error('Error al cargar productos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      console.log('📤 Enviando producto al backend:', data);
      if (editingProduct) {
        const response = await productService.update(editingProduct.id, data);
        console.log('📥 Respuesta del backend (update):', response);
        toast.success('Producto actualizado exitosamente');
      } else {
        const response = await productService.create(data);
        console.log('📥 Respuesta del backend (create):', response);
        toast.success('Producto creado exitosamente');
      }
      setIsFormOpen(false);
      setEditingProduct(null);
      await fetchProducts();
    } catch (error: any) {
      console.error('❌ Error al guardar producto:', error);
      toast.error(error.message || 'Error al guardar el producto');
    }
  };

  const handleToggleAvailability = async (product: Product) => {
    try {
      // Invertir el estado actual
      const newAvailability = !product.available;
      await productService.toggleAvailability(product.id, newAvailability);
      toast.success(`Producto ${newAvailability ? 'activado' : 'desactivado'}`);
      await fetchProducts();
    } catch (error) {
      toast.error('Error al cambiar disponibilidad');
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await productService.delete(product.id);
      toast.success('Producto eliminado exitosamente');
      await fetchProducts();
    } catch (error) {
      toast.error('Error al eliminar el producto');
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || product.type === filterType;
    const matchesAvailable = filterAvailable === 'ALL' || product.available === filterAvailable;
    
    return matchesSearch && matchesType && matchesAvailable;
  });

  return (
    <div className="min-h-screen bg-midnight pt-16">
      {/* Header */}
      <div className="bg-charcoal border-b border-white/5 px-10 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white-text mb-2">
              Gestión de Productos
            </h1>
            <p className="text-silver-text">
              Administra el catálogo de productos del menú
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="btn-primary flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            Crear Producto
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mt-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white-text placeholder-silver-text focus:outline-none focus:border-primary"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as ProductType | 'ALL')}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white-text focus:outline-none focus:border-primary"
          >
            <option value="ALL">Todos los tipos</option>
            <option value={ProductType.DRINK}>Bebidas</option>
            <option value={ProductType.PASTRY}>Pasteles</option>
            <option value={ProductType.SANDWICH}>Sándwiches</option>
          </select>
          <select
            value={filterAvailable === 'ALL' ? 'ALL' : String(filterAvailable)}
            onChange={(e) => setFilterAvailable(e.target.value === 'ALL' ? 'ALL' : e.target.value === 'true')}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white-text focus:outline-none focus:border-primary"
          >
            <option value="ALL">Todas las disponibilidades</option>
            <option value="true">Disponibles</option>
            <option value="false">No disponibles</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="p-10">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ProductTable
            products={filteredProducts}
            onEdit={handleEdit}
            onToggleAvailability={handleToggleAvailability}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setIsFormOpen(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}
