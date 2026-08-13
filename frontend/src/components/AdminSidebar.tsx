import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaTags,
  FaTicketAlt,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaUtensils,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function AdminSidebar() {
  const location = useLocation();
  const { adminLogout } = useAuth();

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: FaHome },
    { to: '/admin/products', label: 'Products', icon: FaBox },
    { to: '/admin/orders', label: 'Orders', icon: FaShoppingCart },
    { to: '/admin/customers', label: 'Customers', icon: FaUsers },
    { to: '/admin/categories', label: 'Categories', icon: FaTags },
    { to: '/admin/coupons', label: 'Coupons', icon: FaTicketAlt },
    { to: '/admin/analytics', label: 'Analytics', icon: FaChartBar },
    { to: '/admin/settings', label: 'Settings', icon: FaCog },
  ];

  return (
    <div className="w-64 bg-gray-900 min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-50">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <FaUtensils className="text-yellow-400 text-2xl" />
          <h1 className="text-xl font-bold text-white">PK Fast Foods</h1>
        </div>
        <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isActive
                  ? 'bg-yellow-400 text-gray-900'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="text-lg" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={adminLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition"
        >
          <FaSignOutAlt className="text-lg" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}