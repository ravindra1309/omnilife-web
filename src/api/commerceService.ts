import axiosClient from './axiosClient';
import type { Product, OrderSummary } from '../types/commerce';

export async function getProducts(): Promise<Product[]> {
  const response = await axiosClient.get('/commerce/products');
  return response.data;
}

export async function placeOrder(userId: string, productId: number) {
  const response = await axiosClient.post('/commerce/orders', {
    userId,
    productId,
  });
  return response.data;
}

export async function getMyOrders(userId: string): Promise<OrderSummary[]> {
  const response = await axiosClient.get('/commerce/orders/my', {
    params: { userId },
  });
  return response.data;
}


