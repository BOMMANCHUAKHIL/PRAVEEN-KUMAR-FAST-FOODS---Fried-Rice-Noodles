import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-warm-cream to-amber-50 py-12 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-deep-maroon">404</h1>
        <h2 className="text-3xl font-semibold text-gray-700 mt-4">Page Not Found</h2>
        <p className="text-gray-500 mt-2">The page you are looking for doesn't exist.</p>
        <Link to="/" className="inline-block mt-6 bg-deep-maroon text-white px-8 py-3 rounded-full font-semibold hover:bg-[#631f1c] transition">
          Go Home
        </Link>
      </div>
    </div>
  );
}
