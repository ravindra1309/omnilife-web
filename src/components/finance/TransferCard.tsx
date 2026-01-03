import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { transferFunds } from '../../api/financeService';

interface TransferCardProps {
  fromUser: string; // Account number of the sender
  onSuccess?: () => void; // Callback to refresh data after successful transfer
}

const TransferCard = ({ fromUser, onSuccess }: TransferCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  // Create schema with fromUser validation
  const transferSchema = z.object({
    toUser: z
      .string()
      .min(5, 'Account number must be at least 5 characters')
      .refine(
        (value) => value !== fromUser,
        {
          message: 'Cannot transfer to the same account. Please enter a different account number.',
        }
      ),
    amount: z.number().min(1, 'Amount must be at least 1'),
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

  const onSubmit = async (data: TransferFormData) => {
    // Additional safety check (though zod validation should catch this)
    if (data.toUser === fromUser) {
      toast.error('Cannot transfer to the same account. Please enter a different account number.');
      return;
    }

    setIsLoading(true);
    try {
      await transferFunds(fromUser, data.toUser, data.amount);
      toast.success('Transfer Complete!');
      reset();
      onSuccess?.();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Transfer failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-6">Quick Transfer</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="toUser"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            To Account
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
            disabled={isLoading}
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
            min="1"
            {...register('amount', { valueAsNumber: true })}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.amount
                ? 'border-red-300 bg-red-50'
                : 'border-slate-300 bg-white hover:border-slate-400'
            }`}
            placeholder="0.00"
            disabled={isLoading}
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {isLoading ? 'Processing...' : 'Send Funds'}
        </button>
      </form>
    </div>
  );
};

export default TransferCard;

