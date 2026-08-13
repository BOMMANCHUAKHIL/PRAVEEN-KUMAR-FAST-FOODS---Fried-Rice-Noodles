import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/helpers';
import AdminLayout from '../../components/AdminLayout';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  _id?: string;
  name: string;
  description: string;
  category: string;
  image?: string;
  variants: Array<{
    weight: string;
    price: number;
    inStock?: boolean;
  }>;
  isAvailable: boolean;
  isFeatured: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminProducts() {
  const { adminToken } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/products');
      console.log('📦 Products from API:', response.data);
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      // Fallback to empty array
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await api.delete(`/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      toast.success('Product deleted successfully!');
      fetchProducts(); // Refresh the list
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error(error.response?.data?.detail || 'Failed to delete product');
    }
  };

  const getProductId = (product: Product): string => {
    return product.id || product._id || '';
  };

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout title="Products">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Manage Products">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex-1 min-w-[200px] relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
          />
        </div>
        <Link
          to="/admin/products/add"
          className="bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm hover:bg-red-700 transition flex items-center gap-2 whitespace-nowrap"
        >
          <FaPlus /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 text-left">Product</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    {products.length === 0 ? 'No products found. Add your first product!' : 'No products match your search'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const productId = getProductId(product);
                  const categoryIcon =
                    product.category === 'fried-rice' ? '🍚' :
                    product.category === 'noodles' ? '🍜' :
                    product.category === 'starters' ? '🍗' : '🥤';

                  return (
                    <tr key={productId || product.name} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{categoryIcon}</span>
                          <div>
                            <p className="font-medium text-red-700">{product.name}</p>
                            <p className="text-xs text-gray-500 truncate max-w-xs">
                              {product.description?.slice(0, 60)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 capitalize">
                        {product.category?.replace('-', ' ') || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        {product.variants?.map((v, idx) => (
                          <span key={idx} className="block text-xs">
                            {v.weight}: {formatPrice(v.price)}
                          </span>
                        ))}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.isAvailable !== false
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {product.isAvailable !== false ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/admin/products/edit/${productId}`}
                            className="p-2 rounded-lg hover:bg-blue-50 transition"
                            title="Edit Product"
                          >
                            <FaEdit className="text-blue-600" />
                          </Link>
                          <button
                            onClick={() => handleDelete(productId)}
                            className="p-2 rounded-lg hover:bg-red-50 transition"
                            title="Delete Product"
                          >
                            <FaTrash className="text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Showing {filteredProducts.length} of {products.length} products
      </div>
    </AdminLayout>
  );
}