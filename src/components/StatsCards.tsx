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
  const getIconForStat = (id: string) => {
    switch (id) {
      case 'treeLoss':
        return 'fas fa-tree';
      case 'rainfall':
        return 'fas fa-cloud-rain';
      case 'temperature':
        return 'fas fa-thermometer-half';
      case 'deforestationAlerts':
        return 'fas fa-exclamation-triangle';
      default:
        return 'fas fa-chart-line';
    }
  };

  const getTrendColor = (trend: string) => {
    if (trend.includes('↑') || trend.includes('increase') || trend.includes('high')) {
      return 'text-red-600 dark:text-red-400';
    } else if (trend.includes('↓') || trend.includes('decrease') || trend.includes('low')) {
      return 'text-green-600 dark:text-green-400';
    }
    return 'text-gray-600 dark:text-gray-400';
  };

  const getTrendIcon = (trend: string) => {
    if (trend.includes('↑') || trend.includes('increase') || trend.includes('high')) {
      return 'fas fa-arrow-up';
    } else if (trend.includes('↓') || trend.includes('decrease') || trend.includes('low')) {
      return 'fas fa-arrow-down';
    }
    return 'fas fa-minus';
  };

  const getProgressColor = (id: string) => {
    switch (id) {
      case 'treeLoss':
        return 'bg-red-500';
      case 'rainfall':
        return 'bg-blue-500';
      case 'temperature':
        return 'bg-orange-500';
      case 'deforestationAlerts':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {data.map((stat, index) => (
        <div 
          key={stat.id} 
          className="metric-card animate-fade-in-up hover:scale-105 transition-all duration-300"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {stat.loading ? (
            // Loading skeleton
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="skeleton h-4 w-3/4 rounded"></div>
                <div className="skeleton h-8 w-8 rounded-full"></div>
              </div>
              <div className="skeleton h-8 w-1/2 rounded"></div>
              <div className="flex items-center space-x-2">
                <div className="skeleton h-3 w-3 rounded-full"></div>
                <div className="skeleton h-3 w-16 rounded"></div>
              </div>
            </div>
          ) : (
            <>
              {/* Header with title and icon */}
              <div className="flex items-center justify-between mb-4">
                <div className="metric-label">{stat.title}</div>
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <i className={`${getIconForStat(stat.id)} text-blue-600 dark:text-blue-400`}></i>
                </div>
              </div>

              {/* Main value */}
              <div className="metric-value mb-2">
                {stat.value}
              </div>

              {/* Trend indicator */}
              {stat.trend && (
                <div className="flex items-center space-x-2">
                  <div className={`flex items-center space-x-1 ${getTrendColor(stat.trend)}`}>
                    <i className={`${getTrendIcon(stat.trend)} text-xs`}></i>
                    <span className="text-sm font-medium">
                      {stat.trend}
                    </span>
                  </div>
                </div>
              )}

              {/* Progress bar for visual indicator */}
              <div className="mt-4 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${getProgressColor(stat.id)}`}
                  style={{ 
                    width: `${Math.min(Math.max(Math.random() * 100, 30), 90)}%` 
                  }}
                />
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}