import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaArrowRight } from 'react-icons/fa';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/helpers';
import toast from 'react-hot-toast';

interface Order {
  _id: string;
  id?: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  items: any[];
  total_amount: number;
  status: 'placed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  payment_method: string;
  created_at: string;
}

export default function Orders() {
  const { customerToken, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/orders', {
        headers: { Authorization: `Bearer ${customerToken}` }
      });
      console.log('📦 Orders:', response.data);
      setOrders(response.data || []);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getOrderId = (order: Order): string => {
    return order?._id || order?.id || '';
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

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(o => o.status === filter);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <span className="text-6xl block mb-4">🔒</span>
        <h2 className="text-2xl font-bold text-red-700">Please Login</h2>
        <p className="text-gray-500 mt-2">Login to view your orders</p>
        <Link to="/login" className="inline-block mt-6 bg-red-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-700 transition">
          Login Now
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">Loading your orders...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <span className="text-6xl block mb-4">📦</span>
        <h2 className="text-2xl font-bold text-red-700">No Orders Yet</h2>
        <p className="text-gray-500 mt-2">Place your first order today!</p>
        <Link to="/products" className="inline-block mt-6 bg-red-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-700 transition">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-red-700">My Orders</h1>
        <span className="text-sm text-gray-500">{orders.length} orders</span>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'placed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
              filter === status
                ? 'bg-red-600 text-white'
                : 'bg-white border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {status === 'all' ? 'All' : status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const orderId = getOrderId(order);
          return (
            <Link
              key={orderId || order.order_number}
              to={`/order/${orderId}`}
              className="block bg-white rounded-2xl shadow border border-gray-200 p-6 hover:shadow-lg transition"
            >
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="font-mono font-bold text-red-700">#{order.order_number}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status?.replace('_', ' ') || 'Placed'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{order.items?.length || 0} items</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }) : 'N/A'}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold text-red-700">{formatPrice(order.total_amount || 0)}</p>
                  <div className="flex items-center gap-1 text-sm text-red-600 mt-1">
                    <span>View Details</span>
                    <FaArrowRight className="text-xs" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <button
        onClick={fetchOrders}
        className="mt-6 text-sm text-gray-500 hover:text-red-600 transition"
      >
        🔄 Refresh Orders
      </button>
    </div>
  );
}