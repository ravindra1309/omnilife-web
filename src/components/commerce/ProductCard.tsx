import { ShoppingBag } from 'lucide-react';
import type { Product } from '../../types/commerce';

interface ProductCardProps {
  product: Product;
  onBuy: (product: Product) => void;
}

const ProductCard = ({ product, onBuy }: ProductCardProps) => {
  const isOutOfStock = product.stockQuantity === 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity < 5;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header - Image Placeholder */}
      <div className="h-48 bg-slate-200 flex items-center justify-center">
        <ShoppingBag className="w-12 h-12 text-slate-400" />
      </div>

      {/* Body */}
      <div className="p-4 space-y-2">
        {/* Title */}
        <h3 className="font-bold text-slate-900 truncate">{product.name}</h3>

        {/* Price */}
        <p className="text-lg font-bold text-emerald-600">{formatPrice(product.price)}</p>

        {/* Description */}
        <p className="text-sm text-slate-600 line-clamp-2">{product.description}</p>
      </div>

      {/* Footer */}
      <div className="p-4 pt-0 space-y-3">
        {/* Stock Badge */}
        <div>
          {isLowStock ? (
            <span className="inline-block px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded">
              Low Stock
            </span>
          ) : isOutOfStock ? (
            <span className="inline-block px-2 py-1 text-xs font-semibold text-slate-700 bg-slate-100 rounded">
              Out of Stock
            </span>
          ) : (
            <span className="inline-block px-2 py-1 text-xs font-semibold text-slate-700 bg-slate-100 rounded">
              In Stock
            </span>
          )}
        </div>

        {/* Buy Button */}
        <button
          onClick={() => onBuy(product)}
          disabled={isOutOfStock}
          className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
            isOutOfStock
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isOutOfStock ? 'Out of Stock' : 'Buy Now'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

