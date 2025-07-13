import React from 'react';

interface ParagraphProps {
  children: React.ReactNode;
  className?: string;
}

export default function Paragraph({ children, className = '' }: ParagraphProps) {
  return (
    <p className={`text-center text-gray-text max-w-md mx-auto ${className}`}>
      {children}
    </p>
  );
} 