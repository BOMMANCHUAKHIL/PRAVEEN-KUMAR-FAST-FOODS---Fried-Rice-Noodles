import { Link } from 'react-router-dom';
import { FaWhatsapp, FaTruck, FaStar, FaUtensils } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 to-red-800 text-white py-16 md:py-24">
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
                  <FaStar className="text-yellow-400" /> 4.8 ★ (200+ Reviews)
                </span>
              </div>
            </div>
            <div className="relative">
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
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 bg-white border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            <div className="flex items-center gap-2 text-sm md:text-base">
              <span className="text-2xl">🔥</span>
              <span className="font-medium text-gray-700">Freshly Made</span>
            </div>
            <div className="flex items-center gap-2 text-sm md:text-base">
              <span className="text-2xl">🧼</span>
              <span className="font-medium text-gray-700">Hygienic Kitchen</span>
            </div>
            <div className="flex items-center gap-2 text-sm md:text-base">
              <span className="text-2xl">⏰</span>
              <span className="font-medium text-gray-700">Quick Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-sm md:text-base">
              <span className="text-2xl">❤️</span>
              <span className="font-medium text-gray-700">Made with Love</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-red-700 mb-4">
            Explore Our Menu
          </h2>
          <p className="text-center text-gray-600 mb-10">Delicious Chinese fast food made fresh</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link to="/products?category=fried-rice" className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition text-center border border-gray-200">
              <span className="text-5xl block mb-3">🍚</span>
              <h3 className="font-bold text-red-700">Fried Rice</h3>
              <p className="text-sm text-gray-500">Veg, Chicken, Egg</p>
            </Link>
            <Link to="/products?category=noodles" className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition text-center border border-gray-200">
              <span className="text-5xl block mb-3">🍜</span>
              <h3 className="font-bold text-red-700">Noodles</h3>
              <p className="text-sm text-gray-500">Hakka, Chowmein</p>
            </Link>
            <Link to="/products?category=starters" className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition text-center border border-gray-200">
              <span className="text-5xl block mb-3">🍗</span>
              <h3 className="font-bold text-red-700">Starters</h3>
              <p className="text-sm text-gray-500">Chilli Chicken, Paneer</p>
            </Link>
            <Link to="/products?category=beverages" className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition text-center border border-gray-200">
              <span className="text-5xl block mb-3">🥤</span>
              <h3 className="font-bold text-red-700">Beverages</h3>
              <p className="text-sm text-gray-500">Shakes & Sodas</p>
            </Link>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-16 bg-red-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Order on WhatsApp</h2>
          <p className="text-white/80 text-lg mb-6 max-w-2xl mx-auto">
            Craving delicious Chinese food? Order directly on WhatsApp for quick delivery!
          </p>
          <a
            href="https://wa.me/918008511402"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-green-700 transition-all duration-300 hover:scale-105"
          >
            <FaWhatsapp className="text-2xl" />
            Order Now on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}