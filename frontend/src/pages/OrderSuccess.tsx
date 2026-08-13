import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaWhatsapp, FaTruck, FaPrint } from 'react-icons/fa';
import { formatPrice } from '../utils/helpers';

interface OrderData {
  orderNumber: string;
  items: any[];
  total: number;
  address: any;
  paymentMethod: string;
  estimatedDelivery?: string;
}

export default function OrderSuccess() {
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('lastOrder');
    console.log('📦 Stored order:', stored); // Debug log
    if (stored) {
      setOrder(JSON.parse(stored));
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
            <FaCheckCircle className="text-5xl text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-red-700">Order Placed! 🎉</h1>
        <p className="text-gray-500 mt-2">Thank you for your order. We'll start preparing it soon.</p>

        {/* ✅ Order Number - Now shows the actual order number */}
        <div className="mt-6 p-4 bg-yellow-50 rounded-2xl border border-yellow-200">
          <p className="text-sm text-gray-600">Order Number</p>
          <p className="text-xl font-bold text-red-700 font-mono">{order.orderNumber}</p>
        </div>

        {/* Order Details */}
        <div className="mt-6 text-left space-y-4">
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="text-gray-600">Items</span>
            <span className="font-medium">{order.items.length} items</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="text-gray-600">Total</span>
            <span className="font-bold text-red-700">{formatPrice(order.total)}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="text-gray-600">Payment</span>
            <span className="font-medium capitalize">{order.paymentMethod?.replace('_', ' ') || 'Cash on Delivery'}</span>
          </div>
          {order.estimatedDelivery && (
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-600">Estimated Delivery</span>
              <span className="font-medium">{order.estimatedDelivery}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            to="/orders"
            className="flex-1 bg-red-600 text-white py-3 rounded-full font-semibold hover:bg-red-700 transition"
          >
            <FaTruck className="inline mr-2" />
            View My Orders
          </Link>
          <a
            href={`https://wa.me/91800851140?text=Hi%2C%20I%20just%20placed%20order%20${order.orderNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
          >
            <FaWhatsapp /> Contact on WhatsApp
          </a>
        </div>

        <button
          onClick={() => window.print()}
          className="mt-4 text-sm text-gray-500 hover:text-red-600 transition flex items-center justify-center gap-2"
        >
          <FaPrint /> Print Order Summary
        </button>

        <Link
          to="/products"
          className="block mt-6 text-red-600 hover:underline font-medium"
        >
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
}