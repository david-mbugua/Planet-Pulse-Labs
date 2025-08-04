'use client';

interface RiskPredictionProps {
  predictions: {
    type: 'high' | 'medium' | 'low';
    title: string;
    description: string;
  }[];
  loading?: boolean;
}

export default function RiskPrediction({ predictions, loading = false }: RiskPredictionProps) {
  const getRiskClass = (type: string) => {
    switch (type) {
      case 'high': return 'risk-high';
      case 'medium': return 'risk-medium';
      case 'low': return 'risk-low';
      default: return 'risk-medium';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">AI Risk Prediction</h2>
      <div className="flex flex-col md:flex-row gap-4">
        {loading ? (
          <div className="text-center w-full">Loading risk predictions...</div>
        ) : (
          predictions.map((prediction, index) => (
            <div 
              key={index} 
              className={`prediction-card ${getRiskClass(prediction.type)} p-4 rounded-lg flex-1`}
            >
              <b>{prediction.title}:</b> {prediction.description}
            </div>
          ))
        )}
      </div>
    </div>
  );
}