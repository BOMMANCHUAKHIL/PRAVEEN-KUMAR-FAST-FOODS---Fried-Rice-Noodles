import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function OrderTracking() {
  const [orderNumber, setOrderNumber] = useState('');
  const [tracked, setTracked] = useState(false);

const handleTrack = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (orderNumber.trim()) {
      setTracked(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <h1 className="text-4xl font-bold text-deep-maroon text-center">Track Your Order</h1>
      <div className="mt-8 bg-white rounded-2xl shadow border border-[#e2d3c0] p-8">
        <form onSubmit={handleTrack} className="flex gap-4">
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Enter Order Number (e.g., ORD-12345678)"
            className="flex-1 border border-[#e2d3c0] rounded-xl p-3 focus:ring-2 focus:ring-deep-maroon focus:border-transparent outline-none"
            required
          />
          <button type="submit" className="bg-deep-maroon text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#631f1c] transition">
            Track
          </button>
        </form>

        {tracked && (
          <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
            <p className="text-green-700 font-semibold">✅ Order Found!</p>
            <p className="text-sm text-gray-600 mt-1">Status: <span className="font-medium text-amber-600">Processing</span></p>
            <Link to="/orders" className="inline-block mt-3 text-deep-maroon hover:underline text-sm">
              View All Orders →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
