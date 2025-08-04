'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapContainer, TileLayer, Circle, Rectangle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet icons in Next.js
const MapComponent = dynamic(
  () => import('./MapComponent'),
  { 
    ssr: false,
    loading: () => <div className="map-container bg-gray-200 flex items-center justify-center">Loading map...</div>
  }
);

interface GISMapProps {
  selectedLayer: string;
  onLayerChange: (layer: string) => void;
}

export default function GISMap({ selectedLayer, onLayerChange }: GISMapProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">GIS Interactive Map</h2>
        <div className="flex space-x-2">
          <select 
            value={selectedLayer}
            onChange={(e) => onLayerChange(e.target.value)}
            className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="treeLoss">Tree Loss</option>
            <option value="rainfall">Rainfall</option>
            <option value="temperature">Temperature</option>
            <option value="landUse">Land Use</option>
            <option value="biodiversity">Biodiversity</option>
          </select>
        </div>
      </div>
      <div className="map-container">
        <MapComponent selectedLayer={selectedLayer} />
      </div>
    </div>
  );
}