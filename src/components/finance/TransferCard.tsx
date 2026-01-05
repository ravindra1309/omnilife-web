import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { transferFunds, getWallet } from '../../api/financeService';

interface TransferCardProps {
  onSuccess: () => void;
}

// TODO: This should come from context or auth - using hardcoded for now
const USER_ID = 5;

const TransferCard = ({ onSuccess }: TransferCardProps) => {
  const transferSchema = z.object({
    toUser: z.string().min(5, 'Account number must be at least 5 characters'),
    amount: z.number().min(0.01, 'Amount must be at least 0.01'),
  });

  type TransferFormData = z.infer<typeof transferSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
  });

  // Get current wallet to get fromUser account number
  const { data: wallet } = useQuery({
    queryKey: ['wallet', USER_ID],
    queryFn: () => getWallet(USER_ID),
  });

  const transferMutation = useMutation({
    mutationFn: async (data: TransferFormData) => {
      if (!wallet?.accountNumber) {
        throw new Error('Wallet account not found');
      }
      return transferFunds(wallet.accountNumber, data.toUser, data.amount);
    },
    onSuccess: () => {
      toast.success('Transfer Complete!');
      reset();
      onSuccess();
    },
    onError: () => {
      toast.error('Transfer Failed');
    },
  });

  const onSubmit = (data: TransferFormData) => {
    transferMutation.mutate(data);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-6">Quick Transfer</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="toUser"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Recipient Account ID
          </label>
          <input
            id="toUser"
            type="text"
            {...register('toUser')}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.toUser
                ? 'border-red-300 bg-red-50'
                : 'border-slate-300 bg-white hover:border-slate-400'
            }`}
            placeholder="Enter account number"
            disabled={transferMutation.isPending}
          />
          {errors.toUser && (
            <p className="mt-1 text-sm text-red-600">{errors.toUser.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Amount
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            {...register('amount', { valueAsNumber: true })}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.amount
                ? 'border-red-300 bg-red-50'
                : 'border-slate-300 bg-white hover:border-slate-400'
            }`}
            placeholder="0.00"
            disabled={transferMutation.isPending}
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={transferMutation.isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {transferMutation.isPending ? 'Processing...' : 'Send Funds'}
        </button>

        {transferMutation.isError && (
          <p className="text-sm text-red-600 text-center">
            Transfer failed. Please try again.
          </p>
        )}
      </form>
    </div>
  );
};

export default TransferCard;

