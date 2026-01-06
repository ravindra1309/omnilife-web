import { useQuery } from '@tanstack/react-query';
import { Copy, Trash2 } from 'lucide-react';
import { getWallet } from '../api/financeService';
import toast from 'react-hot-toast';

// TODO: Replace with actual Alice wallet ID from your backend
const USER_ID = 5; // Wallet ID (Long type from backend)

const Settings = () => {
  const { data: wallet, isLoading, isError, error } = useQuery({
    queryKey: ['wallet', USER_ID],
    queryFn: () => getWallet(USER_ID),
  });

  const handleCopyAccountNumber = () => {
    if (wallet?.accountNumber) {
      navigator.clipboard.writeText(wallet.accountNumber);
      toast.success('Account number copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">Account Settings</h1>
          <div className="bg-white rounded-lg shadow p-8 animate-pulse">
            <div className="space-y-4">
              <div className="h-6 bg-slate-200 rounded w-32"></div>
              <div className="h-6 bg-slate-200 rounded w-48"></div>
              <div className="h-6 bg-slate-200 rounded w-24"></div>
              <div className="h-6 bg-slate-200 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">Account Settings</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600">
              {error instanceof Error ? error.message : 'Failed to load account settings'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Account Settings</h1>

        {/* User Details Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">User Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-slate-500">Account Name</dt>
              <dd className="mt-1 text-sm text-slate-900">{wallet?.name || 'N/A'}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Account Number</dt>
              <dd className="mt-1 flex items-center gap-2">
                <span className="text-sm text-slate-900 font-mono">
                  {wallet?.accountNumber || 'N/A'}
                </span>
                <button
                  onClick={handleCopyAccountNumber}
                  className="p-1 text-slate-500 hover:text-blue-600 transition-colors"
                  title="Copy account number"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Currency</dt>
              <dd className="mt-1 text-sm text-slate-900">{wallet?.currency || 'USD'}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Account Status</dt>
              <dd className="mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </dd>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
          <p className="text-sm text-slate-600 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            disabled
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-medium rounded-lg opacity-50 cursor-not-allowed"
          >
            <Trash2 className="h-4 w-4" />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

