import { useState } from 'react';
import { FaCreditCard, FaMobileAlt, FaUniversity, FaWallet } from 'react-icons/fa';

export type PaymentMethodType = 'cod' | 'upi' | 'card' | 'bank';

interface PaymentMethodProps {
  selected: PaymentMethodType;
  onChange: (method: PaymentMethodType) => void;
}

const paymentMethods = [
  { id: 'cod' as const, label: 'Cash on Delivery', icon: FaWallet, description: 'Pay when you receive' },
  { id: 'upi' as const, label: 'UPI / GPay / PhonePe', icon: FaMobileAlt, description: 'Pay via UPI app' },
  { id: 'card' as const, label: 'Credit / Debit Card', icon: FaCreditCard, description: 'Pay with card' },
  { id: 'bank' as const, label: 'Bank Transfer', icon: FaUniversity, description: 'NEFT / IMPS / RTGS' },
];

export default function PaymentMethod({ selected, onChange }: PaymentMethodProps) {
  return (
    <div className="space-y-3">
      {paymentMethods.map((method) => {
        const Icon = method.icon;
        const isSelected = selected === method.id;

        return (
          <button
            key={method.id}
            onClick={() => onChange(method.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition ${
              isSelected
                ? 'border-deep-maroon bg-deep-maroon/5'
                : 'border-[#e2d3c0] hover:border-deep-maroon/50'
            }`}
          >
            <div className={`p-3 rounded-xl ${isSelected ? 'bg-deep-maroon text-white' : 'bg-gray-100'}`}>
              <Icon className="text-xl" />
            </div>
            <div className="flex-1 text-left">
              <p className={`font-semibold ${isSelected ? 'text-deep-maroon' : 'text-gray-700'}`}>
                {method.label}
              </p>
              <p className="text-sm text-gray-500">{method.description}</p>
            </div>
            {isSelected && (
              <div className="w-6 h-6 rounded-full bg-deep-maroon text-white flex items-center justify-center">
                ✓
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}