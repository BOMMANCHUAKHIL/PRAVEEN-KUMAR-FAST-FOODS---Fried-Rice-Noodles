import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUtensils, FaHome, FaBox, FaShoppingCart, FaUsers, FaCog } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function AdminNavbar() {
  const navigate = useNavigate();
  const { adminLogout } = useAuth();

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  return (
    <nav className="bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/admin" className="flex items-center gap-2">
            <FaUtensils className="text-yellow-400 text-2xl" />
            <span className="text-xl font-bold text-white">PRAVEEN KUMAR</span>
            <span className="hidden sm:inline text-xs bg-yellow-400 text-gray-900 px-2 py-1 rounded-full font-bold">
              ADMIN
            </span>
          </Link>

          {/* Admin Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/admin" className="text-gray-300 hover:text-white transition flex items-center gap-1">
              <FaHome className="text-sm" /> Dashboard
            </Link>
            <Link to="/admin/products" className="text-gray-300 hover:text-white transition flex items-center gap-1">
              <FaBox className="text-sm" /> Products
            </Link>
            <Link to="/admin/orders" className="text-gray-300 hover:text-white transition flex items-center gap-1">
              <FaShoppingCart className="text-sm" /> Orders
            </Link>
            <Link to="/admin/customers" className="text-gray-300 hover:text-white transition flex items-center gap-1">
              <FaUsers className="text-sm" /> Customers
            </Link>
            <Link to="/admin/settings" className="text-gray-300 hover:text-white transition flex items-center gap-1">
              <FaCog className="text-sm" /> Settings
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition text-sm font-medium"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}