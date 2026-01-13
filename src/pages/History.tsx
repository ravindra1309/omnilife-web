import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getHistory } from '../api/financeService';
import TransactionList from '../components/finance/TransactionList';
import type { Transaction } from '../types/finance';

// TODO: Replace with actual Alice wallet ID from your backend
const USER_ID = 5; // Wallet ID (Long type from backend)
const PAGE_SIZE = 10;

const History = () => {
  const [page, setPage] = useState(0);

  const { data: historyData, isLoading } = useQuery({
    queryKey: ['history', USER_ID, page],
    queryFn: () => getHistory(USER_ID, page, PAGE_SIZE),
  });

  // Transform history data from Spring Page format to Transaction array
  const transactions: Transaction[] = historyData?.content
    ? historyData.content.map((item, index) => ({
        id: index, // Use index as id since transactionId is a string
        type: item.type,
        amount: typeof item.amount === 'number' ? item.amount : parseFloat(String(item.amount)),
        description: item.description || '',
        timestamp: item.timestamp || new Date().toISOString(),
      }))
    : [];

  const handlePrevious = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (transactions.length >= PAGE_SIZE) {
      setPage(page + 1);
    }
  };

  const canGoNext = transactions.length >= PAGE_SIZE;
  const canGoPrevious = page > 0;

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Transaction History</h1>

        {isLoading ? (
          <div className="bg-white rounded-lg shadow p-8 animate-pulse">
            <div className="h-64 bg-slate-200 rounded"></div>
          </div>
        ) : (
          <>
            <TransactionList transactions={transactions} />

            {/* Pagination Controls */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                onClick={handlePrevious}
                disabled={!canGoPrevious}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  canGoPrevious
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                Previous
              </button>

              <span className="text-slate-700 font-medium">Page {page + 1}</span>

              <button
                onClick={handleNext}
                disabled={!canGoNext}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  canGoNext
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default History;






