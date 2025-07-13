import React from 'react';

interface InputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'email' | 'password';
  className?: string;
  disabled?: boolean;
}

export default function Input({ 
  placeholder, 
  value, 
  onChange, 
  type = 'text', 
  className = '',
  disabled = false 
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
      className={`w-full border border-gray-border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    />
  );
} 