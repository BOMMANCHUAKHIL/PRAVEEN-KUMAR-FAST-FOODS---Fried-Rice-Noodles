import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import CartSummary from '../components/CartSummary';

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, clearCart, getTotalItems, getTotalPrice } = useCart();

  const subtotal = getTotalPrice();
  const itemCount = getTotalItems();
  const total = subtotal;

  if (itemCount === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <span className="text-6xl block mb-4">🛒</span>
        <h2 className="text-2xl font-bold text-red-700">Your cart is empty</h2>
        <p className="text-gray-500 mt-2">Looks like you haven't added anything yet</p>
        <Link to="/products" className="inline-block mt-6 bg-red-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-700 transition">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-red-700">Your Cart</h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 transition">
          Clear All
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mt-6">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItem
              key={`${item.productId}-${item.variant}`}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          ))}
          <Link to="/products" className="inline-block text-red-600 hover:text-red-700 transition font-medium">
            ← Continue Shopping
          </Link>
        </div>
        <div>
          <CartSummary
            subtotal={subtotal}
            deliveryFee={0}
            total={total}
            itemCount={itemCount}
            onCheckout={() => navigate('/checkout')}
          />
        </div>
      </div>
    </div>
  );
}