export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  sku: string;
}

export interface OrderSummary {
  id: number;
  productName: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  date: string;
}



