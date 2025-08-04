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
    <div className="chart-container mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
            <i className="fas fa-globe-africa text-white text-xl"></i>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">GIS Interactive Map</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Real-time environmental data visualization</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <select 
            value={selectedLayer}
            onChange={(e) => onLayerChange(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
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