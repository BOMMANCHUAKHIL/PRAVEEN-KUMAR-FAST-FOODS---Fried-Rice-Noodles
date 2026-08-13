import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaWhatsapp, FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { products, Product } from '../data/products';
import QuantitySelector from '../components/QuantitySelector';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const found = products.find((p) => p.id === id);
    if (found) {
      setProduct(found);
      setSelectedVariant(found.variants[0].weight);
      setQuantity(1);
    }
  }, [id]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-red-700">Product not found</h2>
        <Link to="/products" className="mt-4 inline-block bg-red-600 text-white px-6 py-2 rounded-full">
          Back to Menu
        </Link>
      </div>
    );
  }

  const selectedPrice = product.variants.find((v) => v.weight === selectedVariant)?.price || 0;

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      variant: selectedVariant,
      price: selectedPrice,
      quantity,
      image: product.image,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleWhatsAppOrder = () => {
    const message = `Hi! I'd like to order:\n\n${product.name} - ${selectedVariant} x${quantity}\nPrice: ${formatPrice(selectedPrice * quantity)}\n\nPlease confirm my order.`;
    window.open(`https://wa.me/91800851140?text=${encodeURIComponent(message)}`, '_blank');
  };

  const getImage = () => {
    const images: Record<string, string> = {
      'Veg Fried Rice': '🍚',
      'Gobbi Fried Rice': '🥦',
      'Chicken Fried Rice': '🍗',
      'Egg Fried Rice': '🥚',
      'Flashman Fried Rice': '🍚',
      'Mixed Fried Rice': '🍚',
      'Veg Noodles': '🍜',
      'Gobbi Noodles': '🍜',
      'Chicken Noodles': '🍜',
      'Egg Noodles': '🍜',
      'Leg Piece': '🍗',
      'Chicken Wings': '🍗',
      'Gobbi Manchuriya': '🥦',
      'Chicken Manchuriya': '🍗',
      'Chilli Chicken': '🍗',
    };
    return images[product.name] || '🍽️';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition mb-6">
        <FaArrowLeft /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="bg-yellow-50 rounded-3xl p-8 flex items-center justify-center min-h-[300px] md:min-h-[400px] border border-gray-200">
          <span className="text-8xl">{getImage()}</span>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm bg-yellow-100 text-red-700 px-3 py-1 rounded-full">
                {product.category === 'fried-rice' ? '🍚 Fried Rice' :
                 product.category === 'noodles' ? '🍜 Noodles' : '🍗 Starter'}
              </span>
              {product.isFeatured && (
                <span className="text-sm bg-red-600 text-white px-3 py-1 rounded-full">⭐ Featured</span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-red-700 mt-3">{product.name}</h1>
            <p className="text-gray-600 mt-2 text-lg">{product.description}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Select Size</h3>
            <div className="flex flex-wrap gap-3">
              {product.variants.map((variant) => (
                <button
                  key={variant.weight}
                  onClick={() => setSelectedVariant(variant.weight)}
                  className={`px-5 py-3 rounded-2xl border-2 transition ${
                    selectedVariant === variant.weight
                      ? 'border-red-600 bg-red-50 text-red-700 font-semibold'
                      : 'border-gray-300 hover:border-red-400'
                  }`}
                >
                  <div className="text-sm">{variant.weight}</div>
                  <div className="font-bold text-red-700">{formatPrice(variant.price)}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-3xl font-bold text-red-700">{formatPrice(selectedPrice * quantity)}</div>
            <div className="text-sm text-gray-500">{formatPrice(selectedPrice)} × {quantity}</div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Quantity</h3>
            <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-red-600 text-white px-6 py-3.5 rounded-full font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
            >
              <FaShoppingCart /> Add to Cart
            </button>
            <button
              onClick={handleWhatsAppOrder}
              className="flex-1 bg-green-600 text-white px-6 py-3.5 rounded-full font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
            >
              <FaWhatsapp /> Order on WhatsApp
            </button>
          </div>

          <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-200 flex items-center gap-3">
            <span className="text-2xl">🎥</span>
            <div>
              <p className="font-semibold text-red-700">Live Video Available</p>
              <p className="text-sm text-gray-600">Request a live video of your order being made</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}