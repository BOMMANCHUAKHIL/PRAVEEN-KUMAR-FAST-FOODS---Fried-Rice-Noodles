import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import {
  FaShoppingCart,
  FaArrowLeft,
} from 'react-icons/fa';
import type {
  Product,
  ProductVariant,
} from '../components/ProductCard';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();

  const { addToCart } = useCart();

  const [product, setProduct] =
    useState<Product | null>(null);

  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariant | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('Product not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const response = await api.get(
          `/api/products/${id}`
        );

        const productData = response.data as Product;

        const variants =
          Array.isArray(productData.variants)
            ? productData.variants
            : [];

        const normalizedProduct: Product = {
          ...productData,
          variants,
        };

        setProduct(normalizedProduct);

        if (variants.length > 0) {
          setSelectedVariant(variants[0]);
        } else {
          setSelectedVariant(null);
        }
      } catch (err) {
        console.error(
          'Failed to fetch product:',
          err
        );

        setProduct(null);
        setSelectedVariant(null);
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) {
      return;
    }

    addToCart({
      productId: product.id,
      name: product.name,
      variant: selectedVariant.weight,
      price: selectedVariant.price,
      quantity: 1,
      image:
        product.image_url ||
        product.image ||
        '',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4" />
          <div className="h-4 bg-gray-200 rounded w-48 mx-auto" />
        </div>

        <p className="text-gray-600 mt-6">
          Loading product details...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl text-red-600 mb-4">
          {error || 'Product not found'}
        </h2>

        <Link
          to="/products"
          className="text-red-600 underline"
        >
          Go back to menu
        </Link>
      </div>
    );
  }

  const image =
    product.image_url || product.image;

  const fallbackImages: Record<string, string> = {
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

  const fallbackEmoji =
    fallbackImages[product.name] || '🍽️';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back */}
      <Link
        to="/products"
        className="inline-flex items-center text-red-600 mb-6 hover:underline"
      >
        <FaArrowLeft className="mr-2" />
        Back to Menu
      </Link>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Image */}
          <div className="md:w-1/2 bg-yellow-50 p-8 flex items-center justify-center min-h-[300px]">
            {image ? (
              <img
                src={image}
                alt={product.name}
                className="max-h-[400px] w-full object-contain rounded-xl"
                onError={(event) => {
                  event.currentTarget.style.display =
                    'none';

                  const fallback =
                    event.currentTarget
                      .nextElementSibling as HTMLElement | null;

                  if (fallback) {
                    fallback.style.display = 'flex';
                  }
                }}
              />
            ) : null}

            <span
              className={`text-8xl ${
                image ? 'hidden' : 'flex'
              } items-center justify-center`}
            >
              {fallbackEmoji}
            </span>
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 p-8">
            <h1 className="text-3xl font-bold text-red-700 mb-2">
              {product.name}
            </h1>

            <p className="text-gray-600 mb-4">
              {product.description ||
                'Delicious and freshly prepared.'}
            </p>

            {/* Category */}
            {product.category && (
              <div className="mb-4">
                <span className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                  {product.category}
                </span>
              </div>
            )}

            {/* Variants */}
            {product.variants &&
              product.variants.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Select Size:
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {product.variants.map(
                      (
                        variant: ProductVariant
                      ) => (
                        <button
                          key={`${variant.weight}-${variant.price}`}
                          type="button"
                          onClick={() =>
                            setSelectedVariant(
                              variant
                            )
                          }
                          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                            selectedVariant?.weight ===
                              variant.weight &&
                            selectedVariant?.price ===
                              variant.price
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {variant.weight} - ₹
                          {variant.price}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Tags */}
            {product.tags &&
              product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.tags.map(
                    (tag: string) => (
                      <span
                        key={tag}
                        className="bg-yellow-50 text-yellow-800 text-xs px-2 py-1 rounded-full border border-yellow-200"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              )}

            {/* Add To Cart */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!selectedVariant}
              className={`w-full py-3 rounded-full font-bold transition flex items-center justify-center gap-2 ${
                selectedVariant
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <FaShoppingCart />

              {selectedVariant
                ? `Add to Cart - ₹${selectedVariant.price}`
                : 'Unavailable'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}