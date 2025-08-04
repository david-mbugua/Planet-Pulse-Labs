'use client';

interface AIRecommendationsProps {
  recommendations: string[];
  loading?: boolean;
}

export default function AIRecommendations({ recommendations, loading = false }: AIRecommendationsProps) {
  return (
    <div className="chart-container">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg">
          <i className="fas fa-brain text-white text-xl"></i>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            AI Recommendations
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Smart insights for climate action
          </p>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start space-x-3">
              <div className="skeleton h-4 w-4 rounded-full mt-1"></div>
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-full rounded"></div>
                <div className="skeleton h-4 w-3/4 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : recommendations.length > 0 ? (
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div 
              key={index} 
              className="flex items-start space-x-3 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex-shrink-0 mt-1">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                  <i className="fas fa-lightbulb text-white text-xs"></i>
                </div>
              </div>
              <div className="flex-1">
                <div 
                  className="text-gray-800 dark:text-gray-200 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: rec }}
                />
              </div>
              <button className="flex-shrink-0 p-2 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                <i className="fas fa-bookmark text-gray-400 hover:text-blue-500 transition-colors"></i>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-robot text-gray-500 dark:text-gray-400 text-2xl"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No Recommendations Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            AI recommendations will appear here based on current environmental data.
          </p>
        </div>
      )}

      {/* Footer with action buttons */}
      {!loading && recommendations.length > 0 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <i className="fas fa-clock text-blue-500"></i>
            <span>Updated 2 minutes ago</span>
          </div>
          <div className="flex space-x-2">
            <button className="btn-secondary text-sm px-3 py-2">
              <i className="fas fa-download mr-2 text-blue-500"></i>
              Export
            </button>
            <button className="btn-primary text-sm px-3 py-2">
              <i className="fas fa-sync-alt mr-2"></i>
              Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
}