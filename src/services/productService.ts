import { apiClient } from './apiClient';
import type { Product, ProductType, CreateProductRequest, UpdateProductRequest } from '../models/Product';

export interface ProductFilters {
  available?: boolean;
  type?: ProductType;
}

/**
 * Servicio para gestionar productos
 */
class ProductService {
  /**
   * Obtiene todos los productos con filtros opcionales
   */
  async list(filters?: ProductFilters): Promise<Product[]> {
    const params = new URLSearchParams();
    
    if (filters?.available !== undefined) {
      params.append('available', filters.available.toString());
    }
    
    if (filters?.type) {
      params.append('type', filters.type);
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/api/products?${queryString}` : '/api/products';
    
    return apiClient.get<Product[]>(endpoint);
  }

  /**
   * Obtiene un producto por ID
   */
  async getById(id: number): Promise<Product> {
    return apiClient.get<Product>(`/api/products/${id}`);
  }

  /**
   * Crea un nuevo producto (Admin)
   */
  async create(request: CreateProductRequest): Promise<Product> {
    return apiClient.post<CreateProductRequest, Product>('/api/products', request);
  }

  /**
   * Actualiza un producto existente (Admin)
   */
  async update(id: number, request: UpdateProductRequest): Promise<Product> {
    return apiClient.put<UpdateProductRequest, Product>(`/api/products/${id}`, request);
  }

  /**
   * Cambia la disponibilidad de un producto (Admin)
   */
  async toggleAvailability(id: number, available: boolean): Promise<Product> {
    return apiClient.patch<{ available: boolean }, Product>(
      `/api/products/${id}/availability`,
      { available }
    );
  }

  /**
   * Elimina un producto (Admin)
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/products/${id}`);
  }
}

export const productService = new ProductService();
