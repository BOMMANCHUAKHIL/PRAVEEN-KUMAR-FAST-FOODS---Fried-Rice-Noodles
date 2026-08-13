import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaShoppingCart, FaUsers, FaMoneyBillWave, FaEye } from 'react-icons/fa';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/helpers';
import AdminLayout from '../../components/AdminLayout';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  pendingOrders: number;
  recentOrders: any[];
}

export default function AdminDashboard() {
  const { adminToken } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch products
      const productsRes = await api.get('/api/products');
      const products = productsRes.data || [];

      // Fetch orders
      const ordersRes = await api.get('/api/orders/all', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const orders = ordersRes.data || [];

      // Calculate stats
      const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0);
      const pendingOrders = orders.filter((o: any) => o.status === 'placed' || o.status === 'preparing');

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalCustomers: 0,
        totalRevenue: totalRevenue,
        pendingOrders: pendingOrders.length,
        recentOrders: orders.slice(0, 5),
      });
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.detail || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Products', value: stats.totalProducts, icon: FaBox, color: 'bg-red-600' },
    { label: 'Orders', value: stats.totalOrders, icon: FaShoppingCart, color: 'bg-yellow-500' },
    { label: 'Customers', value: stats.totalCustomers, icon: FaUsers, color: 'bg-blue-500' },
    { label: 'Revenue', value: formatPrice(stats.totalRevenue), icon: FaMoneyBillWave, color: 'bg-green-500' },
  ];

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow border border-gray-200 animate-pulse h-32" />
          ))}
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Dashboard">
        <div className="bg-red-50 p-6 rounded-2xl border border-red-200 text-red-700">
          <p>❌ {error}</p>
          <button onClick={fetchDashboardData} className="mt-4 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition">
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="flex justify-between items-center mb-8">
        <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleTimeString()}</span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
  const Icon = stat.icon;
  return (
    <div key={stat.label || index} className="bg-white p-6 rounded-2xl shadow border border-gray-200 hover:shadow-lg transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-red-700">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.color} text-white`}>
                  <Icon className="text-xl" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pending Orders Alert */}
      {stats.pendingOrders > 0 && (
        <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-200 mb-8">
          <p className="text-yellow-800">
            ⚠️ <strong>{stats.pendingOrders}</strong> order{stats.pendingOrders > 1 ? 's' : ''} pending review
          </p>
        </div>
      )}

      {/* Recent Orders & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Recent Orders</h3>
            <Link to="/admin/orders" className="text-sm text-red-600 hover:underline flex items-center gap-1">
              View All <FaEye className="text-xs" />
            </Link>
          </div>
          {stats.recentOrders.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {stats.recentOrders.map((order: any) => (
                <div key={order.id} className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <div>
                    <p className="font-mono text-xs text-gray-500">{order.order_number || order.id}</p>
                    <p className="text-sm font-medium">{order.items?.length || 0} items</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-700">{formatPrice(order.total_amount || 0)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      order.status === 'preparing' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status || 'placed'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow border border-gray-200 p-6">
          <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Link to="/admin/products" className="block w-full text-center bg-yellow-400 text-red-700 py-2.5 rounded-xl font-semibold hover:bg-yellow-300 transition">
              ➕ Add Product
            </Link>
            <Link to="/admin/orders" className="block w-full text-center bg-red-600 text-white py-2.5 rounded-xl font-semibold hover:bg-red-700 transition">
              📋 View All Orders
            </Link>
            <Link to="/admin/customers" className="block w-full text-center bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition">
              👥 Manage Customers
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}