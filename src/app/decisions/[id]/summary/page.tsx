import React from 'react';
import { Heading, Button } from '../../../../components';
import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import { authOptions } from '../../../api/auth/[...nextauth]/route';
import OutcomeBarChart from './OutcomeBarChart';

interface SummaryPageProps {
  params: any;
}

export default async function SummaryPage({ params }: SummaryPageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/');
  }

  // Fetch the decision, factors, outcomes, and all ratings
  const decision = await prisma.decision.findUnique({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      factors: {
        orderBy: { createdAt: 'asc' }
      },
      outcomes: {
        orderBy: { createdAt: 'asc' },
        include: {
          ratings: true
        }
      }
    }
  });

  if (!decision) {
    notFound();
  }

  // Check if all ratings are filled
  const allRatingsFilled = decision.outcomes.length > 0 && decision.factors.length > 0 &&
    decision.outcomes.every((outcome: any) =>
      decision.factors.every((factor: any) =>
        outcome.ratings.some((rating: any) => rating.factorId === factor.id)
      )
    );

  if (!allRatingsFilled) {
    redirect(`/decisions/${id}/rate`);
  }

  // Calculate weighted sum scores for each outcome and factor contributions
  const scores = decision.outcomes.map((outcome: any) => {
    let score = 0;
    for (const factor of decision.factors) {
      const rating = outcome.ratings.find((r: any) => r.factorId === factor.id)?.rating ?? 0;
      score += (factor.weight ?? 0) * rating;
    }
    return { id: outcome.id, text: outcome.text, score };
  });

  // Calculate factor contributions for each outcome
  const factorContributions: Record<string, any[]> = {};
  decision.outcomes.forEach((outcome: any) => {
    factorContributions[outcome.id] = decision.factors.map((factor: any) => {
      const rating = outcome.ratings.find((r: any) => r.factorId === factor.id)?.rating ?? 0;
      const contribution = (factor.weight ?? 0) * rating;
      return {
        factorId: factor.id,
        factorName: factor.text,
        contribution,
      };
    });
  });

  // Find the highest score(s)
  const maxScore = Math.max(...scores.map((s: any) => s.score));
  const bestOutcomes = scores.filter((s: any) => s.score === maxScore);

  // Sort scores by score (highest first)
  const sortedScores = [...scores].sort((a, b) => b.score - a.score);

  return (
    <main className="font-sans bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Heading size="lg">{decision.title}</Heading>
          <p className="text-gray-text mt-2">Status: {decision.status}</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-6 h-6 bg-green-600 text-white rounded-full text-sm font-medium">
              4
            </div>
            <div>
              <p className="text-sm text-green-800 font-medium">Step 4: Decision Summary</p>
              <p className="text-sm text-green-700 mt-1">
                Here's how your outcomes stack up based on your ratings and factor weights.
              </p>
            </div>
          </div>
        </div>

        {/* Recommendation Card */}
        <div className="mb-8 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Recommendation</h2>
              <p className="text-sm text-gray-500">Based on your factors and ratings</p>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            {bestOutcomes.length === 1 ? (
              <div className="space-y-2">
                <p className="text-sm text-green-800 font-medium">Recommended outcome:</p>
                <p className="text-lg font-semibold text-green-700">{bestOutcomes[0].text}</p>
                <p className="text-sm text-green-600">Score: {bestOutcomes[0].score} points</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-green-800 font-medium">It's a tie! The strongest outcomes are:</p>
                <div className="space-y-1">
                  {bestOutcomes.map((outcome: any) => (
                    <p key={outcome.id} className="text-lg font-semibold text-green-700">
                      • {outcome.text}
                    </p>
                  ))}
                </div>
                <p className="text-sm text-green-600">Score: {maxScore} points</p>
              </div>
            )}
          </div>
        </div>

        {/* Scores Table */}
        <div className="mb-8 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">All Outcomes Ranked</h3>
            <p className="text-sm text-gray-500">Sorted by total score</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Rank</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Outcome</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Score</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedScores.map((outcome: any, index: number) => {
                  const isBest = outcome.score === maxScore;
                  const percentage = Math.round((outcome.score / maxScore) * 100);
                  return (
                    <tr key={outcome.id} className={isBest ? 'bg-green-50' : 'bg-white'}>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {isBest && (
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          <span className={`text-sm font-medium ${isBest ? 'text-green-600' : 'text-gray-900'}`}>
                            #{index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-sm font-medium ${isBest ? 'text-green-700' : 'text-gray-900'}`}>
                          {outcome.text}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-sm font-semibold ${isBest ? 'text-green-600' : 'text-gray-900'}`}>
                          {outcome.score}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${isBest ? 'bg-green-500' : 'bg-gray-400'}`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">{percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart.js Bar Chart */}
        <div className="mb-8 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Visual Comparison</h3>
            <p className="text-sm text-gray-500">Bar chart showing relative performance</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <OutcomeBarChart 
              scores={scores} 
              factors={decision.factors}
              factorContributions={factorContributions}
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex gap-4">
            <a href={`/decisions/${id}`}>
              <Button variant="text" className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Decision
              </Button>
            </a>
            <a href={`/decisions/${id}/rate`}>
              <Button variant="text" className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Adjust Ratings
              </Button>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
} 