import { useState } from 'react';
import type { CreateTableRequest } from '../../models/Table';

interface TableFormProps {
  onSubmit: (data: CreateTableRequest) => Promise<void>;
  onClose: () => void;
}

export function TableForm({ onSubmit, onClose }: TableFormProps) {
  const [formData, setFormData] = useState<CreateTableRequest>({
    tableNumber: '',
    capacity: 4,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white-text">
            Crear Nueva Mesa
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
          {/* Table Number */}
          <div>
            <label className="block text-sm font-medium text-silver-text mb-2">
              Número de Mesa *
            </label>
            <input
              type="text"
              required
              value={formData.tableNumber}
              onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white-text placeholder-silver-text focus:outline-none focus:border-primary"
              placeholder="Ej: M-01, A-10"
            />
            <p className="mt-1 text-xs text-silver-text">
              Identificador único para la mesa
            </p>
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-sm font-medium text-silver-text mb-2">
              Capacidad (personas) *
            </label>
            <input
              type="number"
              required
              min="1"
              max="20"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white-text placeholder-silver-text focus:outline-none focus:border-primary"
            />
            <p className="mt-1 text-xs text-silver-text">
              Número máximo de comensales
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
                  Creando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">add</span>
                  Crear Mesa
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
