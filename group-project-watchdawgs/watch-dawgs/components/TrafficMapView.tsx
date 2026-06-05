'use client';

import { useState, useCallback } from 'react';
import { GoogleMap, Marker, useJsApiLoader, TrafficLayer } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '600px',
};

// Center map on UGA campus
const center = {
  lat: 33.9519,
  lng: -83.3576,
};

export function TrafficMapView({ user }: { user: any }) {
  console.log('Google Maps API Key:', process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ['maps', 'places'],
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {/* Traffic layer */}
      <TrafficLayer />
    </GoogleMap>
  );
}
