export interface Wallet {
  id: number;
  accountNumber: string;
  name: string;
  balance: number;
  currency: string;
}

export interface Transaction {
  id: number;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  description: string;
  timestamp: string;
}








