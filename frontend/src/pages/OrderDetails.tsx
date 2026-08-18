import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaWhatsapp, FaClock, FaCheckCircle, FaTruck, FaUtensils, FaPhone, FaMapMarkerAlt, FaCreditCard } from 'react-icons/fa';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/helpers';
import toast from 'react-hot-toast';

interface OrderItem {
  name: string;
  variant: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  id?: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  items: OrderItem[];
  total_amount: number;
  status: 'placed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  payment_method: string;
  delivery_address?: {
    fullName: string;
    phone: string;
    addressLine: string;
    landmark: string;
    city: string;
    pincode: string;
  };
  created_at: string;
  updated_at: string;
}

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { customerToken, isAuthenticated } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('🔍 useParams id:', id);
    console.log('🔍 window.location.pathname:', window.location.pathname);

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!id) {
      setError('No order ID provided in URL');
      setLoading(false);
      return;
    }

    fetchOrder(id);
  }, [id, isAuthenticated]);

  const fetchOrder = async (orderId: string) => {
    try {
      setLoading(true);
      setError('');
      console.log('🔍 Fetching order with ID:', orderId);

      const response = await api.get(`/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${customerToken}` }
      });

      console.log('📦 Order response:', response.data);
      setOrder(response.data);
    } catch (err: any) {
      console.error('❌ Error fetching order:', err);
      if (err.response?.status === 404) {
        setError('Order not found');
      } else {
        setError(err.response?.data?.detail || 'Failed to load order details');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusSteps = (currentStatus: string) => {
    const steps = [
      { key: 'placed', label: 'Order Placed', icon: FaClock, description: 'Your order has been received' },
      { key: 'preparing', label: 'Preparing', icon: FaUtensils, description: 'Chef is preparing your food' },
      { key: 'out_for_delivery', label: 'Out for Delivery', icon: FaTruck, description: 'Food is on the way!' },
      { key: 'delivered', label: 'Delivered', icon: FaCheckCircle, description: 'Enjoy your meal! 🍜' },
    ];

    const currentIndex = steps.findIndex(s => s.key === currentStatus);
    if (currentIndex === -1) return steps.map(s => ({ ...s, isCompleted: false, isCurrent: false }));

    return steps.map((step, index) => ({
      ...step,
      isCompleted: index <= currentIndex,
      isCurrent: index === currentIndex,
    }));
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

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-64 bg-gray-200 rounded max-w-3xl mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-2xl">
        <div className="bg-red-50 p-8 rounded-2xl border border-red-200">
          <p className="text-4xl mb-4">😕</p>
          <p className="text-red-700 text-lg font-medium">{error}</p>
          <button
            onClick={() => navigate('/orders')}
            className="mt-4 bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition"
          >
            ← Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Order not found</p>
        <Link to="/orders" className="mt-4 inline-block text-red-600 hover:underline">
          ← Back to Orders
        </Link>
      </div>
    );
  }

  const steps = getStatusSteps(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition"
        >
          <FaArrowLeft /> Back
        </button>
      </div>

      {/* Order Header */}
      <div className="bg-white rounded-2xl shadow border border-gray-200 p-6 mb-6">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-red-700">Order #{order.order_number}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusLabel(order.status)}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Placed on {formatDate(order.created_at)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-red-700">{formatPrice(order.total_amount)}</p>
            <p className="text-sm text-gray-500">Total</p>
          </div>
        </div>
      </div>

      {/* Status Timeline */}
      {!isCancelled && (
        <div className="bg-white rounded-2xl shadow border border-gray-200 p-6 mb-6">
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
                    <p className="text-sm text-gray-500">{step.description}</p>
                    {step.isCurrent && (
                      <p className="text-sm text-red-600 animate-pulse mt-1">In progress...</p>
                    )}
                  </div>
                  {step.isCompleted && (
                    <span className="text-green-500 text-sm mt-2">✓</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="bg-red-50 rounded-2xl border border-red-200 p-6 mb-6">
          <p className="text-red-700 font-semibold">❌ This order has been cancelled</p>
        </div>
      )}

      {/* Order Items */}
      <div className="bg-white rounded-2xl shadow border border-gray-200 p-6 mb-6">
        <h3 className="font-semibold text-gray-700 mb-4">📦 Order Items</h3>
        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0">
              <div>
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">{item.variant} × {item.quantity}</p>
              </div>
              <p className="font-medium text-red-700">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-red-700">{formatPrice(order.total_amount)}</span>
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="bg-white rounded-2xl shadow border border-gray-200 p-6 mb-6">
        <h3 className="font-semibold text-gray-700 mb-4">📍 Delivery Address</h3>
        {order.delivery_address ? (
          <div className="space-y-1 text-sm">
            <p className="font-medium">{order.delivery_address.fullName}</p>
            <p className="text-gray-600">{order.delivery_address.addressLine}</p>
            {order.delivery_address.landmark && (
              <p className="text-gray-500">Landmark: {order.delivery_address.landmark}</p>
            )}
            <p className="text-gray-600">
              {order.delivery_address.city}, {order.delivery_address.pincode}
            </p>
            <p className="text-gray-600">📞 {order.delivery_address.phone}</p>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No delivery address available</p>
        )}
      </div>

      {/* Payment Information */}
      <div className="bg-white rounded-2xl shadow border border-gray-200 p-6 mb-6">
        <h3 className="font-semibold text-gray-700 mb-4">💳 Payment Information</h3>
        <div className="flex flex-wrap gap-6 text-sm">
          <div>
            <p className="text-gray-500">Method</p>
            <p className="font-medium capitalize">{order.payment_method?.replace('_', ' ') || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-500">Status</p>
            <p className="font-medium text-green-600">Completed</p>
          </div>
          <div>
            <p className="text-gray-500">Order ID</p>
            <p className="font-mono text-sm">{order.order_number}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        <a
          href={`https://wa.me/918008511402?text=Hi%2C%20I%20need%20help%20with%20my%20order%20${order.order_number}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
        >
          <FaWhatsapp /> Contact Support
        </a>
        {order.status === 'placed' && (
          <button
            onClick={async () => {
              try {
                await api.put(
                  `/api/orders/${order._id || order.id}/status`,
                  { status: 'cancelled' },
                  { headers: { Authorization: `Bearer ${customerToken}` } }
                );
                toast.success('Order cancelled');
                fetchOrder(order._id || order.id!);
              } catch (err) {
                toast.error('Failed to cancel order');
              }
            }}
            className="flex-1 bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition"
          >
            ❌ Cancel Order
          </button>
        )}
        <button
          onClick={() => window.print()}
          className="px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition"
        >
          🖨️ Print
        </button>
      </div>
    </div>
  );
}