// API Integration functions for fetching real environmental data

export interface RainfallData {
  rainfall: number;
  trend: string;
}

export interface TemperatureData {
  temperature: number;
  trend: string;
}

export interface DeforestationData {
  alerts: number;
  trend: string;
}

export interface TreeLossData {
  loss: number;
  trend: string;
}

export interface BiodiversityData {
  speciesCount: number;
}

export interface INaturalistData {
  totalObservations: number;
}

export interface FAOData {
  data: Array<{
    item: string;
    value: number;
  }>;
}

// Open-Meteo Weather API (Free, no key needed)
export async function fetchRainfall(): Promise<RainfallData> {
  try {
    // Nairobi, Kenya coordinates
    const url = "https://api.open-meteo.com/v1/forecast?latitude=-1.286389&longitude=36.817223&hourly=precipitation";
    const res = await fetch(url);
    const data = await res.json();
    
    // Get today's total rainfall (sum of hourly)
    const rainfall = data.hourly?.precipitation?.slice(0, 24).reduce((a: number, b: number) => a + b, 0) || 0;
    return { rainfall: Math.round(rainfall), trend: '+0%' };
  } catch (error) {
    console.error('Error fetching rainfall data:', error);
    return { rainfall: 45, trend: '+12%' }; // fallback
  }
}

export async function fetchTemperature(): Promise<TemperatureData> {
  try {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=-1.286389&longitude=36.817223&hourly=temperature_2m";
    const res = await fetch(url);
    const data = await res.json();
    
    // Get current temperature (first hour)
    const temperature = data.hourly?.temperature_2m?.[0] || 0;
    return { temperature: Math.round(temperature), trend: '+0°C' };
  } catch (error) {
    console.error('Error fetching temperature data:', error);
    return { temperature: 24, trend: '+2°C' }; // fallback
  }
}

export async function fetchDeforestationAlerts(): Promise<DeforestationData> {
  try {
    // For demo, using mock data since GFW requires API key
    // In production, you would use Global Forest Watch API
    return { alerts: 12, trend: '-1%' };
  } catch (error) {
    console.error('Error fetching deforestation data:', error);
    return { alerts: 12, trend: '-1%' };
  }
}

export async function fetchTreeLoss(): Promise<TreeLossData> {
  try {
    // Mock data - in production, use Global Forest Watch API
    return { loss: 1234, trend: '+5%' };
  } catch (error) {
    console.error('Error fetching tree loss data:', error);
    return { loss: 1234, trend: '+5%' };
  }
}

// GBIF API (Free, no key needed)
export async function fetchBiodiversity(): Promise<BiodiversityData> {
  try {
    const url = "https://api.gbif.org/v1/occurrence/search?country=KE&limit=0";
    const res = await fetch(url);
    const data = await res.json();
    return { speciesCount: data.count || 0 };
  } catch (error) {
    console.error('Error fetching biodiversity data:', error);
    return { speciesCount: 150000 }; // fallback
  }
}

// iNaturalist API (Free, no key needed)
export async function fetchINatObservations(): Promise<INaturalistData> {
  try {
    const url = "https://api.inaturalist.org/v1/observations?place_id=795&per_page=1";
    const res = await fetch(url);
    const data = await res.json();
    return { totalObservations: data.total_results || 0 };
  } catch (error) {
    console.error('Error fetching iNaturalist data:', error);
    return { totalObservations: 45000 }; // fallback
  }
}

// FAO API (Free, no key needed but may have rate limits)
export async function fetchFAOCropStats(): Promise<FAOData> {
  try {
    // Kenya (area=110), Maize (item=15), latest year
    const url = "https://fenixservices.fao.org/faostat/api/v1/en/data/QC?area=110&item=15&year=2021";
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching FAO data:', error);
    return { data: [{ item: 'Maize', value: 500000 }] }; // fallback
  }
}

// Generate AI recommendations based on fetched data
export async function generateAIRecommendations(): Promise<string[]> {
  try {
    const [rain, temp, fao, gbif, inat] = await Promise.all([
      fetchRainfall(),
      fetchTemperature(),
      fetchFAOCropStats(),
      fetchBiodiversity(),
      fetchINatObservations()
    ]);

    const recommendations: string[] = [];

    // Weather-based recommendations
    if (rain.rainfall < 10) {
      recommendations.push("💧 Low rainfall detected. Consider supplemental irrigation this week.");
    } else {
      recommendations.push("🌦️ Adequate rainfall forecasted. Monitor for waterlogging in lowlands.");
    }

    if (temp.temperature > 30) {
      recommendations.push("🔥 High temperatures expected. Mulch crops to reduce soil evaporation.");
    } else if (temp.temperature < 18) {
      recommendations.push("❄️ Cool weather ahead. Delay planting heat-loving crops.");
    }

    // Crop production recommendations
    if (fao && fao.data && fao.data.length > 0) {
      const maize = fao.data.find(d => d.item === "Maize");
      if (maize && maize.value < 1000000) {
        recommendations.push("🌽 Maize yields are below average. Consider improved seed varieties.");
      } else {
        recommendations.push("🌾 Maize production is stable. Diversify with legumes for soil health.");
      }
    }

    // Biodiversity recommendations
    if (gbif.speciesCount < 100000) {
      recommendations.push("🦋 Biodiversity is low. Plant native trees and reduce pesticide use.");
    } else {
      recommendations.push("🌱 Biodiversity is healthy. Maintain current conservation practices.");
    }

    if (inat.totalObservations < 50000) {
      recommendations.push("🔍 Encourage community to record more wildlife observations on iNaturalist.");
    }

    // General recommendations
    recommendations.push("🛑 Watch for deforestation alerts and report illegal logging.");
    recommendations.push("📈 Check live market prices before selling your harvest.");

    return recommendations;
  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    return [
      "💧 Monitor water levels and consider rainwater harvesting.",
      "🌱 Plant cover crops to improve soil health and biodiversity.",
      "📊 Use precision agriculture tools for optimal resource management.",
      "🔄 Implement crop rotation to maintain soil fertility.",
      "🌿 Establish windbreaks with native tree species."
    ];
  }
}

// Market prices (mock data - replace with real API)
export async function fetchMarketPrices() {
  try {
    // In production, use a real commodity prices API
    return [
      { crop: "Maize", price: "KSh 3,200/90kg" },
      { crop: "Beans", price: "KSh 7,000/90kg" },
      { crop: "Wheat", price: "KSh 4,500/90kg" },
      { crop: "Sorghum", price: "KSh 2,800/90kg" }
    ];
  } catch (error) {
    console.error('Error fetching market prices:', error);
    return [
      { crop: "Maize", price: "KSh 3,200/90kg" },
      { crop: "Beans", price: "KSh 7,000/90kg" },
      { crop: "Wheat", price: "KSh 4,500/90kg" },
      { crop: "Sorghum", price: "KSh 2,800/90kg" }
    ];
  }
}