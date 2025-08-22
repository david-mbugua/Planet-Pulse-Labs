'use client';

import ArcGISEmbed from './ArcGISEmbed';

type MapComponentProps = {
  selectedLayer: 'treeLoss' | 'rainfall' | 'temperature' | 'landUse' | 'biodiversity' | 'storyMaps';
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
  storyMaps:
    'https://storymaps.arcgis.com/stories/cb9eed0329404f94a342abe23525560a', // Team member's StoryMaps
};

export default function MapComponent({ selectedLayer }: MapComponentProps) {
  const url = URLS[selectedLayer] ?? URLS.treeLoss;

  // Create a more descriptive title for the StoryMaps layer
  const getTitle = (layer: string) => {
    if (layer === 'storyMaps') {
      return 'Team Spatial Analysis - Comprehensive Environmental Data';
    }
    return `Explorer – ${layer}`;
  };

  return (
    <div className="w-full">
      <ArcGISEmbed
        url={url}
        title={getTitle(selectedLayer)}
        height={780}     // fixed height
        minimalChrome
        allowFullscreen
        allowScrolling={true}  // Enable scrolling for all maps, especially StoryMaps
      />
      <div className="mt-3 text-xs text-gray-600">
        Tip: Make sure this map is shared <b>publicly</b> or to your org group, 
        otherwise the iframe will be blank.
      </div>
    </div>
  );
}
