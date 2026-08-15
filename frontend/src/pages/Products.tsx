import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import axios from 'axios';

export default function Products() {
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryFilter = searchParams.get('category') || '';
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // ✅ FETCH PRODUCTS FROM BACKEND
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_BASE || 'https://praveen-kumar-fast-foods-fried-rice-noodles-production.up.railway.app';
        const response = await axios.get(`${API_URL}/api/products`);

        setProducts(response.data);

        // Auto-generate categories from data
        const uniqueCategories = Array.from(
          new Set(response.data.map((p: any) => p.category))
        ).map((cat) => ({ id: cat, name: cat, icon: '🍜' }));
        setCategories(uniqueCategories);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ✅ ADD THIS MISSING FUNCTION
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
    setIsFilterOpen(false);
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                          (product.description && product.description.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: any, variant: string) => {
    const price = product.variants.find((v: any) => v.weight === variant)?.price || 0;
    addToCart({
      productId: product.id,
      name: product.name,
      variant,
      price,
      quantity: 1,
      image: product.image || product.image_url,
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4 animate-spin">🍜</div>
        <h2 className="text-xl text-gray-600">Loading our delicious menu...</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-red-700 mb-2">Our Menu</h1>
      <p className="text-center text-gray-500 mb-8">Delicious Chinese fast food made fresh</p>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for fried rice, noodles..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <FaTimes />
            </button>
          )}
        </div>
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`px-6 py-3 rounded-2xl border transition flex items-center gap-2 ${
            selectedCategory ? 'bg-red-600 text-white border-red-600' : 'bg-white border-gray-300 hover:bg-gray-50'
          }`}
        >
          <FaFilter /> Filter {selectedCategory && <span className="bg-white/20 rounded-full px-2 text-xs">1</span>}
        </button>
      </div>

      {/* Category Filters */}
      {isFilterOpen && (
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-lg mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange('')}
              className={`px-4 py-2 rounded-full text-sm transition ${
                !selectedCategory ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-2 rounded-full text-sm transition flex items-center gap-2 ${
                  selectedCategory === cat.id ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{cat.icon}</span> {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-4">Showing {filteredProducts.length} items</p>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <span className="text-6xl block mb-4">🔍</span>
          <h3 className="text-xl font-semibold text-gray-700">No items found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search or filter</p>
          <button onClick={() => { setSearch(''); setSelectedCategory(''); }} className="mt-4 bg-red-600 text-white px-6 py-2 rounded-full">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      )}
    </div>
  );
}