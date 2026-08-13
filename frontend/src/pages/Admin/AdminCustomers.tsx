import { useState, useEffect } from 'react';
import { FaSearch, FaUser, FaCoins, FaShoppingBag, FaMoneyBillWave } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
import { adminService, Customer } from '../../services/admin';
import { formatPrice } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await adminService.getCustomers();
      setCustomers(response.data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout title="Customers">
        <div className="animate-pulse">Loading customers...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Customers">
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px] relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..."
            className="w-full pl-12 pr-4 py-2.5 border border-[#e2d3c0] rounded-xl focus:ring-2 focus:ring-deep-maroon focus:border-transparent outline-none transition"
          />
        </div>
        <div className="bg-white px-4 py-2.5 rounded-xl border border-[#e2d3c0] flex items-center gap-2">
          <span className="text-sm text-gray-500">Total:</span>
          <span className="font-bold text-deep-maroon">{customers.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-12">No customers found</div>
        ) : (
          filteredCustomers.map((customer) => (
            <div key={customer.id} className="bg-white rounded-2xl shadow-sm border border-[#e2d3c0] p-6 hover:shadow-md transition">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-deep-maroon/10 rounded-full flex items-center justify-center text-2xl text-deep-maroon">
                  {customer.name ? customer.name[0].toUpperCase() : <FaUser />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-deep-maroon truncate">{customer.name || 'Customer'}</p>
                  <p className="text-sm text-gray-500">{customer.phone}</p>
                  {customer.email && <p className="text-xs text-gray-400 truncate">{customer.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#e2d3c0]">
                <div className="text-center">
                  <FaCoins className="text-amber-500 mx-auto" />
                  <p className="text-sm font-bold text-deep-maroon">{customer.loyaltyPoints}</p>
                  <p className="text-xs text-gray-500">Points</p>
                </div>
                <div className="text-center">
                  <FaShoppingBag className="text-blue-500 mx-auto" />
                  <p className="text-sm font-bold text-deep-maroon">{customer.totalOrders || 0}</p>
                  <p className="text-xs text-gray-500">Orders</p>
                </div>
                <div className="text-center">
                  <FaMoneyBillWave className="text-green-500 mx-auto" />
                  <p className="text-sm font-bold text-deep-maroon">{formatPrice(customer.totalSpent || 0)}</p>
                  <p className="text-xs text-gray-500">Spent</p>
                </div>
              </div>

              <div className="mt-3 text-xs text-gray-400">
                Member since {new Date(customer.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}