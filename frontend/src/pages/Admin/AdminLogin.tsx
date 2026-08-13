import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { adminLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);
      const response = await api.post('/token', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      adminLogin(response.data.access_token);
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold text-red-700 text-center">Admin Login</h2>
        <p className="text-gray-500 text-center mt-1">PRAVEEN KUMAR FAST FOODS Dashboard</p>
        {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@email.com"
            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
            required
          />
          <button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-xs text-gray-400 text-center mt-4">Default: admin@ahaa.com / SecurePass123</p>
      </div>
    </div>
  );
}