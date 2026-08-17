import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { FaShoppingCart, FaArrowLeft } from 'react-icons/fa';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/products/${id}`);
        setProduct(response.data);
        if (response.data.variants && response.data.variants.length > 0) {
          setSelectedVariant(response.data.variants[0]);
        }
        setError('');
      } catch (err) {
        setError('Product not found');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    addToCart({
      productId: product.id,
      name: product.name,
      variant: selectedVariant.weight,
      price: selectedVariant.price,
      quantity: 1,
      image: product.image,
    });
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-16 text-center text-xl">Loading product details...</div>;
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl text-red-600 mb-4">{error || 'Product not found'}</h2>
        <Link to="/products" className="text-red-600 underline">Go back to menu</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/products" className="inline-flex items-center text-red-600 mb-6 hover:underline">
        <FaArrowLeft className="mr-2" /> Back to Menu
      </Link>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 bg-yellow-50 p-8 flex items-center justify-center min-h-[300px]">
            <span className="text-8xl">
              {product.image || '🍽️'}
            </span>
          </div>
          <div className="md:w-1/2 p-8">
            <h1 className="text-3xl font-bold text-red-700 mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">Select Size:</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant: any) => (
                  <button
                    key={variant.weight}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      selectedVariant?.weight === variant.weight
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {variant.weight} - ₹{variant.price}
                  </button>
                ))}
              </div>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags.map((tag: string) => (
                  <span key={tag} className="bg-yellow-50 text-yellow-800 text-xs px-2 py-1 rounded-full border border-yellow-200">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={handleAddToCart}
              className="w-full bg-red-600 text-white py-3 rounded-full font-bold hover:bg-red-700 transition flex items-center justify-center gap-2"
            >
              <FaShoppingCart /> Add to Cart - ₹{selectedVariant?.price || 0}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}