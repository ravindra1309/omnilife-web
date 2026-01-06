import axiosClient from './axiosClient';
import type { Wallet } from '../types/finance';

export async function getWallet(id: number): Promise<Wallet> {
  const response = await axiosClient.get(`/finance/wallets/${id}`);
  return response.data;
}

interface HistoryPageResponse {
  content: Array<{
    transactionId: string;
    type: 'DEBIT' | 'CREDIT';
    amount: number;
    currency: string;
    timestamp: string;
    description: string;
  }>;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export async function getHistory(
  id: number,
  page: number = 0,
  size: number = 10
): Promise<HistoryPageResponse> {
  const response = await axiosClient.get(`/finance/wallets/${id}/transactions`, {
    params: {
      page,
      size,
    },
  });
  return response.data;
}

export async function transferFunds(
  fromUser: string,
  toUser: string,
  amount: number
): Promise<{ message: string }> {
  const response = await axiosClient.post('/finance/transfer', {
    fromUser,
    toUser,
    amount,
  });
  return response.data;
}

