import React from 'react';

interface RatingButtonProps {
  value: number;
  selected?: boolean;
  onClick?: (value: number) => void;
  className?: string;
  disabled?: boolean;
}

export default function RatingButton({ 
  value, 
  selected = false, 
  onClick, 
  className = '',
  disabled = false 
}: RatingButtonProps) {
  const baseClasses = 'w-10 h-10 border rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200';
  const stateClasses = selected 
    ? 'bg-primary text-white border-primary' 
    : 'border-gray-border hover:bg-primary hover:text-white hover:border-primary';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      onClick={() => onClick?.(value)}
      disabled={disabled}
      className={`${baseClasses} ${stateClasses} ${disabledClasses} ${className}`}
    >
      {value}
    </button>
  );
} 