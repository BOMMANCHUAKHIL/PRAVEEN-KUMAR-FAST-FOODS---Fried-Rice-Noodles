import { useState } from 'react';

export interface Address {
  fullName: string;
  phone: string;
  addressLine: string;
  landmark?: string;
  city: string;
  pincode: string;
  lat?: number;
  lng?: number;
}

interface AddressFormProps {
  onSubmit: (address: Address) => void;
  initialData?: Address;
  isLoading?: boolean;
}

export default function AddressForm({ onSubmit, initialData, isLoading }: AddressFormProps) {
  const [address, setAddress] = useState<Address>(
    initialData || {
      fullName: '',
      phone: '',
      addressLine: '',
      landmark: '',
      city: 'Bengaluru',
      pincode: '',
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof Address, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Address, string>> = {};

    if (!address.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!address.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!address.phone.match(/^[0-9]{10}$/)) newErrors.phone = 'Enter a valid 10-digit phone number';
    if (!address.addressLine.trim()) newErrors.addressLine = 'Address is required';
    if (!address.pincode.trim()) newErrors.pincode = 'Pincode is required';
    if (!address.pincode.match(/^[0-9]{6}$/)) newErrors.pincode = 'Enter a valid 6-digit pincode';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(address);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input
            type="text"
            value={address.fullName}
            onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
            className={`w-full border rounded-xl p-3 focus:ring-2 focus:ring-deep-maroon focus:border-transparent outline-none transition ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your full name"
          />
          {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
          <input
            type="tel"
            value={address.phone}
            onChange={(e) => setAddress({ ...address, phone: e.target.value })}
            className={`w-full border rounded-xl p-3 focus:ring-2 focus:ring-deep-maroon focus:border-transparent outline-none transition ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter 10-digit phone number"
            maxLength={10}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line *</label>
        <input
          type="text"
          value={address.addressLine}
          onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
          className={`w-full border rounded-xl p-3 focus:ring-2 focus:ring-deep-maroon focus:border-transparent outline-none transition ${
            errors.addressLine ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="House / Flat number, Street name"
        />
        {errors.addressLine && <p className="text-red-500 text-xs mt-1">{errors.addressLine}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Landmark (Optional)</label>
        <input
          type="text"
          value={address.landmark || ''}
          onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-deep-maroon focus:border-transparent outline-none transition"
          placeholder="Nearby landmark, e.g., Near KR Puram Metro"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
          <input
            type="text"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-deep-maroon focus:border-transparent outline-none transition"
            placeholder="City"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
          <input
            type="text"
            value={address.pincode}
            onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
            className={`w-full border rounded-xl p-3 focus:ring-2 focus:ring-deep-maroon focus:border-transparent outline-none transition ${
              errors.pincode ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter 6-digit pincode"
            maxLength={6}
          />
          {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-deep-maroon text-white py-3 rounded-xl font-semibold hover:bg-[#631f1c] transition disabled:opacity-50"
      >
        {isLoading ? 'Saving...' : 'Save Address'}
      </button>
    </form>
  );
}