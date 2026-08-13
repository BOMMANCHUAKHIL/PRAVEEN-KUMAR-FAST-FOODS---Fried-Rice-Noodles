export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold text-center text-red-700">Contact Us</h1>
      <div className="mt-8 bg-white rounded-2xl shadow border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-red-700">PRAVEEN KUMAR FAST FOODS</h2>
        <div className="mt-4 space-y-3">
          <p><strong>📞 Phone:</strong> +91 80085 11402</p>
          <p><strong>📍 Address:</strong> Near Main Market, City Center</p>
          <p><strong>⏰ Hours:</strong> 10:00 AM - 11:00 PM</p>
        </div>
        <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
          <p className="font-semibold">🚚 Delivery Zone:</p>
          <p className="text-sm text-gray-600">Free delivery within 5km radius</p>
        </div>
      </div>
    </div>
  );
}