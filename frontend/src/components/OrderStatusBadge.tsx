import { FaClock, FaUtensils, FaTruck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface OrderStatusBadgeProps {
  status: 'placed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const statusConfig: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  placed: {
    label: 'Order Placed',
    icon: FaClock,
    color: 'text-blue-700',
    bg: 'bg-blue-100',
  },
  preparing: {
    label: 'Preparing',
    icon: FaUtensils,
    color: 'text-amber-700',
    bg: 'bg-amber-100',
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    icon: FaTruck,
    color: 'text-purple-700',
    bg: 'bg-purple-100',
  },
  delivered: {
    label: 'Delivered',
    icon: FaCheckCircle,
    color: 'text-green-700',
    bg: 'bg-green-100',
  },
  cancelled: {
    label: 'Cancelled',
    icon: FaTimesCircle,
    color: 'text-red-700',
    bg: 'bg-red-100',
  },
};

export default function OrderStatusBadge({ status, size = 'md', showLabel = true }: OrderStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.placed;
  const Icon = config.icon;

  const sizes = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-2',
    lg: 'px-4 py-2 text-base gap-2',
  };

  return (
    <div className={`inline-flex items-center rounded-full ${config.bg} ${config.color} ${sizes[size]} font-medium`}>
      <Icon className={size === 'sm' ? 'text-xs' : 'text-base'} />
      {showLabel && <span>{config.label}</span>}
    </div>
  );
}