import { Link } from 'react-router-dom';
import { FaWhatsapp, FaInstagram, FaFacebook, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-red-800 text-white/90">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">PRAVEEN KUMAR</h3>
            <p className="text-sm text-white/70">
              Delicious Fried Rice, Noodles & Chinese Starters.
              Made fresh with authentic flavors, delivered hot to your door.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-white/70 hover:text-white transition">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition">
                <FaFacebook className="text-xl" />
              </a>
              <a href="https://wa.me/918008511402" className="text-white/70 hover:text-white transition">
                <FaWhatsapp className="text-xl" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-yellow-300 transition">Menu</Link></li>
              <li><Link to="/about" className="hover:text-yellow-300 transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-yellow-300 transition">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-yellow-300 transition">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <FaPhone className="text-yellow-300" />
                <span>+91  80085 11402</span>
              </li>
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-yellow-300 mt-1" />
                <span>Beside Naveen Tailors Kamakshi Nagar, Vidavalur, Andhra Pradesh 524318</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Delivery Zone</h4>
            <p className="text-sm text-white/70 mb-2">🚚 Free delivery within 5km</p>
            <div className="bg-white/10 rounded-lg p-4 text-sm">
              <p className="font-medium">Payment Options:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="bg-white/20 px-2 py-1 rounded text-xs">UPI</span>
                <span className="bg-white/20 px-2 py-1 rounded text-xs">GPay</span>
                <span className="bg-white/20 px-2 py-1 rounded text-xs">PhonePe</span>
                <span className="bg-white/20 px-2 py-1 rounded text-xs">Cash on Delivery</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm text-white/60">
          <p>© {currentYear} PRAVEEN KUMAR FAST FOODS. All rights reserved.</p>
          <p className="mt-1 text-xs">Made with Love, Served with Care</p>
        </div>
      </div>
    </footer>
  );
}