import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaPhone, FaLock, FaUser, FaArrowRight, FaKey, FaEnvelope } from 'react-icons/fa';
import { authService } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import OTPInput from '../components/OTPInput';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { customerLogin, isAuthenticated } = useAuth();

  // Login method: 'otp' or 'password'
  const [loginMethod, setLoginMethod] = useState<'otp' | 'password'>('otp');

  // Common fields
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP fields
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [resendTimer, setResendTimer] = useState(0);

  // Password fields
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // ===== OTP LOGIN =====
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await authService.sendOTP(phone);
      setStep('otp');
      setResendTimer(30);
      toast.success('OTP sent to your phone!');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otpValue: string) => {
    setOtp(otpValue);
    if (otpValue.length === 4) {
      setLoading(true);
      setError('');
      try {
        const response = await authService.verifyOTP(phone, otpValue);
        const { access_token, user } = response.data;
        customerLogin(access_token, {
          id: user.id,
          phone: user.phone,
          name: user.name,
          email: user.email,
          loyaltyPoints: user.loyaltyPoints,
          referralCode: user.referralCode,
          referredBy: user.referredBy || undefined,
          createdAt: user.createdAt
        });
        toast.success('Login successful!');
        navigate('/');
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Invalid OTP');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    try {
      await authService.sendOTP(phone);
      setResendTimer(30);
      toast.success('OTP resent!');
    } catch (err: any) {
      toast.error('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  // ===== PASSWORD LOGIN =====
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await authService.loginWithPassword(phone, password);
      const { access_token, user } = response.data;
      customerLogin(access_token, {
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        loyaltyPoints: user.loyaltyPoints,
        referralCode: user.referralCode,
        referredBy: user.referredBy || undefined,
        createdAt: user.createdAt
      });
      toast.success('Login successful!');
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid phone or password');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await authService.register(phone, password, name, email);
      const { access_token, user } = response.data;
      customerLogin(access_token, {
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        loyaltyPoints: user.loyaltyPoints,
        referralCode: user.referralCode,
        referredBy: user.referredBy || undefined,
        createdAt: user.createdAt
      });
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // ===== RENDER =====
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-200">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🍜</div>
          <h1 className="text-3xl font-bold text-red-700">
            {loginMethod === 'otp' ? 'Welcome Back!' : (isRegister ? 'Create Account' : 'Welcome Back!')}
          </h1>
          <p className="text-gray-500 mt-1">
            {loginMethod === 'otp' ? 'Sign in with OTP' : (isRegister ? 'Register with phone & password' : 'Sign in with password')}
          </p>
        </div>

        {/* Login Method Toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => {
              setLoginMethod('otp');
              setError('');
              setStep('phone');
              setIsRegister(false);
            }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              loginMethod === 'otp' ? 'bg-red-600 text-white shadow' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FaKey className="inline mr-2" /> OTP Login
          </button>
          <button
            onClick={() => {
              setLoginMethod('password');
              setError('');
              setIsRegister(false);
            }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              loginMethod === 'password' ? 'bg-red-600 text-white shadow' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FaLock className="inline mr-2" /> Password
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm">
            ❌ {error}
          </div>
        )}

        {/* ===== OTP LOGIN ===== */}
        {loginMethod === 'otp' && (
          <>
            {step === 'phone' && (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaPhone />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 10-digit phone number"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? 'Sending...' : <>Send OTP <FaArrowRight /></>}
                </button>
              </form>
            )}

            {step === 'otp' && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 text-center">
                    Enter the 4-digit OTP sent to <br />
                    <span className="font-semibold text-red-700">{phone}</span>
                  </p>
                  <div className="mt-6">
                    <OTPInput value={otp} onChange={setOtp} onComplete={handleVerifyOTP} disabled={loading} />
                  </div>
                </div>
                <div className="text-center">
                  {resendTimer > 0 ? (
                    <p className="text-sm text-gray-500">Resend OTP in {resendTimer}s</p>
                  ) : (
                    <button
                      onClick={handleResendOTP}
                      disabled={loading}
                      className="text-sm text-red-600 hover:underline font-medium"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setStep('phone')}
                  className="w-full border border-gray-300 py-3 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  ← Change Phone Number
                </button>
              </div>
            )}
          </>
        )}

        {/* ===== PASSWORD LOGIN ===== */}
        {loginMethod === 'password' && (
          <>
            {isRegister ? (
              // ===== REGISTER FORM =====
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaPhone />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 10-digit phone number"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaLock />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create password (min 6 chars)"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
                      minLength={6}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name (Optional)</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaUser />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaEnvelope />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? 'Creating...' : <>Create Account <FaArrowRight /></>}
                </button>

                <div className="text-center">
                  <button
                    onClick={() => { setIsRegister(false); setError(''); }}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Already have an account? Login
                  </button>
                </div>
              </form>
            ) : (
              // ===== LOGIN FORM =====
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaPhone />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 10-digit phone number"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaLock />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? 'Logging in...' : <>Login <FaArrowRight /></>}
                </button>

                <div className="text-center">
                  <button
                    onClick={() => { setIsRegister(true); setError(''); }}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Don't have an account? Register
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        <div className="mt-6 text-center text-xs text-gray-400 border-t border-gray-200 pt-4">
          <p>By continuing, you agree to our Terms of Service & Privacy Policy</p>
          <p className="mt-1">🛡️ Secure & Encrypted</p>
        </div>
      </div>
    </div>
  );
}