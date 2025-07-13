'use client';

import React, { useState, useTransition } from 'react';
import { Button, Heading } from '../../../../components';
import { addOutcome, deleteOutcome } from '../actions';
import { useParams, useRouter } from 'next/navigation';

interface Outcome {
  id: string;
  text: string;
}

interface OutcomesListProps {
  outcomes: Outcome[];
}

export default function OutcomesList({ outcomes }: OutcomesListProps) {
  const [adding, setAdding] = useState(false);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const params = useParams();
  const router = useRouter();

  async function handleAdd() {
    if (!input.trim()) return;
    startTransition(async () => {
      await addOutcome(params.id as string, input);
      setInput('');
      setAdding(false);
      router.refresh();
    });
  }

  async function handleDelete(outcomeId: string) {
    startTransition(async () => {
      await deleteOutcome(params.id as string, outcomeId);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <Heading size="md" className="mb-4">Possible Outcomes</Heading>
      
      {outcomes && outcomes.length > 0 ? (
        <div className="space-y-3">
          {outcomes.map((outcome) => (
            <div
              key={outcome.id}
              className="p-4 border border-gray-border rounded-lg bg-gray-50 flex justify-between items-center"
            >
              <p className="text-gray-text">{outcome.text}</p>
              <button
                onClick={() => handleDelete(outcome.id)}
                disabled={isPending}
                className="text-red-500 hover:text-red-700 p-2 rounded transition-colors"
                aria-label="Delete outcome"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-text mb-4">No outcomes added yet</p>
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
              placeholder="Enter a possible outcome"
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
            Add an outcome
          </Button>
        )}
      </div>

      {/* Next Step Button */}
      <div className="mt-8 pt-6 border-t border-gray-border">
        {outcomes.length >= 1 ? (
          <div className="flex justify-end">
            <a href={`/decisions/${params.id}/rate`}>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Next: Rate Outcomes
              </Button>
            </a>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-text text-sm">
              Add at least one outcome to proceed to rating
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 