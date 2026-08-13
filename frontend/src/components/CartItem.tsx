import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { CartItem as CartItemType } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, variant: string, quantity: number) => void;
  onRemove: (productId: string, variant: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
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
    return images[item.name] || '🍽️';
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-200 hover:shadow-md transition">
      <div className="w-16 h-16 bg-yellow-50 rounded-xl flex items-center justify-center flex-shrink-0">
        <span className="text-3xl">{getImage()}</span>
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-red-700 truncate">{item.name}</h4>
        <p className="text-sm text-gray-500">{item.variant}</p>
        <p className="text-red-600 font-bold">{formatPrice(item.price)}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.productId, item.variant, item.quantity - 1)}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition"
        >
          <FaMinus className="text-xs" />
        </button>
        <span className="w-6 text-center font-medium">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.productId, item.variant, item.quantity + 1)}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition"
        >
          <FaPlus className="text-xs" />
        </button>
      </div>

      <div className="text-right">
        <p className="font-bold text-red-700">{formatPrice(item.price * item.quantity)}</p>
        <button
          onClick={() => onRemove(item.productId, item.variant)}
          className="text-red-500 hover:text-red-700 transition text-sm flex items-center gap-1"
        >
          <FaTrash className="text-xs" /> Remove
        </button>
      </div>
    </div>
  );
}