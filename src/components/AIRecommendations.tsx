'use client';

interface AIRecommendationsProps {
  recommendations: string[];
  loading?: boolean;
}

export default function AIRecommendations({ recommendations, loading = false }: AIRecommendationsProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">AI Recommendations</h2>
      <ul className="list-disc ml-6 text-gray-700">
        {loading ? (
          <li>Loading recommendations...</li>
        ) : (
          recommendations.map((rec, index) => (
            <li key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: rec }} />
          ))
        )}
      </ul>
    </div>
  );
}