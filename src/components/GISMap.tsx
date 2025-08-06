'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import CarbonCreditEstimator from './CarbonCreditEstimator';
import * as turf from '@turf/turf';
import { fetchKituiRainfall, fetchKituiTemperature } from '../api/environmentalData'; // Adjust import path as needed

// --- Kitui boundary polygon (demo, use real GeoJSON in production) ---
const kituiBoundary = {
  "type": "Feature",
  "properties": { "name": "Kitui" },
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [37.8, -1.0], [38.4, -1.0], [38.4, -1.8], [37.8, -1.8], [37.8, -1.0]
    ]]
  }
};
const KITUI_CENTER = [-1.3744, 38.0106];

// --- Simulated tree data ---
const trees = [
  { lat: -1.20, lng: 38.10, species: 'Mango' },
  { lat: -1.30, lng: 38.05, species: 'Mango' },
  { lat: -1.33, lng: 38.13, species: 'Orange' },
  { lat: -1.45, lng: 38.21, species: 'Grevillea' },
  { lat: -1.41, lng: 38.19, species: 'Mango' },
  { lat: -1.62, lng: 37.95, species: 'Orange' },
  { lat: -1.77, lng: 38.20, species: 'Eucalyptus' },
  { lat: -1.54, lng: 38.33, species: 'Acacia' },
];

// --- Carbon sequestration per species (kg CO₂/year) ---
const SPECIES_CO2_RATES: Record<string, number> = {
  'Mango': 22,
  'Orange': 20,
  'Grevillea': 24,
  'Acacia': 18,
  'Eucalyptus': 30,
};

// --- Count trees in Kitui using turf.js ---
const kituiPolygon = turf.polygon([kituiBoundary.geometry.coordinates[0]]);
const treesInKitui = trees.filter(tree =>
  turf.booleanPointInPolygon(turf.point([tree.lng, tree.lat]), kituiPolygon)
);
const treeCount = treesInKitui.length;

export default function KituiMap() {
  const [rainfall, setRainfall] = useState<number | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);

  // --- Fetch API data for Kitui centroid
  useEffect(() => {
    fetchKituiRainfall().then(data => setRainfall(data.rainfall));
    fetchKituiTemperature().then(data => setTemperature(data.temperature));
  }, []);

  return (
    <div>
      <MapContainer center={KITUI_CENTER} zoom={9} style={{ height: "500px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <GeoJSON data={kituiBoundary} style={{ color: 'blue', weight: 2, fillOpacity: 0.07 }} />
        {/* Tree Markers with Carbon Info */}
        {treesInKitui.map((tree, idx) => {
          const co2 = SPECIES_CO2_RATES[tree.species] || 21;
          return (
            <Marker position={[tree.lat, tree.lng]} key={idx}>
              <Popup>
                <div>
                  <strong>{tree.species}</strong> tree<br />
                  Lat: {tree.lat.toFixed(3)}, Lng: {tree.lng.toFixed(3)}<br />
                  <b>Annual carbon stock:</b> {co2} kg CO₂/year
                </div>
              </Popup>
            </Marker>
          );
        })}
        {/* Kitui centroid marker for climate data */}
        <Marker position={KITUI_CENTER}>
          <Popup>
            <div>
              <b>Kitui County (centroid data)</b><br />
              Rainfall: {rainfall !== null ? rainfall + " mm (today)" : "Loading..."}<br />
              Temperature: {temperature !== null ? temperature + "°C (now)" : "Loading..."}<br />
              <span className="text-xs text-gray-500">
                Data for Kitui Town centroid. For full-county estimates, aggregate more points or use gridded data.
              </span>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
      <div className="mt-6">
        <h3 className="font-bold text-lg mb-1">Mapped Trees in Kitui: {treeCount}</h3>
        <CarbonCreditEstimator treeCount={treeCount} />
        <div className="mt-3 text-xs text-gray-700">
          <b>Data transparency:</b> Weather data is from Kitui centroid. National statistics will be labeled “Kenya-wide”.
        </div>
      </div>
    </div>
  );
}
