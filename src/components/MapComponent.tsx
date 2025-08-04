'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Rectangle, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapLayersProps {
  selectedLayer: string;
}

function MapLayers({ selectedLayer }: MapLayersProps) {
  const map = useMap();

  useEffect(() => {
    // Clear existing layers except base tile layer
    map.eachLayer((layer) => {
      if (layer instanceof L.Circle || layer instanceof L.Rectangle) {
        map.removeLayer(layer);
      }
    });

    // Add appropriate layer based on selection
    switch (selectedLayer) {
      case 'treeLoss':
        L.circle([0, 37], { radius: 50000, color: 'red', fillOpacity: 0.3 })
          .bindPopup('Tree Loss Data - Central Kenya')
          .addTo(map);
        break;
      case 'rainfall':
        L.circle([0.5, 37.5], { radius: 40000, color: 'blue', fillOpacity: 0.3 })
          .bindPopup('Rainfall Data - Mt. Kenya Region')
          .addTo(map);
        break;
      case 'temperature':
        L.circle([-0.5, 36.5], { radius: 40000, color: 'orange', fillOpacity: 0.3 })
          .bindPopup('Temperature Data - Nairobi Region')
          .addTo(map);
        break;
      case 'landUse':
        L.rectangle([[0.2, 36.8], [0.8, 37.2]], { color: 'green', weight: 2, fillOpacity: 0.2 })
          .bindPopup('Agricultural Land Use')
          .addTo(map);
        break;
      case 'biodiversity':
        L.circle([0, 37], { radius: 30000, color: 'purple', fillOpacity: 0.3 })
          .bindPopup('Biodiversity Hotspot')
          .addTo(map);
        break;
    }
  }, [selectedLayer, map]);

  return null;
}

interface MapComponentProps {
  selectedLayer: string;
}

export default function MapComponent({ selectedLayer }: MapComponentProps) {
  return (
    <MapContainer 
      center={[0, 37]} 
      zoom={6} 
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapLayers selectedLayer={selectedLayer} />
    </MapContainer>
  );
}