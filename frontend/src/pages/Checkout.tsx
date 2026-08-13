import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { formatPrice } from '../utils/helpers';
import { FaCreditCard, FaWallet, FaUniversity } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface Address {
  fullName: string;
  phone: string;
  addressLine: string;
  landmark: string;
  city: string;
  pincode: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getTotalPrice, getTotalItems, clearCart } = useCart();
  const { user, customerToken, isAuthenticated } = useAuth();

  const [step, setStep] = useState<'address' | 'payment'>('address');
  const [address, setAddress] = useState<Address>({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine: '',
    landmark: '',
    city: 'Bengaluru',
    pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);

  const subtotal = getTotalPrice();
  const itemCount = getTotalItems();
  const deliveryFee = subtotal > 300 ? 0 : 30;
  const total = subtotal + deliveryFee;

  // Check if user is logged in
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to place order');
      navigate('/login');
    }
    if (itemCount === 0) {
      navigate('/cart');
    }
  }, [isAuthenticated, itemCount, navigate]);

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.addressLine || !address.pincode) {
      toast.error('Please fill all required fields');
      return;
    }
    setStep('payment');
  };

  const handlePlaceOrder = async () => {
    // Check if customer is logged in
    if (!isAuthenticated || !customerToken) {
      toast.error('Please login to place order');
      navigate('/login');
      return;
    }

    // Check if user has phone number
    if (!user?.phone) {
      toast.error('Customer information missing. Please login again.');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: items.map(item => ({
          name: item.name,
          variant: item.variant,
          quantity: item.quantity,
          price: item.price
        })),
        total_amount: total,
        payment_method: paymentMethod,
        delivery_address: address,
        customer_phone: user.phone,
        customer_name: user.name || 'Customer',
      };

      console.log('📦 Sending order:', orderData);
      console.log('🔑 Token:', customerToken ? 'Exists' : 'Missing');

      const response = await api.post('/api/orders', orderData, {
        headers: {
          Authorization: `Bearer ${customerToken}`
        }
      });

      console.log('✅ Order response:', response.data);

      // Store in localStorage for success page
      localStorage.setItem('lastOrder', JSON.stringify({
        orderNumber: response.data.order_number,
        items,
        total,
        address,
        paymentMethod,
        estimatedDelivery: new Date(Date.now() + 30 * 60000).toLocaleTimeString(),
      }));

      clearCart();
      navigate('/order-success');
      toast.success('Order placed successfully!');
    } catch (error: any) {
      console.error('❌ Order error:', error);
      console.error('❌ Error response:', error.response?.data);

      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else if (error.response?.status === 404) {
        toast.error('Customer not found. Please login again.');
        navigate('/login');
      } else {
        toast.error(error.response?.data?.detail || 'Failed to place order');
      }
    } finally {
      setLoading(false);
    }
  };

  if (step === 'address') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-red-700 text-center mb-2">Delivery Address</h1>
        <p className="text-center text-gray-500 mb-8">Where should we deliver your food?</p>

        <div className="bg-white rounded-2xl shadow border border-gray-200 p-6">
          <form onSubmit={handleAddressSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address Line *</label>
              <input
                type="text"
                value={address.addressLine}
                onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
                placeholder="House / Flat number, Street name"
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Landmark (Optional)</label>
              <input
                type="text"
                value={address.landmark}
                onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                placeholder="Nearby landmark"
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                <input
                  type="text"
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, '') })}
                  placeholder="6-digit pincode"
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
                  maxLength={6}
                  required
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Link to="/cart" className="flex-1 border border-gray-300 py-3 rounded-xl text-center font-medium hover:bg-gray-50 transition">
                ← Back to Cart
              </Link>
              <button type="submit" className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition">
                Proceed to Payment →
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-red-700 text-center mb-2">Payment Method</h1>
      <p className="text-center text-gray-500 mb-8">How would you like to pay?</p>

      <div className="bg-white rounded-2xl shadow border border-gray-200 p-6">
        <div className="space-y-3">
          <button
            onClick={() => setPaymentMethod('cod')}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition ${
              paymentMethod === 'cod' ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-red-300'
            }`}
          >
            <div className={`p-3 rounded-xl ${paymentMethod === 'cod' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>
              <FaWallet className="text-xl" />
            </div>
            <div className="flex-1 text-left">
              <p className={`font-semibold ${paymentMethod === 'cod' ? 'text-red-700' : 'text-gray-700'}`}>Cash on Delivery</p>
              <p className="text-sm text-gray-500">Pay when you receive your food</p>
            </div>
            {paymentMethod === 'cod' && <span className="text-red-600 font-bold">✓</span>}
          </button>

          <button
            onClick={() => setPaymentMethod('upi')}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition ${
              paymentMethod === 'upi' ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-red-300'
            }`}
          >
            <div className={`p-3 rounded-xl ${paymentMethod === 'upi' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>
              <FaCreditCard className="text-xl" />
            </div>
            <div className="flex-1 text-left">
              <p className={`font-semibold ${paymentMethod === 'upi' ? 'text-red-700' : 'text-gray-700'}`}>UPI / GPay / PhonePe</p>
              <p className="text-sm text-gray-500">Pay using any UPI app</p>
            </div>
            {paymentMethod === 'upi' && <span className="text-red-600 font-bold">✓</span>}
          </button>

          <button
            onClick={() => setPaymentMethod('bank')}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition ${
              paymentMethod === 'bank' ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-red-300'
            }`}
          >
            <div className={`p-3 rounded-xl ${paymentMethod === 'bank' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>
              <FaUniversity className="text-xl" />
            </div>
            <div className="flex-1 text-left">
              <p className={`font-semibold ${paymentMethod === 'bank' ? 'text-red-700' : 'text-gray-700'}`}>Bank Transfer</p>
              <p className="text-sm text-gray-500">NEFT / IMPS / RTGS</p>
            </div>
            {paymentMethod === 'bank' && <span className="text-red-600 font-bold">✓</span>}
          </button>
        </div>

        {/* Order Summary */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Delivery Fee</span>
            <span className="font-medium">{deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-red-700">{formatPrice(total)}</span>
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button onClick={() => setStep('address')} className="flex-1 border border-gray-300 py-3 rounded-xl text-center font-medium hover:bg-gray-50 transition">
            ← Back
          </button>
          <button
            onClick={handlePlaceOrder}
            disabled={loading || !isAuthenticated}
            className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Placing Order...' : `Place Order • ${formatPrice(total)}`}
          </button>
        </div>

        {!isAuthenticated && (
          <p className="mt-4 text-center text-sm text-red-500">
            ⚠️ Please login to place order
          </p>
        )}
      </div>
    </div>
  );
}