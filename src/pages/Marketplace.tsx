import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getProducts, placeOrder } from '../api/commerceService';
import { getWallet } from '../api/financeService';
import ProductCard from '../components/commerce/ProductCard';
import type { Product } from '../types/commerce';

// TODO: Replace with actual Alice wallet ID from your backend
const USER_ID = 5; // Wallet ID (Long type from backend)

const Marketplace = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(),
  });

  const { data: wallet } = useQuery({
    queryKey: ['wallet', USER_ID],
    queryFn: () => getWallet(USER_ID),
  });

  const handleBuy = async (product: Product) => {
    try {
      if (!wallet?.accountNumber) {
        toast.error('Wallet account not found');
        return;
      }
      await placeOrder(wallet.accountNumber, product.id);
      toast.success('Order Placed: ' + product.name);
    } catch (error) {
      toast.error('Purchase Failed');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Marketplace</h1>
        <div className="text-slate-600">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Marketplace</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} onBuy={handleBuy} />
        ))}
      </div>
    </div>
  );
};

export default Marketplace;


