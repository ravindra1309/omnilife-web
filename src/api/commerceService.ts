import axiosClient from './axiosClient';
import type { Product } from '../types/commerce';

export async function getProducts(): Promise<Product[]> {
  const response = await axiosClient.get('/commerce/products');
  return response.data;
}

