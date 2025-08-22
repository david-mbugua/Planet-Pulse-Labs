'use client';

import React from 'react';

type ArcGISEmbedProps = {
  url: string;
  title: string;
  height: number | string;
  minimalChrome?: boolean;
  allowFullscreen?: boolean;
  allowScrolling?: boolean;
};

export default function ArcGISEmbed({ 
  url, 
  title, 
  height, 
  minimalChrome = false, 
  allowFullscreen = false,
  allowScrolling = true
}: ArcGISEmbedProps) {
  // Add minimal chrome parameter to URL if requested
  const embedUrl = minimalChrome && !url.includes('?') 
    ? `${url}?chrome=minimal` 
    : minimalChrome && url.includes('?')
    ? `${url}&chrome=minimal`
    : url;

  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-lg">
      <iframe
        src={embedUrl}
        title={title}
        width="100%"
        height={height}
        frameBorder="0"
        scrolling={allowScrolling ? "yes" : "no"}
        allowFullScreen={allowFullscreen}
        className="border-0 w-full h-full"
        style={{ 
          minHeight: typeof height === 'number' ? `${height}px` : height === '100%' ? '400px' : height,
          height: height,
          backgroundColor: '#f3f4f6', // Light gray background while loading
          pointerEvents: 'auto', // Ensure touch/mouse events work
          overflow: allowScrolling ? 'auto' : 'hidden'
        }}
      />
    </div>
  );
}
