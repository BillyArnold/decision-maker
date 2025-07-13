import React from 'react';

interface DecisionCardProps {
  title: string;
  status: string;
  className?: string;
}

// Simple icon components
const DecisionIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CompletedIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PendingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const getIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return <CompletedIcon />;
    case 'pending':
      return <PendingIcon />;
    default:
      return <DecisionIcon />;
  }
};

export default function DecisionCard({ title, status, className = '' }: DecisionCardProps) {
  return (
    <div className={`bg-white rounded-lg flex items-stretch overflow-hidden ${className}`}>
      {/* Icon section - full height rounded square */}
      <div className="bg-primary text-white p-4 flex items-center justify-center min-w-[60px]">
        {getIcon(status)}
      </div>
      
      {/* Content section */}
      <div className="flex-1 p-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-gray-text">Status: {status}</p>
        </div>
      </div>
    </div>
  );
} 