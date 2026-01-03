import { format } from 'date-fns';
import { ArrowUp, ArrowDown, Receipt } from 'lucide-react';
import type { Transaction } from '../../types/finance';

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList = ({ transactions }: TransactionListProps) => {
  const formatAmount = (amount: number, type: 'DEBIT' | 'CREDIT', currency: string = 'USD') => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return type === 'CREDIT' ? `+${formatted}` : `-${formatted}`;
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <Receipt className="mx-auto h-12 w-12 text-slate-400 mb-4" />
        <p className="text-slate-500 text-lg font-medium">No recent transactions</p>
        <p className="text-slate-400 text-sm mt-2">Your transaction history will appear here</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {format(new Date(transaction.timestamp), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 text-sm text-slate-900">
                  {transaction.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {transaction.type === 'CREDIT' ? (
                      <>
                        <ArrowUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">CREDIT</span>
                      </>
                    ) : (
                      <>
                        <ArrowDown className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium text-red-600">DEBIT</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold">
                  <span
                    className={
                      transaction.type === 'CREDIT'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    {formatAmount(transaction.amount, transaction.type)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;

