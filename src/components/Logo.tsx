import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-48 h-48',
    lg: 'w-64 h-64'
  };

  return (
    <div className={`flex justify-center ${className}`}>
      <div className={`${sizeClasses[size]} bg-primary rounded-lg`} />
    </div>
  );
} 