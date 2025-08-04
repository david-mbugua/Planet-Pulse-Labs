'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function BiodiversityChart() {
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [{
      label: 'Biodiversity Index',
      data: [72, 74, 70, 68, 73, 75, 77],
      borderColor: '#8e2de2',
      backgroundColor: 'rgba(142,45,226,0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      }
    },
    scales: {
      y: {
        min: 60,
        max: 80,
        grid: {
          color: 'rgba(0,0,0,0.1)'
        }
      },
      x: {
        grid: {
          color: 'rgba(0,0,0,0.1)'
        }
      }
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Biodiversity Index</h2>
      <div style={{ height: '300px' }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}