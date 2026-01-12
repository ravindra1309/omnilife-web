import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { getMyOrders } from '../api/commerceService';
import { getWallet } from '../api/financeService';
import type { OrderSummary } from '../types/commerce';

// TODO: Replace with actual Alice wallet ID from your backend
const USER_ID = 5; // Wallet ID (Long type from backend)

const Orders = () => {
  const { data: wallet } = useQuery({
    queryKey: ['wallet', USER_ID],
    queryFn: () => getWallet(USER_ID),
  });

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', wallet?.accountNumber],
    queryFn: () => getMyOrders(wallet!.accountNumber),
    enabled: !!wallet?.accountNumber,
  });

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  if (isLoading || !wallet) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">My Orders</h1>
        <div className="text-slate-600">Loading orders...</div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">My Orders</h1>
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <p className="text-slate-500 text-lg font-medium mb-2">
            No orders yet. Go to{' '}
            <Link to="/market" className="text-blue-600 hover:text-blue-700 underline">
              Marketplace
            </Link>
            !
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">My Orders</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="w-5 h-5 text-slate-400" />
                      <span className="font-bold text-slate-900">{order.productName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {formatDate(order.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                        order.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'FAILED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-slate-900">
                    {formatAmount(order.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;

