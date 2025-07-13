import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
  height?: 'sm' | 'md' | 'lg';
}

export default function ProgressBar({ 
  progress, 
  className = '',
  height = 'md' 
}: ProgressBarProps) {
  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={`w-full bg-gray-border rounded-full ${heightClasses[height]} ${className}`}>
      <div 
        className={`bg-primary rounded-full transition-all duration-300 ${heightClasses[height]}`}
        style={{ width: `${clampedProgress}%` }}
      />
    </div>
  );
} 