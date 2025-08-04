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
  const getRiskConfig = (type: string) => {
    switch (type) {
      case 'high': 
        return {
          bgClass: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
          iconClass: 'bg-red-500 text-white',
          textClass: 'text-red-800 dark:text-red-200',
          icon: 'fas fa-exclamation-triangle',
          badgeClass: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
        };
      case 'medium': 
        return {
          bgClass: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
          iconClass: 'bg-yellow-500 text-white',
          textClass: 'text-yellow-800 dark:text-yellow-200',
          icon: 'fas fa-exclamation-circle',
          badgeClass: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
        };
      case 'low': 
        return {
          bgClass: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
          iconClass: 'bg-green-500 text-white',
          textClass: 'text-green-800 dark:text-green-200',
          icon: 'fas fa-info-circle',
          badgeClass: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
        };
      default: 
        return {
          bgClass: 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800',
          iconClass: 'bg-gray-500 text-white',
          textClass: 'text-gray-800 dark:text-gray-200',
          icon: 'fas fa-question-circle',
          badgeClass: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200'
        };
    }
  };

  return (
    <div className="chart-container">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg">
          <i className="fas fa-shield-alt text-white text-xl"></i>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Risk Assessment
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            AI-powered climate risk predictions
          </p>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-start space-x-3">
                <div className="skeleton h-10 w-10 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-1/3 rounded"></div>
                  <div className="skeleton h-3 w-full rounded"></div>
                  <div className="skeleton h-3 w-2/3 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : predictions.length > 0 ? (
        <div className="space-y-4">
          {predictions.map((prediction, index) => {
            const config = getRiskConfig(prediction.type);
            
            return (
              <div 
                key={index} 
                className={`p-4 rounded-lg border ${config.bgClass} hover:shadow-lg transition-all duration-300 animate-fade-in-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${config.iconClass} flex-shrink-0`}>
                    <i className={`${config.icon} text-lg`}></i>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-semibold ${config.textClass}`}>
                        {prediction.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.badgeClass}`}>
                        {prediction.type.toUpperCase()} RISK
                      </span>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3">
                      {prediction.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                        <i className="fas fa-clock text-blue-500"></i>
                        <span>Predicted for next 7-30 days</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="text-xs px-3 py-1 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-all text-gray-700 dark:text-gray-300">
                          <i className="fas fa-map-marker-alt mr-1 text-blue-500"></i>
                          View on Map
                        </button>
                        <button className="text-xs px-3 py-1 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-all text-gray-700 dark:text-gray-300">
                          <i className="fas fa-bell mr-1 text-blue-500"></i>
                          Set Alert
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-shield-alt text-gray-500 dark:text-gray-400 text-2xl"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No Risk Predictions Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Risk assessments will appear here based on current environmental data.
          </p>
        </div>
      )}

      {/* Risk summary footer */}
      {!loading && predictions.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">High Risk</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">Medium Risk</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">Low Risk</span>
              </div>
            </div>
            
            <button className="btn-primary text-sm px-4 py-2">
              <i className="fas fa-chart-line mr-2"></i>
              View Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}