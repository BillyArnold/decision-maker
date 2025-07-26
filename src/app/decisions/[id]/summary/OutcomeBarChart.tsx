'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Factor {
  id: string;
  text: string;
  weight: number | null;
}

interface FactorContribution {
  factorId: string;
  factorName: string;
  contribution: number;
}

interface OutcomeBarChartProps {
  scores: { id: string; text: string; score: number }[];
  factors?: Factor[];
  factorContributions?: Record<string, FactorContribution[]>;
}

export default function OutcomeBarChart({ scores, factors, factorContributions }: OutcomeBarChartProps) {
  const maxScore = Math.max(...scores.map(s => s.score), 0);
  const yMax = Math.ceil((maxScore + 1) / 5) * 5 || 5;

  // Generate colors for factors
  const generateColors = (count: number) => {
    const colors = [
      'rgba(37, 99, 235, 0.7)',   // blue-600
      'rgba(16, 185, 129, 0.7)',  // green-500
      'rgba(245, 158, 11, 0.7)',  // yellow-500
      'rgba(239, 68, 68, 0.7)',   // red-500
      'rgba(139, 92, 246, 0.7)',  // purple-500
      'rgba(236, 72, 153, 0.7)',  // pink-500
      'rgba(14, 165, 233, 0.7)',  // sky-500
      'rgba(34, 197, 94, 0.7)',   // emerald-500
    ];
    
    // If we need more colors, generate them
    while (colors.length < count) {
      const hue = Math.floor(Math.random() * 360);
      colors.push(`hsla(${hue}, 70%, 60%, 0.7)`);
    }
    
    return colors.slice(0, count);
  };

  let data;
  let options;

  if (factors && factorContributions) {
    // Stacked bar chart with factor breakdowns
    const factorColors = generateColors(factors.length);
    
    data = {
      labels: scores.map(s => s.text),
      datasets: factors.map((factor, index) => ({
        label: factor.text,
        data: scores.map(score => {
          const contributions = factorContributions[score.id] || [];
          const factorContribution = contributions.find(c => c.factorId === factor.id);
          return factorContribution?.contribution || 0;
        }),
        backgroundColor: factorColors[index],
        borderRadius: 6,
      })),
    };

    options = {
      responsive: true,
      plugins: {
        legend: { 
          display: true,
          position: 'top' as const,
          labels: {
            usePointStyle: true,
            padding: 20,
          }
        },
        title: { display: false },
        tooltip: { 
          enabled: true,
          callbacks: {
            afterBody: (context: any) => {
              const total = context.reduce((sum: number, item: any) => sum + item.parsed.y, 0);
              return `Total: ${total.toFixed(1)}`;
            }
          }
        },
      },
      scales: {
        x: {
          stacked: true,
          grid: { color: '#e5e7eb' },
        },
        y: {
          stacked: true,
          beginAtZero: true,
          ticks: { stepSize: 5 },
          max: yMax,
          grid: { color: '#e5e7eb' },
        },
      },
    };
  } else {
    // Original simple bar chart
    data = {
      labels: scores.map(s => s.text),
      datasets: [
        {
          label: 'Score',
          data: scores.map(s => s.score),
          backgroundColor: 'rgba(37, 99, 235, 0.7)', // blue-600
          borderRadius: 6,
        },
      ],
    };

    options = {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: false },
        tooltip: { enabled: true },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 5 },
          max: yMax,
          grid: { color: '#e5e7eb' },
        },
        x: {
          grid: { color: '#e5e7eb' },
        },
      },
    };
  }

  return (
    <div style={{ height: 250 }}>
      <Bar data={data} options={options} />
    </div>
  );
} 