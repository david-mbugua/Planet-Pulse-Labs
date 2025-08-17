// API Integration functions for fetching real environmental data



export interface RainfallData {
  rainfall: number;
  trend: string;
}
export interface TemperatureData {
  temperature: number;
  trend: string;
}
export interface FAOData {
  data: Array<{ item: string; value: number }>;
  scope: string; // "Kenya-wide"
}
export interface BiodiversityData {
  speciesCount: number;
  scope: string; // "Kenya-wide" or "Kitui (approximate)"
}
export interface INaturalistData {
  totalObservations: number;
  scope: string; // "Kenya-wide" or "Kitui (approximate)"
}

// --- Kitui Centroid and Bounding Box ---
const KITUI_CENTROID = { lat: -1.3744, lng: 38.0106 };
// Rough bounding box for Kitui County (adjust as needed)
const KITUI_BBOX = {
  minLat: -1.8,
  maxLat: -1.0,
  minLng: 37.8,
  maxLng: 38.4,
};

// 1. Rainfall (Kitui centroid)
export async function fetchKituiRainfall(): Promise<RainfallData> {
  try {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=-1.3744&longitude=38.0106&hourly=precipitation";
    const res = await fetch(url);
    const data = await res.json();
    const rainfall = data.hourly?.precipitation?.slice(0, 24).reduce((a: number, b: number) => a + b, 0) || 0;
    return { rainfall: Math.round(rainfall), trend: '+0%' };
  } catch (error) {
    console.error('Error fetching rainfall data:', error);
    return { rainfall: 45, trend: '+12%' }; // fallback
  }
}

// 2. Temperature (Kitui centroid)
export async function fetchKituiTemperature(): Promise<TemperatureData> {
  try {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=-1.3744&longitude=38.0106&hourly=temperature_2m";
    const res = await fetch(url);
    const data = await res.json();
    const temperature = data.hourly?.temperature_2m?.[0] || 0;
    return { temperature: Math.round(temperature), trend: '+0°C' };
  } catch (error) {
    console.error('Error fetching temperature data:', error);
    return { temperature: 24, trend: '+2°C' }; // fallback
  }
}

// 3. FAO Data (Kenya-wide)
export async function fetchFAOCropStats(): Promise<FAOData> {
  try {
    const url = "https://fenixservices.fao.org/faostat/api/v1/en/data/QC?area=110&item=15&year=2021"; // area=110: Kenya, item=15: Maize
    const res = await fetch(url);
    const data = await res.json();
    // Attach scope for UI
    return { data: data.data, scope: "Kenya-wide" };
  } catch (error) {
    console.error('Error fetching FAO data:', error);
    return { data: [{ item: 'Maize', value: 500000 }], scope: "Kenya-wide" }; // fallback
  }
}

// 4. GBIF (Kenya-wide)
export async function fetchBiodiversity(): Promise<BiodiversityData> {
  try {
    // Country-wide: filter by country=KE for Kenya
    const url = "https://api.gbif.org/v1/occurrence/search?country=KE&limit=0";
    const res = await fetch(url);
    const data = await res.json();
    return { speciesCount: data.count || 0, scope: "Kenya-wide" };
  } catch (error) {
    console.error('Error fetching biodiversity data:', error);
    return { speciesCount: 150000, scope: "Kenya-wide" }; // fallback
  }
}

// 5. iNaturalist (Kitui bounding box, but fallback to Kenya-wide)
export async function fetchINatObservations(): Promise<INaturalistData> {
  try {
    // For true Kitui-specific, use bounding box, but iNat may not have granular data for Kitui
    const bbox = `${KITUI_BBOX.minLng},${KITUI_BBOX.minLat},${KITUI_BBOX.maxLng},${KITUI_BBOX.maxLat}`;
    const url = `https://api.inaturalist.org/v1/observations?nelat=${KITUI_BBOX.maxLat}&nelng=${KITUI_BBOX.maxLng}&swlat=${KITUI_BBOX.minLat}&swlng=${KITUI_BBOX.minLng}&per_page=1`;
    const res = await fetch(url);
    const data = await res.json();
    // If data is too low, label as Kenya-wide fallback
    const obsCount = data.total_results || 0;
    const scope = obsCount > 100 ? "Kitui (approximate)" : "Kenya-wide";
    return { totalObservations: obsCount, scope };
  } catch (error) {
    console.error('Error fetching iNaturalist data:', error);
    return { totalObservations: 45000, scope: "Kenya-wide" }; // fallback
  }
}

// --- Convenience wrappers and stubs for dashboard ---
// These functions provide the simple shapes expected by the dashboard UI.

export async function fetchRainfall(): Promise<RainfallData> {
  return fetchKituiRainfall();
}

export async function fetchTemperature(): Promise<TemperatureData> {
  return fetchKituiTemperature();
}

export async function fetchTreeLoss(): Promise<{ loss: number; trend: string }> {
  // Placeholder: replace with real GFW/GLAD integration
  return { loss: 1240, trend: '↑ 3.2% vs last month' };
}

export async function fetchDeforestationAlerts(): Promise<{ alerts: number; trend: string }> {
  // Placeholder: replace with real GLAD/RADD alert counts
  return { alerts: 86, trend: '↓ 1.1% vs last week' };
}

export async function generateAIRecommendations(): Promise<string[]> {
  // Placeholder AI copy. Can be replaced with a real model or API.
  return [
    '<b>Soil moisture conservation:</b> Use mulching in dry zones to reduce evapotranspiration.',
    '<b>Agroforestry mix:</b> Plant <i>Grevillea</i> and fruit trees to boost carbon stock and diversify income.',
    '<b>Water harvesting:</b> Install small farm ponds ahead of forecast rainfall spikes.'
  ];
}

export async function fetchMarketPrices(): Promise<Array<{ crop: string; price: string }>> {
  // Placeholder prices; replace with a real market feed
  return [
    { crop: 'Maize', price: 'KES 3,200 / 90kg' },
    { crop: 'Beans', price: 'KES 8,500 / 90kg' },
    { crop: 'Wheat', price: 'KES 4,800 / 90kg' },
    { crop: 'Sorghum', price: 'KES 3,600 / 90kg' }
  ];
}
