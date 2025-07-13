'use client';

import React, { useState } from 'react';
import { Button } from '../../../../components';
import { updateFactorWeights } from '../actions';
import { useRouter } from 'next/navigation';

interface Factor {
  id: string;
  text: string;
  weight: number | null;
}

interface WeighFactorsFormProps {
  decisionId: string;
  factors: Factor[];
}

export default function WeighFactorsForm({ decisionId, factors }: WeighFactorsFormProps) {
  const [weights, setWeights] = useState<Record<string, number>>(
    factors.reduce((acc, factor) => {
      if (factor.weight) acc[factor.id] = factor.weight;
      return acc;
    }, {} as Record<string, number>)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleWeightChange = (factorId: string, weight: number) => {
    setWeights(prev => ({
      ...prev,
      [factorId]: weight
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await updateFactorWeights(decisionId, weights);
      router.push(`/decisions/${decisionId}`);
    } catch (error) {
      console.error('Error updating weights:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {factors.map((factor) => (
          <div key={factor.id} className="p-6 border border-gray-border rounded-lg bg-gray-50">
            <h3 className="font-medium text-gray-text mb-4">{factor.text}</h3>
            
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map((weight) => (
                <label key={weight} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`factor-${factor.id}`}
                    value={weight}
                    checked={weights[factor.id] === weight}
                    onChange={() => handleWeightChange(factor.id, weight)}
                    className="w-4 h-4 text-primary border-gray-border focus:ring-primary"
                  />
                  <span className="text-sm text-gray-text">{weight}</span>
                </label>
              ))}
            </div>
            
            <div className="mt-2 text-xs text-gray-text">
              {weights[factor.id] ? (
                <span>Importance: {weights[factor.id]}/5</span>
              ) : (
                <span className="text-red-500">Please select an importance level</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 pt-6">
        <button 
          type="submit" 
          disabled={isSubmitting || Object.keys(weights).length !== factors.length}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : 'Save Weights'}
        </button>
        <Button 
          variant="text" 
          onClick={() => router.push(`/decisions/${decisionId}`)}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
} 