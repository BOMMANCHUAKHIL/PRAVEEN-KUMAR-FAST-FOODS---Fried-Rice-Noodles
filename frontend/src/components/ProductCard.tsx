import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../data/products';
import { FaShoppingCart } from 'react-icons/fa';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, variant: string) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);

  const getImage = () => {
      if (product.image_url) return product.image_url;
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
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
      <div className="relative h-48 bg-yellow-50 flex items-center justify-center overflow-hidden">
        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
          {getImage()}
        </span>
        {product.tags && product.tags.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            {product.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="bg-white/90 text-xs font-medium px-2 py-1 rounded-full shadow">
                {tag}
              </span>
            ))}
          </div>
        )}
        {product.isFeatured && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-red-700 text-xs font-bold px-3 py-1 rounded-full shadow">
            ★ Featured
          </div>
        )}
      </div>

      <div className="p-5">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-bold text-red-700 hover:text-red-500 transition">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {product.variants.map((variant) => (
            <button
              key={variant.weight}
              onClick={() => setSelectedVariant(variant)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                selectedVariant.weight === variant.weight
                  ? 'bg-red-600 text-white'
                  : 'bg-yellow-50 text-gray-700 hover:bg-yellow-100'
              }`}
            >
              {variant.weight} ₹{variant.price}
            </button>
          ))}
        </div>

        <button
          onClick={() => onAddToCart?.(product, selectedVariant.weight)}
          className="mt-4 w-full bg-red-600 text-white py-2.5 rounded-full font-medium hover:bg-red-700 transition-all duration-300 hover:scale-[1.02] text-sm flex items-center justify-center gap-2"
        >
          <FaShoppingCart /> Add to Cart
        </button>
      </div>
    </div>
  );
}