import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/helpers';

interface CartSummaryProps {
  subtotal: number;
  deliveryFee: number;
  total: number;
  itemCount: number;
  onCheckout: () => void;
  loading?: boolean;
}

export default function CartSummary({
  subtotal,
  deliveryFee,
  total,
  itemCount,
  onCheckout,
  loading,
}: CartSummaryProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 sticky top-24">
      <h3 className="text-xl font-bold text-red-700 mb-4">Order Summary</h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal ({itemCount} items)</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Delivery Fee</span>
          <span className="text-green-600 font-medium">FREE</span>
        </div>

        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-red-700">{formatPrice(total)}</span>
          </div>
        </div>

        <div className="bg-green-50 text-green-700 p-2 rounded-xl text-xs text-center">
          🚚 Free delivery within 5km
        </div>
      </div>

      <button
        onClick={onCheckout}
        disabled={itemCount === 0 || loading}
        className="w-full mt-4 bg-red-600 text-white py-3 rounded-full font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Proceed to Checkout'}
      </button>

      <Link to="/products" className="block text-center text-sm text-gray-500 mt-3 hover:text-red-600 transition">
        Continue Shopping
      </Link>
    </div>
  );
}