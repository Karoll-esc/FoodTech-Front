import { useState } from 'react';
import type { Product, CreateProductRequest, UpdateProductRequest } from '../../models/Product';
import { ProductType } from '../../models/Product';

interface ProductFormProps {
  product: Product | null;
  onSubmit: (data: CreateProductRequest | UpdateProductRequest) => Promise<void>;
  onClose: () => void;
}

export function ProductForm({ product, onSubmit, onClose }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    type: product?.type || ProductType.DRINK,
    price: product?.price || 0,
    preparationTimeSeconds: product?.preparationTimeSeconds || 0,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Si estamos editando, solo enviar campos permitidos
      if (product) {
        const updateData: UpdateProductRequest = {
          description: formData.description,
          price: formData.price,
          preparationTimeSeconds: formData.preparationTimeSeconds,
        };
        await onSubmit(updateData);
      } else {
        // Si estamos creando, enviar solo los campos que acepta el backend
        const createData: CreateProductRequest = {
          name: formData.name,
          description: formData.description,
          type: formData.type,
          price: formData.price,
          preparationTimeSeconds: formData.preparationTimeSeconds,
        };
        await onSubmit(createData);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 shadow-2xl bg-charcoal/95 backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white-text">
            {product ? 'Editar Producto' : 'Crear Producto'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-silver-text">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name - Inmutable en edición */}
          <div>
            <label className="block text-sm font-medium text-silver-text mb-2">
              Nombre del Producto *
              {product && <span className="text-xs font-normal ml-2">(no editable)</span>}
            </label>
            <input
              type="text"
              required
              disabled={!!product}
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white-text placeholder-silver-text focus:outline-none focus:border-primary ${
                product ? 'opacity-60 cursor-not-allowed' : ''
              }`}
              placeholder="Ej: Café Espresso"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-silver-text mb-2">
              Descripción *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white-text placeholder-silver-text focus:outline-none focus:border-primary resize-none"
              placeholder="Describe el producto..."
            />
          </div>

          {/* Type and Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-silver-text mb-2">
                Tipo de Producto *
                {product && <span className="text-xs font-normal ml-2">(no editable)</span>}
              </label>
              <select
                required
                disabled={!!product}
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value as ProductType)}
                className={`w-full px-4 py-2 bg-charcoal/95 border border-white/10 rounded-lg text-white-text focus:outline-none focus:border-primary ${
                  product ? 'opacity-60 cursor-not-allowed' : ''
                }`}
                style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
              >
                <option value={ProductType.DRINK}>Bebida</option>
                <option value={ProductType.PASTRY}>Pastel</option>
                <option value={ProductType.SANDWICH}>Sándwich</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-silver-text mb-2">
                Precio ($) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white-text placeholder-silver-text focus:outline-none focus:border-primary"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Preparation Time */}
          <div>
            <label className="block text-sm font-medium text-silver-text mb-2">
              Tiempo de Preparación (minutos) *
            </label>
            <input
              type="number"
              required
              min="0"
              value={Math.floor(formData.preparationTimeSeconds / 60)}
              onChange={(e) => handleChange('preparationTimeSeconds', parseInt(e.target.value) * 60)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white-text placeholder-silver-text focus:outline-none focus:border-primary"
              placeholder="5"
            />
            <p className="mt-1 text-xs text-silver-text">
              Tiempo estimado para preparar este producto
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-6 py-2 border border-white/10 rounded-lg text-white-text hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">save</span>
                  {product ? 'Actualizar' : 'Crear Producto'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
