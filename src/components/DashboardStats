'use client';

import { useEffect, useState } from 'react';
import StatsCards from './StatsCards';
import {
  fetchKituiRainfall,
  fetchKituiTemperature,
  fetchFAOCropStats,
  fetchBiodiversity,
  fetchINatObservations
} from '../api/environmentalData';

export default function DashboardStats() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const [
        rainfall,
        temperature,
        fao,
        gbif,
        inat
      ] = await Promise.all([
        fetchKituiRainfall(),
        fetchKituiTemperature(),
        fetchFAOCropStats(),
        fetchBiodiversity(),
        fetchINatObservations()
      ]);

      setData([
        {
          id: 'rainfall',
          title: 'Rainfall',
          value: rainfall.rainfall + ' mm',
          trend: rainfall.trend,
          scope: 'Kitui Town (centroid)'
        },
        {
          id: 'temperature',
          title: 'Temperature',
          value: temperature.temperature + '°C',
          trend: temperature.trend,
          scope: 'Kitui Town (centroid)'
        },
        {
          id: 'fao_maize',
          title: 'Maize Yield',
          value: fao?.data?.[0]?.value ? fao.data[0].value + ' tons' : 'N/A',
          trend: '—',
          scope: fao.scope
        },
        {
          id: 'biodiversity',
          title: 'Biodiversity (GBIF)',
          value: gbif.speciesCount?.toLocaleString() + ' records',
          trend: '—',
          scope: gbif.scope
        },
        {
          id: 'inat',
          title: 'iNaturalist Observations',
          value: inat.totalObservations?.toLocaleString() + ' obs',
          trend: '—',
          scope: inat.scope
        },
      ]);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Map loading prop if you want skeletons
  const statsWithLoading = data.map(stat => ({ ...stat, loading }));

  return <StatsCards data={statsWithLoading} />;
}
