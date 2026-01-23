/**
 * Tipos de productos según las estaciones de cocina
 */
export const ProductType = {
  DRINK: 'DRINK',
  PASTRY: 'PASTRY',
  SANDWICH: 'SANDWICH',
} as const;

export type ProductType = (typeof ProductType)[keyof typeof ProductType];

/**
 * Modelo completo de producto del backend
 */
export interface Product {
  id: number;
  name: string;
  description: string;
  type: ProductType;
  price: number;
  preparationTimeSeconds: number;
  available: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Producto en el pedido con cantidad
 */
export interface OrderProduct {
  name: string;
  type: ProductType;
  quantity: number;
}

/**
 * Request para crear un producto (Admin)
 */
export interface CreateProductRequest {
  name: string;
  description: string;
  type: ProductType;
  price: number;
  preparationTimeSeconds: number;
  imageUrl?: string;
}

/**
 * Request para actualizar un producto (Admin)
 * Solo permite actualizar description, price, preparationTimeSeconds e imageUrl
 * Name y type no se pueden cambiar después de la creación
 */
export interface UpdateProductRequest {
  description?: string;
  price?: number;
  preparationTimeSeconds?: number;
  imageUrl?: string;
}
