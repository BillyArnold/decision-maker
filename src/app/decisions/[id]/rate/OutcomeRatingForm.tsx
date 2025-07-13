'use client';

import React, { useState, useTransition } from 'react';
import { Button } from '../../../../components';
import { updateOutcomeRatings } from '../actions';
import { useParams, useRouter } from 'next/navigation';

interface Factor {
  id: string;
  text: string;
  weight: number | null;
}

interface Outcome {
  id: string;
  text: string;
  ratings: any[];
}

interface OutcomeRatingFormProps {
  decisionId: string;
  factors: Factor[];
  outcomes: Outcome[];
}

export default function OutcomeRatingForm({ decisionId, factors, outcomes }: OutcomeRatingFormProps) {
  const [ratings, setRatings] = useState<Record<string, Record<string, number>>>(
    outcomes.reduce((acc, outcome) => {
      acc[outcome.id] = factors.reduce((factorAcc, factor) => {
        const existingRating = outcome.ratings.find((r: any) => r.factorId === factor.id);
        if (existingRating) factorAcc[factor.id] = existingRating.rating;
        return factorAcc;
      }, {} as Record<string, number>);
      return acc;
    }, {} as Record<string, Record<string, number>>)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleRatingChange = (outcomeId: string, factorId: string, rating: number) => {
    setRatings(prev => ({
      ...prev,
      [outcomeId]: {
        ...prev[outcomeId],
        [factorId]: rating
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await updateOutcomeRatings(decisionId, ratings);
      router.push(`/decisions/${decisionId}`);
    } catch (error) {
      console.error('Error updating ratings:', error);
      setIsSubmitting(false);
    }
  };

  const allRatingsComplete = outcomes.every(outcome => 
    factors.every(factor => ratings[outcome.id]?.[factor.id])
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {outcomes.map((outcome) => (
        <div key={outcome.id} className="border border-gray-border rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-text mb-4">{outcome.text}</h3>
          
          <div className="space-y-4">
            {factors.map((factor) => (
              <div key={factor.id} className="flex items-center justify-between p-4 bg-gray-50 rounded">
                <div className="flex-1">
                  <p className="font-medium text-gray-text">{factor.text}</p>
                  <p className="text-sm text-gray-text">Importance: {factor.weight}/5</p>
                </div>
                
                <div className="flex gap-4">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`outcome-${outcome.id}-factor-${factor.id}`}
                        value={rating}
                        checked={ratings[outcome.id]?.[factor.id] === rating}
                        onChange={() => handleRatingChange(outcome.id, factor.id, rating)}
                        className="w-4 h-4 text-primary border-gray-border focus:ring-primary"
                      />
                      <span className="text-sm text-gray-text">{rating}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex gap-4 pt-6">
        <button 
          type="submit" 
          disabled={isSubmitting || !allRatingsComplete}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : 'Save Ratings'}
        </button>
        <Button 
          variant="text" 
          onClick={() => router.push(`/decisions/${decisionId}/outcomes`)}
          disabled={isSubmitting}
        >
          Back to Outcomes
        </Button>
      </div>
    </form>
  );
} 