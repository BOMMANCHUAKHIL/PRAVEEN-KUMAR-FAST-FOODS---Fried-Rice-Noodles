import { useState, useRef, useEffect, KeyboardEvent } from 'react';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
}

export default function OTPInput({
  length = 4,
  value,
  onChange,
  onComplete,
  disabled = false,
}: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!disabled && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [disabled]);

  const handleChange = (index: number, val: string) => {
    if (disabled) return;
    if (val && !/^\d*$/.test(val)) return;
    const digit = val.slice(-1);
    const newValue = value.split('');
    newValue[index] = digit;
    const newOTP = newValue.join('');
    onChange(newOTP);
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (newOTP.length === length) {
      onComplete?.(newOTP);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (value[index]) {
        const newValue = value.split('');
        newValue[index] = '';
        onChange(newValue.join(''));
      } else if (index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <div className="flex gap-3 justify-center">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          disabled={disabled}
          className={`w-14 h-14 text-center text-2xl font-bold border-2 rounded-2xl transition ${
            disabled ? 'bg-gray-100 text-gray-400 border-gray-200' :
            value[index] ? 'border-red-600 bg-red-50 text-red-700' :
            'border-gray-300 hover:border-red-400'
          } focus:outline-none focus:ring-2 focus:ring-red-600`}
        />
      ))}
    </div>
  );
}