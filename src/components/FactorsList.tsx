'use client';

import React, { useState } from 'react';
import { Button, Heading } from './index';
import { useTransition } from 'react';
import { addFactor, deleteFactor } from '../app/decisions/[id]/actions';
import { useParams, useRouter } from 'next/navigation';

interface Factor {
  id: string;
  text: string;
  weight: number | null;
}

interface FactorsListProps {
  factors: Factor[];
}

export default function FactorsList({ factors }: FactorsListProps) {
  const [adding, setAdding] = useState(false);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const params = useParams();
  const router = useRouter();

  async function handleAdd() {
    if (!input.trim()) return;
    startTransition(async () => {
      await addFactor(params.id as string, input);
      setInput('');
      setAdding(false);
      router.refresh();
    });
  }

  async function handleDelete(factorId: string) {
    startTransition(async () => {
      await deleteFactor(params.id as string, factorId);
      router.refresh();
    });
  }

  const getImportanceColor = (weight: number) => {
    if (weight <= 2) return 'text-blue-600 bg-blue-50';
    if (weight <= 3) return 'text-green-600 bg-green-50';
    if (weight <= 4) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getImportanceLabel = (weight: number) => {
    if (weight <= 2) return 'Low';
    if (weight <= 3) return 'Medium';
    if (weight <= 4) return 'High';
    return 'Critical';
  };

  return (
    <div className="space-y-6">
      <div>
        <Heading size="md" className="mb-2">Factors</Heading>
        <p className="text-gray-text text-sm">
          Factors are the things that matter to you in making this decision. Rate how important each factor is to you.
        </p>
      </div>

      {factors && factors.length > 0 ? (
        <div className="space-y-4">
          {factors.map((factor) => (
            <div
              key={factor.id}
              className="group relative bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{factor.text}</h3>
                  {factor.weight && (
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getImportanceColor(factor.weight)}`}>
                        {getImportanceLabel(factor.weight)} Importance
                      </span>
                      <span className="text-sm text-gray-500">({factor.weight}/5)</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(factor.id)}
                  disabled={isPending}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                  aria-label="Delete factor"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              
              {factor.weight && (
                <div className="mt-4">
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        factor.weight <= 2 ? 'bg-blue-500' :
                        factor.weight <= 3 ? 'bg-green-500' :
                        factor.weight <= 4 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${(factor.weight / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl">
          <div className="max-w-sm mx-auto">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No factors yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding your first factor.</p>
          </div>
        </div>
      )}

      {/* Add Factor Section */}
      <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-6">
        {adding ? (
          <div className="space-y-4">
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Enter a factor (e.g., Cost, Quality, Time)"
              autoFocus
              disabled={isPending}
            />
            <div className="flex gap-3">
              <Button 
                size="sm" 
                onClick={handleAdd} 
                disabled={isPending || !input.trim()}
                className="bg-primary hover:bg-primary-dark text-white"
              >
                {isPending ? 'Adding...' : 'Add Factor'}
              </Button>
              <Button 
                size="sm" 
                variant="text" 
                onClick={() => setAdding(false)} 
                disabled={isPending}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Button 
              onClick={() => setAdding(true)}
              className="bg-primary hover:bg-primary-dark text-white"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add a factor
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 