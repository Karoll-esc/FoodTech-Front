import { useState, useEffect, useCallback } from 'react';
import type { Product, ProductType } from '../models/Product';
import { productService } from '../services/productService';

/**
 * Hook para gestionar productos del menú
 */
export const useProducts = (availableOnly = true) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedType, setSelectedType] = useState<ProductType | 'ALL'>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga los productos desde el backend
   */
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedProducts = await productService.list({
        available: availableOnly,
      });
      setProducts(fetchedProducts);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al cargar productos';
      setError(errorMessage);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [availableOnly]);

  /**
   * Carga inicial de productos
   */
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /**
   * Filtra productos según el tipo seleccionado
   */
  useEffect(() => {
    if (selectedType === 'ALL') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.type === selectedType));
    }
  }, [products, selectedType]);

  return {
    products: filteredProducts,
    allProducts: products,
    selectedType,
    setSelectedType,
    loading,
    error,
    refreshProducts: fetchProducts,
  };
};
