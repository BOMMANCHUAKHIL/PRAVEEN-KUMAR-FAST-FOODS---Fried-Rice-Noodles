import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSave, FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface Variant {
  weight: string;
  price: number;
  inStock: boolean;
}

export default function AdminAddProduct() {
  const navigate = useNavigate();
  const { adminToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'fried-rice',
    image_url: '',
    is_available: true,
    is_featured: false,
    tags: [] as string[],
    variants: [] as Variant[],
  });
  const [tagInput, setTagInput] = useState('');
  const [newVariant, setNewVariant] = useState<Variant>({
    weight: '',
    price: 0,
    inStock: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (formData.variants.length === 0) {
      toast.error('Please add at least one variant');
      return;
    }

    setLoading(true);
    try {
      const productData = {
        ...formData,
        variants: formData.variants.map(v => ({
          ...v,
          price: Number(v.price),
        })),
      };

      await api.post('/api/products', productData, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      toast.success('Product created successfully!');
      navigate('/admin/products');
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast.error(error.response?.data?.detail || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const addVariant = () => {
    if (!newVariant.weight || newVariant.price <= 0) {
      toast.error('Please enter valid weight and price');
      return;
    }
    setFormData({
      ...formData,
      variants: [...formData.variants, { ...newVariant }],
    });
    setNewVariant({ weight: '', price: 0, inStock: true });
  };

  const removeVariant = (index: number) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index),
    });
  };

  const addTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  return (
    <AdminLayout title="Add New Product">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow border border-gray-200 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
            >
              <option value="fried-rice">Fried Rice</option>
              <option value="noodles">Noodles</option>
              <option value="starters">Starters</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input
            type="text"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="Add tag (e.g., Bestseller)"
              className="flex-1 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
            />
            <button type="button" onClick={addTag} className="px-4 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition">
              <FaPlus />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map((tag) => (
              <span key={tag} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">
                  <FaTimes className="text-xs" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="font-semibold text-gray-700 mb-3">Variants *</h3>
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              value={newVariant.weight}
              onChange={(e) => setNewVariant({ ...newVariant, weight: e.target.value })}
              placeholder="Weight (e.g., 1 KG)"
              className="flex-1 min-w-[150px] border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
            />
            <input
              type="number"
              value={newVariant.price || ''}
              onChange={(e) => setNewVariant({ ...newVariant, price: Number(e.target.value) })}
              placeholder="Price (₹)"
              className="flex-1 min-w-[150px] border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
            />
            <button type="button" onClick={addVariant} className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition">
              Add Variant
            </button>
          </div>

          <div className="mt-3 space-y-2">
            {formData.variants.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No variants added yet</p>
            ) : (
              formData.variants.map((variant, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                  <span className="font-medium">{variant.weight}</span>
                  <span className="text-red-700 font-bold">₹{variant.price}</span>
                  <button type="button" onClick={() => removeVariant(index)} className="text-red-500 hover:text-red-700">
                    <FaTrash />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-6 border-t border-gray-200 pt-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_available}
              onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
              className="w-5 h-5 accent-red-600"
            />
            Available for sale
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="w-5 h-5 accent-red-600"
            />
            Featured product
          </label>
        </div>

        <div className="flex gap-4 border-t border-gray-200 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <FaSave /> {loading ? 'Saving...' : 'Save Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}