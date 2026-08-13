import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-warm-cream to-amber-50 py-12 px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-[#e2d3c0]">
        <h1 className="text-3xl font-bold text-deep-maroon text-center">Register</h1>
        <p className="text-gray-500 text-center mt-2">Create your account</p>
        <form className="mt-6 space-y-4">
          <input type="text" placeholder="Full Name" className="w-full border border-[#e2d3c0] rounded-xl p-3" />
          <input type="email" placeholder="Email" className="w-full border border-[#e2d3c0] rounded-xl p-3" />
          <input type="tel" placeholder="Phone Number" className="w-full border border-[#e2d3c0] rounded-xl p-3" />
          <input type="password" placeholder="Password" className="w-full border border-[#e2d3c0] rounded-xl p-3" />
          <button type="submit" className="w-full bg-deep-maroon text-white py-3 rounded-xl font-semibold hover:bg-[#631f1c] transition">
            Register
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account? <Link to="/login" className="text-deep-maroon hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
