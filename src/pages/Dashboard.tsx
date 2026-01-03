import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getWallet, getHistory } from '../api/financeService';
import TransactionList from '../components/finance/TransactionList';
import TransferCard from '../components/finance/TransferCard';
import type { Transaction } from '../types/finance';

// TODO: Replace with actual Alice wallet ID from your backend
const USER_ID = 5; // Wallet ID (Long type from backend)

const Dashboard = () => {
  const queryClient = useQueryClient();

  const { data: wallet, isLoading: walletLoading, isError: walletError, error } = useQuery({
    queryKey: ['wallet', USER_ID],
    queryFn: () => getWallet(USER_ID),
  });

  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ['history', USER_ID],
    queryFn: () => getHistory(USER_ID),
  });

  const formatBalance = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

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

  const handleTransferSuccess = () => {
    // Invalidate queries to refresh wallet balance and transaction history
    queryClient.invalidateQueries({ queryKey: ['wallet', USER_ID] });
    queryClient.invalidateQueries({ queryKey: ['history', USER_ID] });
  };

  if (walletLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 animate-pulse">
              <div className="h-6 bg-blue-400 rounded w-32 mb-4"></div>
              <div className="h-12 bg-blue-400 rounded w-48"></div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 animate-pulse">
              <div className="h-64 bg-slate-200 rounded"></div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-64 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (walletError) {
    // Extract error details from axios error
    const getErrorMessage = () => {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.error || axiosError.response?.data?.message;

        if (status === 404) {
          return {
            title: 'Wallet Not Found',
            message: 'The requested wallet account could not be found. Please verify the account ID and try again.',
          };
        }
        if (status === 401) {
          return {
            title: 'Authentication Required',
            message: 'Please sign in to access your wallet information.',
          };
        }
        if (status === 403) {
          return {
            title: 'Access Denied',
            message: 'You do not have permission to access this wallet.',
          };
        }
        if (status >= 500) {
          return {
            title: 'Service Unavailable',
            message: 'Our servers are experiencing issues. Please try again in a few moments.',
          };
        }
        if (message) {
          return {
            title: 'Unable to Load Wallet',
            message: message,
          };
        }
      }

      // Network or other errors
      if (error instanceof Error) {
        if (error.message.includes('Network Error') || error.message.includes('timeout')) {
          return {
            title: 'Connection Error',
            message: 'Unable to connect to the server. Please check your internet connection and try again.',
          };
        }
      }

      return {
        title: 'Unable to Load Wallet',
        message: 'An unexpected error occurred while loading your wallet. Please refresh the page or try again later.',
      };
    };

    const errorInfo = getErrorMessage();

    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white border border-red-200 rounded-xl shadow-lg p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-slate-900 mb-2">{errorInfo.title}</h2>
                <p className="text-slate-600 mb-4">{errorInfo.message}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Left Column - 2/3 width on large screens */}
        <div className="lg:col-span-2 space-y-6">
          {/* Balance Card with Gradient */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 text-white">
            <h2 className="text-blue-100 text-sm font-medium mb-2">Total Balance</h2>
            <p className="text-5xl font-bold">
              {wallet ? formatBalance(wallet.balance, wallet.currency) : '$0.00'}
            </p>
            {wallet && (
              <p className="text-blue-100 text-sm mt-2">Account: {wallet.accountNumber}</p>
            )}
          </div>

          {/* Transaction List */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Transactions</h3>
            {historyLoading ? (
              <div className="bg-white rounded-lg shadow-md p-8 animate-pulse">
                <div className="h-64 bg-slate-200 rounded"></div>
              </div>
            ) : (
              <TransactionList transactions={transactions} />
            )}
          </div>
        </div>

        {/* Right Column - 1/3 width on large screens */}
        <div className="lg:col-span-1">
          {wallet && (
            <TransferCard
              fromUser={wallet.accountNumber}
              onSuccess={handleTransferSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

