
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapComponentProps {
  address: string;
  className?: string;
  coordinates?: [number, number]; // [longitude, latitude]
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  address, 
  className = "w-full h-64",
  coordinates = [30.8914, -30.3378] // Default coordinates for Ramsgate area
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  
  const [lng, setLng] = useState(coordinates[0]);
  const [lat, setLat] = useState(coordinates[1]);
  const [zoom, setZoom] = useState(15);

  // Use the provided token directly
  const mapboxToken = "pk.eyJ1Ijoid2ltcGlldmwiLCJhIjoiY2x6djI0MGdzMDM1NzJpcGdydHY1Y2J1aSJ9.I6bfJySi3oDui_cw8WFrZQ";

  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    
    mapboxgl.accessToken = mapboxToken;
    
    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });

    // Add marker for the location
    const marker = new mapboxgl.Marker({ color: '#f97316' })
      .setLngLat([lng, lat])
      .setPopup(new mapboxgl.Popup().setHTML(`<p>${address}</p>`))
      .addTo(newMap);
    
    // Add navigation controls
    newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    map.current = newMap;

    // Clean up on unmount
    return () => {
      newMap.remove();
    };
  }, [mapContainer.current, lng, lat, address, mapboxToken]);

  return <div ref={mapContainer} className={`${className} rounded-lg`} />;
};

export default MapComponent;
