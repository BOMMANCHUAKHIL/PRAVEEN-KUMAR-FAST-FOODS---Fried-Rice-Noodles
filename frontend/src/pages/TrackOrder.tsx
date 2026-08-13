import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaSearch, FaTruck, FaClock, FaCheckCircle, FaTimesCircle, FaWhatsapp } from 'react-icons/fa';
import { api } from '../services/api';
import { formatPrice } from '../utils/helpers';
import toast from 'react-hot-toast';

interface Order {
  _id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  items: Array<{
    name: string;
    variant: string;
    quantity: number;
    price: number;
  }>;
  total_amount: number;
  status: 'placed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  payment_method: string;
  created_at: string;
  updated_at: string;
}

export default function TrackOrder() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('id') || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tracked, setTracked] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) {
      toast.error('Please enter an Order ID');
      return;
    }

    setLoading(true);
    setError('');
    setTracked(false);

    try {
      // ✅ Fetch order from backend
      const response = await api.get(`/api/orders/track/${orderId.trim()}`);
      console.log('📦 Order found:', response.data);

      if (response.data) {
        setOrder(response.data);
        setTracked(true);
        toast.success('Order found!');
        setSearchParams({ id: orderId.trim() });
      } else {
        setError('Order not found. Please check the Order ID.');
      }
    } catch (err: any) {
      console.error('❌ Error fetching order:', err);
      if (err.response?.status === 404) {
        setError('Order not found. Please check the Order ID.');
      } else {
        setError(err.response?.data?.detail || 'Failed to fetch order. Please try again.');
      }
      toast.error('Order not found');
    } finally {
      setLoading(false);
    }
  };

  const getStatusSteps = (currentStatus: string) => {
    const steps = [
      { key: 'placed', label: 'Order Placed', icon: FaClock },
      { key: 'preparing', label: 'Preparing', icon: FaClock },
      { key: 'out_for_delivery', label: 'Out for Delivery', icon: FaTruck },
      { key: 'delivered', label: 'Delivered', icon: FaCheckCircle },
    ];

    const currentIndex = steps.findIndex(s => s.key === currentStatus);
    if (currentIndex === -1) return steps.map(s => ({ ...s, isCompleted: false, isCurrent: false }));

    return steps.map((step, index) => ({
      ...step,
      isCompleted: index <= currentIndex,
      isCurrent: index === currentIndex,
    }));
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      placed: 'Order Placed',
      preparing: 'Preparing Food',
      out_for_delivery: 'Out for Delivery 🚚',
      delivered: 'Delivered ✅',
      cancelled: 'Cancelled ❌',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      placed: 'bg-blue-100 text-blue-700',
      preparing: 'bg-yellow-100 text-yellow-700',
      out_for_delivery: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  // If order is tracked and found, show details
  if (tracked && order) {
    const steps = getStatusSteps(order.status);
    const isCancelled = order.status === 'cancelled';

    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-red-700 text-center mb-2">Track Your Order</h1>
        <p className="text-center text-gray-500 mb-8">Real-time order status</p>

        {/* Order Info */}
        <div className="bg-white rounded-2xl shadow border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="text-xl font-bold text-red-700 font-mono">{order.order_number}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-xl font-bold text-red-700">{formatPrice(order.total_amount)}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap justify-between">
            <div>
              <p className="text-sm text-gray-500">Customer</p>
              <p className="font-medium">{order.customer_name || 'Customer'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment</p>
              <p className="font-medium capitalize">{order.payment_method?.replace('_', ' ') || 'N/A'}</p>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-sm text-gray-500">Items</p>
            <div className="mt-1 space-y-1">
              {order.items?.map((item, idx) => (
                <p key={idx} className="text-sm">
                  {item.name} × {item.quantity} - {formatPrice(item.price * item.quantity)}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-6 flex justify-center">
          <span className={`px-6 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {getStatusLabel(order.status)}
          </span>
        </div>

        {/* Status Timeline */}
        {!isCancelled && (
          <div className="bg-white rounded-2xl shadow border border-gray-200 p-6 mb-8">
            <h3 className="font-semibold text-gray-700 mb-6">Order Status</h3>
            <div className="relative">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isLast = index === steps.length - 1;

                return (
                  <div key={step.key} className="flex items-start gap-4 mb-6 last:mb-0">
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                        step.isCompleted ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-400'
                      }`}>
                        <Icon className="text-lg" />
                      </div>
                      {!isLast && (
                        <div className={`absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-12 ${
                          step.isCompleted ? 'bg-red-600' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className={`font-medium ${step.isCompleted ? 'text-red-700' : 'text-gray-400'}`}>
                        {step.label}
                      </p>
                      {step.isCurrent && (
                        <p className="text-sm text-gray-500 animate-pulse">In progress...</p>
                      )}
                    </div>
                    {step.isCompleted && (
                      <span className="text-green-500 text-sm">✓</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {isCancelled && (
          <div className="bg-red-50 rounded-2xl border border-red-200 p-6 mb-8">
            <p className="text-red-700 font-semibold">❌ This order has been cancelled</p>
          </div>
        )}

        {/* WhatsApp Support */}
        <div className="bg-yellow-50 rounded-2xl border border-yellow-200 p-6">
          <div className="flex items-center gap-3">
            <FaTruck className="text-red-600 text-2xl" />
            <div>
              <p className="font-semibold text-red-700">Need help?</p>
              <p className="text-sm text-gray-600">Contact us on WhatsApp</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-yellow-200">
            <a
              href="https://wa.me/91800851140"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full text-sm hover:bg-green-700 transition"
            >
              <FaWhatsapp /> Chat with us
            </a>
          </div>
        </div>

        <button
          onClick={() => { setTracked(false); setOrder(null); setOrderId(''); setSearchParams({}); }}
          className="mt-6 text-red-600 hover:text-red-700 transition font-medium"
        >
          ← Track Another Order
        </button>
      </div>
    );
  }

  // Search form
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <h1 className="text-3xl font-bold text-red-700 text-center mb-2">Track Your Order</h1>
      <p className="text-center text-gray-500 mb-8">Enter your Order ID to track status</p>

      <div className="bg-white rounded-2xl shadow border border-gray-200 p-8">
        <form onSubmit={handleTrack} className="space-y-4">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter Order ID (e.g., ORD-12345678)"
              className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-xl text-sm">
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3.5 rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-pulse">Searching...</span>
            ) : (
              <>
                <FaSearch /> Track Order
              </>
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
          <p className="text-sm text-gray-600">
            <strong>Sample Order ID:</strong> Enter your order number from the confirmation
          </p>
          <p className="text-xs text-gray-500 mt-1">e.g., ORD-12345678</p>
        </div>
      </div>
    </div>
  );
}