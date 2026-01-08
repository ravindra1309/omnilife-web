import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../api/commerceService';
import ProductCard from '../components/commerce/ProductCard';
import type { Product } from '../types/commerce';

const Marketplace = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(),
  });

  const handleBuy = (product: Product) => {
    alert('Buying ' + product.name);
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

