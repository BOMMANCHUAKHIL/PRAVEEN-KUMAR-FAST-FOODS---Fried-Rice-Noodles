
import { Link } from 'react-router-dom';
import { useState, type FormEvent } from 'react';
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-warm-cream to-amber-50 py-12 px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-[#e2d3c0]">
        <h1 className="text-3xl font-bold text-deep-maroon text-center">Forgot Password</h1>
        <p className="text-gray-500 text-center mt-2">Enter your email to reset your password</p>

        {submitted ? (
          <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
            <p className="text-green-700">✅ Password reset link sent to {email}</p>
            <Link to="/login" className="block mt-4 text-deep-maroon hover:underline text-center">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border border-[#e2d3c0] rounded-xl p-3 focus:ring-2 focus:ring-deep-maroon focus:border-transparent outline-none"
              required
            />
            <button type="submit" className="w-full bg-deep-maroon text-white py-3 rounded-xl font-semibold hover:bg-[#631f1c] transition">
              Send Reset Link
            </button>
            <Link to="/login" className="block text-center text-sm text-deep-maroon hover:underline">
              Back to Login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
