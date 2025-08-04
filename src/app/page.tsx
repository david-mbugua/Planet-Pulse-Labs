'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import StatsCards from '@/components/StatsCards';
import GISMap from '@/components/GISMap';
import AIRecommendations from '@/components/AIRecommendations';
import CarbonCreditEstimator from '@/components/CarbonCreditEstimator';
import MarketPrices from '@/components/MarketPrices';
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
  const [selectedMapLayer, setSelectedMapLayer] = useState('treeLoss');
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
          <div className="main-content p-6">
            <StatsCards data={statsData} />
            <GISMap selectedLayer={selectedMapLayer} onLayerChange={setSelectedMapLayer} />
            <AIRecommendations recommendations={aiRecommendations} loading={loading} />
            <CarbonCreditEstimator />
            <MarketPrices prices={marketPrices} loading={loading} />
            <RiskPrediction predictions={riskPredictions} loading={loading} />
            <BiodiversityChart />
          </div>
        );
      case 'map':
        return (
          <div className="main-content p-6">
            <GISMap selectedLayer={selectedMapLayer} onLayerChange={setSelectedMapLayer} />
          </div>
        );
      case 'ai':
        return (
          <div className="main-content p-6">
            <AIRecommendations recommendations={aiRecommendations} loading={loading} />
            <RiskPrediction predictions={riskPredictions} loading={loading} />
          </div>
        );
      case 'marketplace':
        return (
          <div className="main-content p-6">
            <MarketPrices prices={marketPrices} loading={loading} />
          </div>
        );
      case 'carbon':
        return (
          <div className="main-content p-6">
            <CarbonCreditEstimator />
            <BiodiversityChart />
          </div>
        );
      default:
        return (
          <div className="main-content p-6">
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
              </h2>
              <p className="text-gray-600">This section is under development.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 overflow-auto">
        <Header onRefreshData={loadData} />
        {renderContent()}
      </div>
    </div>
  );
}
