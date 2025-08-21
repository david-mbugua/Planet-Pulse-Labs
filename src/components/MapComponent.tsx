'use client';

import ArcGISEmbed from './ArcGISEmbed';

type MapComponentProps = {
  selectedLayer: 'treeLoss' | 'rainfall' | 'temperature' | 'landUse' | 'biodiversity';
};

// Add your ArcGIS StoryMap/Web Map URLs here
const URLS: Record<MapComponentProps['selectedLayer'], string> = {
  treeLoss:
    'https://storymaps.arcgis.com/stories/YOUR_STORYMAP_ID#treeLoss',  // replace with real link
  rainfall:
    'https://storymaps.arcgis.com/stories/YOUR_STORYMAP_ID#rainfall', // replace with real link
  temperature:
    'https://storymaps.arcgis.com/stories/YOUR_STORYMAP_ID#temperature', // replace with real link
  landUse:
    'https://storymaps.arcgis.com/stories/YOUR_STORYMAP_ID#landUse', // replace with real link
  biodiversity:
    'https://storymaps.arcgis.com/stories/YOUR_STORYMAP_ID#biodiversity', // replace with real link
};

export default function MapComponent({ selectedLayer }: MapComponentProps) {
  const url = URLS[selectedLayer] ?? URLS.treeLoss;

  return (
    <div className="w-full">
      <ArcGISEmbed
        url={url}
        title={`Explorer – ${selectedLayer}`}
        height={780}     // fixed height
        minimalChrome
        allowFullscreen
      />
      <div className="mt-3 text-xs text-gray-600">
        Tip: Make sure this map is shared <b>publicly</b> or to your org group, 
        otherwise the iframe will be blank.
      </div>
    </div>
  );
}
