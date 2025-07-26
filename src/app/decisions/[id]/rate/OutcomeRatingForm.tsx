'use client';

import React, { useState, useTransition } from 'react';
import { Button, RatingButton } from '../../../../components';
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
      router.push(`/decisions/${decisionId}/summary`);
    } catch (error) {
      console.error('Error updating ratings:', error);
      setIsSubmitting(false);
    }
  };

  const allRatingsComplete = outcomes.every(outcome => 
    factors.every(factor => ratings[outcome.id]?.[factor.id])
  );

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

  const getRatingColor = (rating: number) => {
    if (rating <= 2) return 'text-blue-600';
    if (rating <= 3) return 'text-green-600';
    if (rating <= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRatingLabel = (rating: number) => {
    if (rating <= 2) return 'Poor';
    if (rating <= 3) return 'Fair';
    if (rating <= 4) return 'Good';
    return 'Excellent';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {outcomes.map((outcome, outcomeIndex) => (
        <div key={outcome.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
          {/* Outcome Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full text-sm font-medium">
              {outcomeIndex + 1}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{outcome.text}</h3>
              <p className="text-sm text-gray-500">Outcome {outcomeIndex + 1} of {outcomes.length}</p>
            </div>
          </div>
          
          {/* Factors Rating Section */}
          <div className="space-y-4">
            {factors.map((factor) => {
              const currentRating = ratings[outcome.id]?.[factor.id];
              return (
                <div key={factor.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{factor.text}</h4>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImportanceColor(factor.weight || 0)}`}>
                          {getImportanceLabel(factor.weight || 0)} Importance
                        </span>
                        <span className="text-sm text-gray-500">({factor.weight}/5)</span>
                      </div>
                    </div>
                    {currentRating && (
                      <div className="text-right">
                        <span className={`text-sm font-medium ${getRatingColor(currentRating)}`}>
                          {getRatingLabel(currentRating)}
                        </span>
                        <p className="text-xs text-gray-500">({currentRating}/5)</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Rating Buttons */}
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">Rate this outcome:</span>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <RatingButton
                          key={rating}
                          value={rating}
                          selected={currentRating === rating}
                          onClick={() => handleRatingChange(outcome.id, factor.id, rating)}
                          disabled={isSubmitting}
                          className="w-10 h-10"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Progress and Action Buttons */}
      <div className="pt-6 border-t border-gray-200">
        <div className="space-y-4">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${allRatingsComplete ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm text-gray-600">
                {allRatingsComplete ? 'All ratings complete' : 'Complete all ratings to proceed'}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {outcomes.length * factors.length} total ratings
            </span>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-4">
            <button 
              type="submit" 
              disabled={isSubmitting || !allRatingsComplete}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {isSubmitting ? 'Saving...' : 'Save Ratings & View Summary'}
            </button>
            <Button 
              variant="text" 
              onClick={() => router.push(`/decisions/${decisionId}/outcomes`)}
              disabled={isSubmitting}
            >
              Back to Outcomes
            </Button>
            <Button 
              variant="text" 
              onClick={() => router.push(`/decisions/${decisionId}/summary`)}
              disabled={isSubmitting || !allRatingsComplete}
            >
              View Summary
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
} 