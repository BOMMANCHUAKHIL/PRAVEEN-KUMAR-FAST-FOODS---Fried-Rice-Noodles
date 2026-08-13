import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSignOutAlt, FaUtensils } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { isAdmin, adminLogout, customerLogout, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (isAdmin) adminLogout();
    if (isAuthenticated) customerLogout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Menu' },
    { to: '/track-order', label: 'Track Order' },
    { to: '/orders', label: 'My Orders' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-gradient-to-r from-red-600 to-red-700 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <FaUtensils className="text-yellow-400 text-2xl" />
            <span className="text-xl md:text-2xl font-bold text-white">PRAVEEN KUMAR</span>
            <span className="hidden sm:inline text-xs bg-yellow-400 text-red-700 px-2 py-1 rounded-full font-bold">
              FAST FOODS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-white hover:text-yellow-300 font-medium transition"
              >
                {link.label}
              </Link>
            ))}

            {isAdmin && (
              <Link to="/admin" className="text-yellow-300 font-semibold hover:text-yellow-400 transition">
                Dashboard
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative">
              <FaShoppingCart className="text-2xl text-white hover:text-yellow-300 transition" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-700 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated || isAdmin ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-white">
                  👋 {user?.name || user?.phone || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-yellow-400 text-red-700 px-4 py-2 rounded-full hover:bg-yellow-300 transition text-sm font-bold"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-yellow-400 text-red-700 px-4 py-2 rounded-full hover:bg-yellow-300 transition font-bold"
                >
                  <FaUser /> Login
                </Link>
                <Link
                  to="/admin/login"
                  className="text-white/70 hover:text-white text-sm font-medium transition"
                >
                  Admin
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white text-2xl"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block text-white hover:text-yellow-300 font-medium transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {isAdmin && (
              <Link
                to="/admin"
                className="block text-yellow-300 font-semibold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}

            <Link
              to="/cart"
              className="block text-white hover:text-yellow-300 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Cart {getTotalItems > 0 && `(${totalItems})`}
              const totalItems = getTotalItems();
            </Link>

            {isAuthenticated || isAdmin ? (
              <>
                <span className="block text-sm text-white">
                  👋 {user?.name || user?.phone || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-yellow-300 font-medium hover:text-yellow-400"
                >
                  <FaSignOutAlt className="inline mr-2" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block bg-yellow-400 text-red-700 px-4 py-2 rounded-full text-center font-bold hover:bg-yellow-300 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaUser className="inline mr-2" /> Login
                </Link>
                <Link
                  to="/admin/login"
                  className="block text-white/70 hover:text-white text-sm font-medium transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}