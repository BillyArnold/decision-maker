import React from 'react';

interface HeaderImageProps {
  className?: string;
}

export default function HeaderImage({ className = '' }: HeaderImageProps) {
  return (
    <div className={`w-full max-w-4xl h-80 bg-gradient-to-r from-orange-200 to-yellow-200 rounded-2xl shadow-lg flex items-center justify-center ${className}`}>
      <img 
        src="/header.png" 
        alt="Team collaboration around decision making interface" 
        className="w-full h-full object-cover rounded-2xl"
      />
     
    </div>
  );
} 