import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password && password === confirmPassword) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-warm-cream to-amber-50 py-12 px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-[#e2d3c0]">
        <h1 className="text-3xl font-bold text-deep-maroon text-center">Reset Password</h1>
        <p className="text-gray-500 text-center mt-2">Enter your new password</p>

        {submitted ? (
          <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
            <p className="text-green-700">✅ Password reset successfully!</p>
            <Link to="/login" className="block mt-4 text-deep-maroon hover:underline text-center">
              Login Now
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              className="w-full border border-[#e2d3c0] rounded-xl p-3 focus:ring-2 focus:ring-deep-maroon focus:border-transparent outline-none"
              required
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full border border-[#e2d3c0] rounded-xl p-3 focus:ring-2 focus:ring-deep-maroon focus:border-transparent outline-none"
              required
            />
            <button type="submit" className="w-full bg-deep-maroon text-white py-3 rounded-xl font-semibold hover:bg-[#631f1c] transition">
              Reset Password
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
