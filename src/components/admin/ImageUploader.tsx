import { useState, useRef } from 'react';

interface ImageUploaderProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
}

export function ImageUploader({ imageUrl, onImageChange }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string>(imageUrl);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5MB');
      return;
    }

    setUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        onImageChange(base64String);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al cargar la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-silver-text mb-2">
        Imagen del Producto
      </label>
      
      <div className="flex items-start gap-4">
        {/* Preview */}
        <div className="flex-shrink-0">
          {preview ? (
            <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-white/10">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 p-1 bg-red-500/80 hover:bg-red-500 rounded-full transition-colors"
                title="Eliminar imagen"
              >
                <span className="material-symbols-outlined text-sm text-white">close</span>
              </button>
            </div>
          ) : (
            <div className="w-32 h-32 rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center bg-white/5">
              <span className="material-symbols-outlined text-4xl text-silver-text/50">
                image
              </span>
            </div>
          )}
        </div>

        {/* Upload Button */}
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className={`inline-flex items-center gap-2 px-4 py-2 border border-white/10 rounded-lg text-white-text hover:bg-white/5 transition-colors cursor-pointer ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                Cargando...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">upload</span>
                {preview ? 'Cambiar imagen' : 'Seleccionar imagen'}
              </>
            )}
          </label>
          <p className="mt-2 text-xs text-silver-text">
            PNG, JPG o WEBP. Máximo 5MB.
          </p>
        </div>
      </div>
    </div>
  );
}
