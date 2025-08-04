'use client';

interface StatCardData {
  id: string;
  title: string;
  value: string;
  trend: string;
  loading?: boolean;
}

interface StatsCardsProps {
  data: StatCardData[];
}

export default function StatsCards({ data }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {data.map((stat) => (
        <div key={stat.id} className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm">{stat.title}</p>
          <h3 className="text-2xl font-bold text-gray-800">
            {stat.loading ? 'Loading...' : stat.value}
          </h3>
          <p className="text-sm mt-1">
            {stat.loading ? '' : `Trend: ${stat.trend}`}
          </p>
        </div>
      ))}
    </div>
  );
}