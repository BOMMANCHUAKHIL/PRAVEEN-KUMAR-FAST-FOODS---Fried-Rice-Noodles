import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaPhone, FaArrowRight } from 'react-icons/fa';
import { authService } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import OTPInput from '../components/OTPInput';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { customerLogin, isAuthenticated } = useAuth();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [error, setError] = useState('');

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
        navigate('/');
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Invalid OTP');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-200">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🍜</div>
          <h1 className="text-3xl font-bold text-red-700">Welcome Back!</h1>
          <p className="text-gray-500 mt-1">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm">
            ❌ {error}
          </div>
        )}

        {step === 'phone' && (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><FaPhone /></div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10-digit phone number"
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
                  maxLength={10}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3.5 rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Sending...' : <>Send OTP <FaArrowRight /></>}
            </button>
            <div className="text-center">
              <Link to="/register" className="text-sm text-red-600 hover:underline">Don't have an account? Register</Link>
            </div>
          </form>
        )}

        {step === 'otp' && (
          <div className="space-y-6">
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
                <button onClick={async () => {
                  setLoading(true);
                  await authService.sendOTP(phone);
                  setResendTimer(30);
                  setLoading(false);
                  toast.success('OTP resent!');
                }} className="text-sm text-red-600 hover:underline font-medium">Resend OTP</button>
              )}
            </div>
            <button onClick={() => setStep('phone')} className="w-full border border-gray-300 py-3 rounded-xl font-medium hover:bg-gray-50 transition">
              ← Change Phone Number
            </button>
          </div>
        )}

        <div className="mt-6 text-center text-xs text-gray-400 border-t border-gray-200 pt-4">
          <p>By continuing, you agree to our Terms of Service & Privacy Policy</p>
          <p className="mt-1">🛡️ Secure & Encrypted</p>
        </div>
      </div>
    </div>
  );
}