import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/helpers';
import toast from 'react-hot-toast';

interface Order {
  _id?: string;
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

export default function AdminOrders() {
  const { adminToken } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/orders/all', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log('📦 Orders loaded:', response.data);
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getOrderId = (order: Order): string => {
    // ✅ Handle both 'id' and '_id' fields
    return order?.id || order?._id || '';
  };

  const updateStatus = async (order: Order, newStatus: string) => {
    const orderId = getOrderId(order);

    if (!orderId) {
      console.error('❌ No order ID found:', order);
      toast.error('Order ID is missing');
      return;
    }

    try {
      console.log(`🔍 Updating order ${orderId} to status: ${newStatus}`);

      const response = await api.put(
        `/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      console.log('✅ Update response:', response.data);
      toast.success(`✅ Order status updated to: ${newStatus.replace('_', ' ').toUpperCase()}`);
      fetchOrders();
    } catch (error: any) {
      console.error('❌ Error updating status:', error);
      toast.error(error.response?.data?.detail || 'Failed to update status');
    }
  };

  const getStatusInfo = (status: string) => {
    const info: Record<string, { label: string; color: string; bg: string }> = {
      placed: { label: '📋 Placed', color: 'text-blue-700', bg: 'bg-blue-100' },
      preparing: { label: '🔪 Preparing', color: 'text-yellow-700', bg: 'bg-yellow-100' },
      out_for_delivery: { label: '🚚 Out for Delivery', color: 'text-purple-700', bg: 'bg-purple-100' },
      delivered: { label: '✅ Delivered', color: 'text-green-700', bg: 'bg-green-100' },
      cancelled: { label: '❌ Cancelled', color: 'text-red-700', bg: 'bg-red-100' },
    };
    return info[status] || { label: status, color: 'text-gray-700', bg: 'bg-gray-100' };
  };

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(o => o.status === filter);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-pulse">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-red-700">📋 Manage Orders</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{orders.length} total orders</span>
          <button
            onClick={fetchOrders}
            className="text-sm text-gray-500 hover:text-red-600 transition"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 flex-wrap">
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
            {status === 'all' ? '📋 All' : status.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <p className="text-4xl mb-4">📭</p>
            <p className="text-gray-400">No orders found</p>
          </div>
        ) : (
          filteredOrders.map((order, index) => {
            const statusInfo = getStatusInfo(order.status);
            const orderId = getOrderId(order);

            return (
              <div key={orderId || index} className="bg-white rounded-2xl shadow border border-gray-200 p-6 hover:shadow-lg transition">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="font-mono font-bold text-red-700">#{order.order_number}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      👤 {order.customer_name || 'Customer'} • 📞 {order.customer_phone || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500">
                      🍽️ {order.items?.length || 0} items
                    </p>
                    <p className="text-xs text-gray-400">
                      📅 {order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A'}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-red-700">{formatPrice(order.total_amount || 0)}</p>
                    <p className="text-xs text-gray-500">💳 {order.payment_method || 'N/A'}</p>
                  </div>
                </div>

                {/* Status Update Buttons */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-600 mb-2">Update Status:</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        console.log('🔄 Start Preparing for order:', orderId);
                        updateStatus(order, 'preparing');
                      }}
                      disabled={order.status === 'preparing' || order.status === 'out_for_delivery' || order.status === 'delivered'}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                        order.status === 'preparing' || order.status === 'out_for_delivery' || order.status === 'delivered'
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-yellow-500 text-white hover:bg-yellow-600'
                      }`}
                    >
                      🔪 Start Preparing
                    </button>
                    <button
                      onClick={() => {
                        console.log('🚚 Out for Delivery for order:', orderId);
                        updateStatus(order, 'out_for_delivery');
                      }}
                      disabled={order.status !== 'preparing'}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                        order.status !== 'preparing'
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-purple-500 text-white hover:bg-purple-600'
                      }`}
                    >
                      🚚 Out for Delivery
                    </button>
                    <button
                      onClick={() => {
                        console.log('✅ Mark Delivered for order:', orderId);
                        updateStatus(order, 'delivered');
                      }}
                      disabled={order.status === 'delivered' || order.status === 'cancelled'}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                        order.status === 'delivered' || order.status === 'cancelled'
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      ✅ Mark Delivered
                    </button>
                    <button
                      onClick={() => {
                        console.log('❌ Cancel Order for order:', orderId);
                        updateStatus(order, 'cancelled');
                      }}
                      disabled={order.status === 'delivered'}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                        order.status === 'delivered'
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-red-500 text-white hover:bg-red-600'
                      }`}
                    >
                      ❌ Cancel Order
                    </button>
                  </div>
                </div>

                {/* Items List */}
                <details className="mt-4">
                  <summary className="text-sm text-gray-500 cursor-pointer hover:text-red-600">
                    📦 View Items ({order.items?.length || 0})
                  </summary>
                  <div className="mt-2 space-y-1">
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-sm border-b border-gray-100 py-1">
                        <span>{item.name} × {item.quantity}</span>
                        <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}