import React from 'react';

interface CheckboxProps {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export default function Checkbox({ 
  label, 
  checked = false, 
  onChange, 
  className = '',
  disabled = false 
}: CheckboxProps) {
  return (
    <label className={`flex items-center gap-2 text-sm cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
        className="form-checkbox text-primary rounded focus:ring-primary"
      />
      {label}
    </label>
  );
} 