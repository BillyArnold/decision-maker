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

  // Calculate weighted sum scores for each outcome
  const scores = decision.outcomes.map((outcome: any) => {
    let score = 0;
    for (const factor of decision.factors) {
      const rating = outcome.ratings.find((r: any) => r.factorId === factor.id)?.rating ?? 0;
      score += (factor.weight ?? 0) * rating;
    }
    return { id: outcome.id, text: outcome.text, score };
  });

  // Find the highest score(s)
  const maxScore = Math.max(...scores.map((s: any) => s.score));
  const bestOutcomes = scores.filter((s: any) => s.score === maxScore);

  return (
    <main className="font-sans bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Heading size="lg">Summary</Heading>
        <p className="text-gray-text mt-2 mb-6">Here’s how your outcomes stack up based on your ratings and factor weights.</p>

        {/* Recommendation */}
        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded">
          {bestOutcomes.length === 1 ? (
            <span>
              <b>Recommended outcome:</b> <span className="text-green-700 font-semibold">{bestOutcomes[0].text}</span> (score: {bestOutcomes[0].score})
            </span>
          ) : (
            <span>
              <b>It’s a tie!</b> The strongest outcomes are: {bestOutcomes.map((o: any) => <span key={o.id} className="text-green-700 font-semibold">{o.text}</span> ).reduce((prev: any, curr: any) => [prev, ', ', curr])} (score: {maxScore})
            </span>
          )}
        </div>

        {/* Scores Table */}
        <div className="mb-8">
          <table className="w-full border text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4">Outcome</th>
                <th className="py-2 px-4">Score</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((outcome: any) => (
                <tr key={outcome.id}>
                  <td className="py-2 px-4">{outcome.text}</td>
                  <td className="py-2 px-4">{outcome.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Chart.js Bar Chart */}
        <div className="mb-8 bg-gray-50 border border-gray-200 rounded p-4">
          <OutcomeBarChart scores={scores} />
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <a href={`/decisions/${id}`}> <Button variant="text">Back to Decision</Button> </a>
          <a href={`/decisions/${id}/rate`}> <Button variant="text">Adjust Ratings</Button> </a>
        </div>
      </div>
    </main>
  );
} 