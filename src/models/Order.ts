import { ProductType } from './Product';

/**
 * Estados de una orden según el backend
 */
export const OrderStatus = {
  PENDING: 'PENDING',
  IN_PREPARATION: 'IN_PREPARATION',
  COMPLETED: 'COMPLETED',
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

/**
 * Producto en el pedido para enviar al backend
 */
export interface CreateOrderProduct {
  name: string;
  type: ProductType;
}

/**
 * Request para crear una orden
 */
export interface CreateOrderRequest {
  tableNumber: string;
  products: CreateOrderProduct[];
}

/**
 * Response al crear una orden
 */
export interface CreateOrderResponse {
  tableNumber: string;
  tasksCreated: number;
  message: string;
}

/**
 * Response al consultar el estado de una orden
 */
export interface OrderStatusResponse {
  orderId: string;
  status: OrderStatus;
}
