import { FaPlus, FaMinus } from 'react-icons/fa';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
}

export default function QuantitySelector({
  quantity,
  onQuantityChange,
  min = 1,
  max = 10,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onQuantityChange(quantity - 1)}
        disabled={quantity <= min}
        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <FaMinus className="text-sm" />
      </button>
      <span className="w-8 text-center font-semibold text-lg">{quantity}</span>
      <button
        onClick={() => onQuantityChange(quantity + 1)}
        disabled={quantity >= max}
        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <FaPlus className="text-sm" />
      </button>
    </div>
  );
}