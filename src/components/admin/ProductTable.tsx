import type { Product } from '../../models/Product';
import { ProductType } from '../../models/Product';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onToggleAvailability: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const productTypeLabels: Record<ProductType, string> = {
  [ProductType.DRINK]: 'Bebida',
  [ProductType.PASTRY]: 'Pastel',
  [ProductType.SANDWICH]: 'Sándwich',
};

export function ProductTable({ products, onEdit, onToggleAvailability, onDelete }: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="glass-panel p-12 text-center">
        <span className="material-symbols-outlined text-6xl text-silver-text/30 mb-4 block">
          inventory_2
        </span>
        <p className="text-silver-text">No se encontraron productos</p>
      </div>
    );
  }

  return (
    <div className="glass-panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-silver-text">
                Producto
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-silver-text">
                Tipo
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-silver-text">
                Precio
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-silver-text">
                Tiempo Prep.
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-silver-text">
                Disponibilidad
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-silver-text">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-white-text">
                        {product.name}
                      </div>
                      <div className="text-xs text-silver-text line-clamp-1">
                        {product.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-white/10 text-white-text">
                    {productTypeLabels[product.type]}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-white-text">
                  ${product.price?.toFixed(2) || '0.00'}
                </td>
                <td className="px-6 py-4 text-sm text-silver-text">
                  {product.preparationTimeSeconds ? `${Math.floor(product.preparationTimeSeconds / 60)}min` : 'N/A'}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onToggleAvailability(product)}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                      product.available
                        ? 'bg-primary/20 text-primary hover:bg-primary/30'
                        : 'bg-white/10 text-silver-text hover:bg-white/20'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {product.available ? 'check_circle' : 'cancel'}
                    </span>
                    {product.available ? 'Disponible' : 'No disponible'}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors text-silver-text hover:text-white-text"
                      title="Editar"
                    >
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </button>
                    <button
                      onClick={() => onDelete(product)}
                      className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-silver-text hover:text-red-400"
                      title="Eliminar"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
