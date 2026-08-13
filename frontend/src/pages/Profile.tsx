import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaPhone, FaEnvelope, FaGift, FaCoins, FaEdit, FaSignOutAlt, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth';
import toast from 'react-hot-toast';

export default function Profile() {
  const navigate = useNavigate();
  const { user, customerLogout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: user?.name || '', email: user?.email || '' });
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-deep-maroon">Please login</h2>
        <button onClick={() => navigate('/login')} className="mt-4 bg-deep-maroon text-white px-6 py-2 rounded-full">Login</button>
      </div>
    );
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.updateProfile(editData);
      updateUser(response.data);
      setIsEditing(false);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { customerLogout(); navigate('/'); };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow border border-[#e2d3c0] p-6 text-center">
            <div className="w-24 h-24 bg-deep-maroon/10 rounded-full flex items-center justify-center mx-auto text-4xl">
              {user.name ? user.name[0].toUpperCase() : '👤'}
            </div>
            <h3 className="text-xl font-bold text-deep-maroon mt-3">{user.name || 'Customer'}</h3>
            <p className="text-sm text-gray-500">{user.phone}</p>
            <div className="mt-4 space-y-2">
              <button onClick={() => navigate('/orders')} className="w-full flex items-center justify-between px-4 py-2 rounded-xl hover:bg-gray-50">
                <span>My Orders</span> <FaArrowRight className="text-gray-400" />
              </button>
              <button onClick={handleLogout} className="w-full flex items-center justify-between px-4 py-2 rounded-xl text-red-500 hover:bg-red-50">
                <span>Logout</span> <FaSignOutAlt />
              </button>
            </div>
          </div>
        </div>
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl shadow border border-[#e2d3c0] p-4 text-center">
              <FaCoins className="text-2xl mx-auto text-amber-500" />
              <p className="text-2xl font-bold text-deep-maroon mt-1">{user.loyaltyPoints}</p>
              <p className="text-xs text-gray-500">Loyalty Points</p>
            </div>
            <div className="bg-white rounded-2xl shadow border border-[#e2d3c0] p-4 text-center">
              <FaGift className="text-2xl mx-auto text-deep-maroon" />
              <p className="text-2xl font-bold text-deep-maroon mt-1">{user.referralCode}</p>
              <p className="text-xs text-gray-500">Referral Code</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow border border-[#e2d3c0] p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-deep-maroon">Profile Information</h3>
              <button onClick={() => setIsEditing(!isEditing)} className="flex items-center gap-2 text-sm text-deep-maroon hover:underline">
                <FaEdit /> {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>
            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <input type="text" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="w-full border rounded-xl p-3" required />
                <input type="email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} className="w-full border rounded-xl p-3" />
                <button type="submit" disabled={loading} className="w-full bg-deep-maroon text-white py-2.5 rounded-xl font-semibold disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            ) : (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Phone</span><span className="font-medium">{user.phone}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Name</span><span className="font-medium">{user.name || 'Not set'}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Email</span><span className="font-medium">{user.email || 'Not set'}</span></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}