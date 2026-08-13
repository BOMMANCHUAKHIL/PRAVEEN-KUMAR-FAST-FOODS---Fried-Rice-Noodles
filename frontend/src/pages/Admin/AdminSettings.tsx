import { useState, useEffect } from 'react';
import { FaSave, FaStore, FaTruck, FaWhatsapp, FaVideo } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    storeName: 'PRAVEEN KUMAR FAST FOODS',
    storePhone: '+91800851140',
    storeEmail: 'info@pkfastfoods.com',
    storeAddress: 'Near Main Market, City Center',
    deliveryRadius: 5,
    freeDeliveryThreshold: 300,
    deliveryFee: 30,
    whatsappNumber: '+91800851140',
    whatsappMessage: 'Hi! I would like to place an order.',
    liveVideoEnabled: true,
    liveVideoDescription: 'Watch your food being prepared live!',
  });

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Settings">
        <div className="animate-pulse">Loading settings...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Settings">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Store Info */}
        <div className="bg-white rounded-2xl shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
            <FaStore /> Store Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                value={settings.storePhone}
                onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={settings.storeEmail}
                onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={settings.storeAddress}
                onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Delivery Settings */}
        <div className="bg-white rounded-2xl shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
            <FaTruck /> Delivery Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Radius (km)</label>
              <input
                type="number"
                value={settings.deliveryRadius}
                onChange={(e) => setSettings({ ...settings, deliveryRadius: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Free Delivery Threshold (₹)</label>
              <input
                type="number"
                value={settings.freeDeliveryThreshold}
                onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Fee (₹)</label>
              <input
                type="number"
                value={settings.deliveryFee}
                onChange={(e) => setSettings({ ...settings, deliveryFee: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* WhatsApp Settings */}
        <div className="bg-white rounded-2xl shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
            <FaWhatsapp className="text-green-500" /> WhatsApp Settings
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Auto-reply Message</label>
              <textarea
                value={settings.whatsappMessage}
                onChange={(e) => setSettings({ ...settings, whatsappMessage: e.target.value })}
                rows={2}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <FaSave /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}