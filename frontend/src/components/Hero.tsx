import { Link } from 'react-router-dom';
import { FaWhatsapp, FaTruck } from 'react-icons/fa';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-block bg-yellow-400 text-red-700 px-4 py-2 rounded-full text-sm font-bold">
              🍜 Fast Food · Hot & Fresh
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-yellow-400">PRAVEEN KUMAR</span>
              <br />
              <span>FAST FOODS</span>
            </h1>
            <p className="text-lg text-white/90 max-w-lg">
              Delicious Fried Rice, Noodles & Chinese Starters.
              Freshly prepared with authentic flavors, delivered hot to your door.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="bg-yellow-400 text-red-700 px-8 py-3.5 rounded-full font-bold shadow-lg hover:bg-yellow-300 transition-all duration-300 hover:scale-105"
              >
                🍜 View Full Menu
              </Link>
              <a
                href="https://wa.me/918008511402"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-8 py-3.5 rounded-full font-bold shadow-lg hover:bg-green-700 transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
              >
                <FaWhatsapp /> Order on WhatsApp
              </a>
            </div>
            <div className="flex flex-wrap gap-4 pt-4">
              <span className="flex items-center gap-2 text-sm bg-white/20 px-4 py-2 rounded-full">
                <FaTruck /> Free Delivery
              </span>
              <span className="flex items-center gap-2 text-sm bg-white/20 px-4 py-2 rounded-full">
                ⭐ 4.8 ★ (200+ Reviews)
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 bg-white/10 rounded-3xl p-6 backdrop-blur-sm">
            <div className="bg-white/20 p-6 rounded-2xl text-center">
              <span className="text-5xl block mb-2">🍚</span>
              <p className="font-bold text-yellow-400">Fried Rice</p>
              <p className="text-sm text-white/80">Veg, Chicken, Egg</p>
            </div>
            <div className="bg-white/20 p-6 rounded-2xl text-center">
              <span className="text-5xl block mb-2">🍜</span>
              <p className="font-bold text-yellow-400">Noodles</p>
              <p className="text-sm text-white/80">Hakka, Chowmein</p>
            </div>
            <div className="bg-white/20 p-6 rounded-2xl text-center">
              <span className="text-5xl block mb-2">🍗</span>
              <p className="font-bold text-yellow-400">Starters</p>
              <p className="text-sm text-white/80">Chilli Chicken</p>
            </div>
            <div className="bg-white/20 p-6 rounded-2xl text-center">
              <span className="text-5xl block mb-2">🥤</span>
              <p className="font-bold text-yellow-400">Beverages</p>
              <p className="text-sm text-white/80">Shakes & Sodas</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}