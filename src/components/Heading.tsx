import React from 'react';

interface HeadingProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Heading({ children, size = 'md', className = '' }: HeadingProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <h1 className={`${sizeClasses[size]} font-bold text-center ${className}`}>
      {children}
    </h1>
  );
} 