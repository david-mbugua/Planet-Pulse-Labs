'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import StatsCards from '@/components/StatsCards';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 dark:bg-gray-700 animate-pulse rounded-lg flex items-center justify-center text-gray-500">Loading map...</div>
});
import AIRecommendations from '@/components/AIRecommendations';
import CarbonCreditEstimator from '@/components/CarbonCreditEstimator';
import MarketPrices from '@/components/MarketPrices';
import Marketplace from '@/components/Marketplace';
import RiskPrediction from '@/components/RiskPrediction';
import BiodiversityChart from '@/components/BiodiversityChart';
import {
  fetchRainfall,
  fetchTemperature,
  fetchDeforestationAlerts,
  fetchTreeLoss,
  generateAIRecommendations,
  fetchMarketPrices
} from '@/utils/api';

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedMapLayer, setSelectedMapLayer] = useState<'treeLoss' | 'rainfall' | 'temperature' | 'landUse' | 'biodiversity' | 'storyMaps'>('storyMaps');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statsData, setStatsData] = useState([
    { id: 'treeLoss', title: 'Tree Cover Loss', value: 'Loading...', trend: '', loading: true },
    { id: 'rainfall', title: 'Rainfall (mm)', value: 'Loading...', trend: '', loading: true },
    { id: 'temperature', title: 'Temperature (°C)', value: 'Loading...', trend: '', loading: true },
    { id: 'deforestationAlerts', title: 'Deforestation Alerts', value: 'Loading...', trend: '', loading: true }
  ]);
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);
  const [marketPrices, setMarketPrices] = useState<Array<{crop: string, price: string}>>([]);
  const [loading, setLoading] = useState(true);

  const riskPredictions = [
    { type: 'high' as const, title: 'High Risk', description: 'Flooding in Kisumu (next 7 days)' },
    { type: 'medium' as const, title: 'Medium Risk', description: 'Drought in Turkana (next 30 days)' },
    { type: 'low' as const, title: 'Low Risk', description: 'Pest outbreak in Embu (next 14 days)' }
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const [treeLoss, rainfall, temperature, deforestationAlerts, aiRecs, prices] = await Promise.all([
        fetchTreeLoss(),
        fetchRainfall(),
        fetchTemperature(),
        fetchDeforestationAlerts(),
        generateAIRecommendations(),
        fetchMarketPrices()
      ]);

      setStatsData([
        { id: 'treeLoss', title: 'Tree Cover Loss', value: `${treeLoss.loss} ha`, trend: treeLoss.trend, loading: false },
        { id: 'rainfall', title: 'Rainfall (mm)', value: `${rainfall.rainfall} mm`, trend: rainfall.trend, loading: false },
        { id: 'temperature', title: 'Temperature (°C)', value: `${temperature.temperature}°C`, trend: temperature.trend, loading: false },
        { id: 'deforestationAlerts', title: 'Deforestation Alerts', value: `${deforestationAlerts.alerts}`, trend: deforestationAlerts.trend, loading: false }
      ]);

      setAiRecommendations(aiRecs);
      setMarketPrices(prices);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="p-6 space-y-6 stagger-animation">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                Climate Dashboard
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                Real-time environmental monitoring and agricultural insights
              </p>
            </div>
            <StatsCards data={statsData} />
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Environmental Layers
                </h3>
                <select
                  value={selectedMapLayer}
                  onChange={(e) => setSelectedMapLayer(e.target.value as 'treeLoss' | 'rainfall' | 'temperature' | 'landUse' | 'biodiversity' | 'storyMaps')}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="storyMaps">Team Spatial Analysis</option>
                  <option value="treeLoss">Tree Loss</option>
                  <option value="rainfall">Rainfall</option>
                  <option value="temperature">Temperature</option>
                  <option value="landUse">Land Use</option>
                  <option value="biodiversity">Biodiversity</option>
                </select>
              </div>
              <div className="h-96">
                <MapComponent selectedLayer={selectedMapLayer} />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AIRecommendations recommendations={aiRecommendations} loading={loading} />
              <RiskPrediction predictions={riskPredictions} loading={loading} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CarbonCreditEstimator />
              <MarketPrices prices={marketPrices} loading={loading} />
            </div>
            <BiodiversityChart />
          </div>
        );
      case 'map':
        return (
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                GIS Mapping
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                Interactive satellite imagery and environmental data visualization
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Environmental Layers
                </h3>
                <select
                  value={selectedMapLayer}
                  onChange={(e) => setSelectedMapLayer(e.target.value as 'treeLoss' | 'rainfall' | 'temperature' | 'landUse' | 'biodiversity' | 'storyMaps')}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="storyMaps">Team Spatial Analysis</option>
                  <option value="treeLoss">Tree Loss</option>
                  <option value="rainfall">Rainfall</option>
                  <option value="temperature">Temperature</option>
                  <option value="landUse">Land Use</option>
                  <option value="biodiversity">Biodiversity</option>
                </select>
              </div>
              <div className="h-96">
                <MapComponent selectedLayer={selectedMapLayer} />
              </div>
            </div>
          </div>
        );
      case 'ai':
        return (
          <div className="p-6 space-y-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                AI Insights
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                Machine learning predictions and smart recommendations
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AIRecommendations recommendations={aiRecommendations} loading={loading} />
              <RiskPrediction predictions={riskPredictions} loading={loading} />
            </div>
          </div>
        );
      case 'marketplace':
        return (
          <div className="p-6">
            <Marketplace />
          </div>
        );
      case 'carbon':
        return (
          <div className="p-6 space-y-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                Carbon Credits
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                Environmental impact tracking and carbon credit opportunities
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CarbonCreditEstimator />
              <BiodiversityChart />
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6">
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-unep-500 to-environmental-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-tools text-white text-2xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                This section is currently under development. Check back soon for new features.
              </p>
              <button 
                onClick={() => setActiveSection('dashboard')}
                className="btn btn-primary px-6 py-2"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-dark-bg">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-80">
        <Header 
          onRefreshData={loadData} 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}


