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
    <div className="space-y-6">
      <div>
        <Heading size="md" className="mb-2">Possible Outcomes</Heading>
        <p className="text-gray-text text-sm">
          Share what the possible outcomes of the decision could be. This could be either a simple Yes/No decision or multiple options, like holiday destinations.
        </p>
      </div>

      {/* Existing Outcomes */}
      {outcomes && outcomes.length > 0 ? (
        <div className="space-y-4">
          {outcomes.map((outcome, index) => (
            <div
              key={outcome.id}
              className="group relative bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full text-sm font-medium">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">{outcome.text}</h3>
                  </div>
                  <p className="text-sm text-gray-500 ml-11">
                    Option {index + 1} of {outcomes.length}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(outcome.id)}
                  disabled={isPending}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                  aria-label="Delete outcome"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl">
          <div className="max-w-sm mx-auto">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No outcomes yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding your first outcome.</p>
          </div>
        </div>
      )}

      {/* Add Outcome Section */}
      <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-6">
        {adding ? (
          <div className="space-y-4">
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Enter a possible outcome (e.g., Move to New York, Stay in current city)"
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
                {isPending ? 'Adding...' : 'Add Outcome'}
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
              Add an outcome
            </Button>
          </div>
        )}
      </div>

      {/* Progress and Next Step */}
      <div className="pt-6 border-t border-gray-200">
        {outcomes.length >= 1 ? (
          <div className="space-y-4">
            {/* Progress Indicator */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  {outcomes.length} outcome{outcomes.length !== 1 ? 's' : ''} added
                </span>
              </div>
              <span className="text-sm text-gray-500">
                Ready for rating
              </span>
            </div>
            
            {/* Next Step Button */}
            <div className="flex justify-end">
              <a href={`/decisions/${params.id}/rate`}>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Next: Rate Outcomes
                </Button>
              </a>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <span className="text-sm text-gray-500">Add at least one outcome to proceed</span>
            </div>
            <p className="text-xs text-gray-400">
              You'll be able to rate how each outcome performs against your factors
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 