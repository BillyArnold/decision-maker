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

  return (
    <div className="space-y-4">
      <Heading size="md" className="mb-4">Factors</Heading>
      {factors && factors.length > 0 ? (
        <div className="space-y-3">
          {factors.map((factor) => (
            <div
              key={factor.id}
              className="p-4 border border-gray-border rounded-lg bg-gray-50"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className="text-gray-text">{factor.text}</p>
                  {factor.weight && (
                    <p className="text-xs text-yellow-600 mt-1">
                      Importance: {factor.weight}/5
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(factor.id)}
                  disabled={isPending}
                  className="text-red-500 hover:text-red-700 p-2 rounded transition-colors ml-2"
                  aria-label="Delete factor"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              {factor.weight && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(factor.weight / 5) * 100}%` }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-text mb-4">No factors added yet</p>
        </div>
      )}
      <div className="pt-4">
        {adding ? (
          <div className="flex gap-2">
            <input
              type="text"
              className="border border-gray-border rounded px-3 py-2 flex-1"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Enter a factor"
              autoFocus
              disabled={isPending}
            />
            <Button size="sm" onClick={handleAdd} disabled={isPending}>
              {isPending ? 'Adding...' : 'Add'}
            </Button>
            <Button size="sm" variant="text" onClick={() => setAdding(false)} disabled={isPending}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button onClick={() => setAdding(true)}>
            Add a factor
          </Button>
        )}
      </div>
    </div>
  );
} 