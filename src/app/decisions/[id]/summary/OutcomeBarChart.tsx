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

interface OutcomeBarChartProps {
  scores: { id: string; text: string; score: number }[];
}

export default function OutcomeBarChart({ scores }: OutcomeBarChartProps) {
  const maxScore = Math.max(...scores.map(s => s.score), 0);
  const yMax = Math.ceil((maxScore + 1) / 5) * 5 || 5;

  const data = {
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

  const options = {
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

  return (
    <div style={{ height: 250 }}>
      <Bar data={data} options={options} />
    </div>
  );
} 