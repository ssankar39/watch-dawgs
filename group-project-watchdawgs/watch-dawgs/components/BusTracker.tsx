'use client';

import { useState, useEffect } from 'react';
import { GoogleMap, Marker, TransitLayer, useJsApiLoader } from '@react-google-maps/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Bus, RefreshCw, MapPin, Navigation, Clock } from 'lucide-react';
import { Button } from './ui/button';

interface PassioBus {
  id: string;
  name?: string;
  lat: number;
  lng: number;
  lon?: number;
  latitude?: number;
  longitude?: number;
  routeId: string;
  speed?: number;
  heading?: number;
  updated?: string;
}

interface PassioRoute {
  id: string;
  name: string;
  shortName?: string;
  color?: string;
  active?: boolean;
  path?: Array<{ lat: number; lng: number }>;
}

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const ugaCenter = {
  lat: 33.9519,
  lng: -83.3576,
};

export function BusTracker({ user }: { user: any }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ['maps', 'places'],
  });

  const [buses, setBuses] = useState<PassioBus[]>([]);
  const [routes, setRoutes] = useState<PassioRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);

  const fetchBusData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/buses');
      const data = await response.json();

      console.log('Bus API Response:', data);

      if (data.error) {
        setError(data.error);
      } else {
        // Normalize bus data - handle different possible field names
        const normalizedBuses = (data.buses || []).map((bus: any) => ({
          id: bus.id || bus.busId || bus.vehicleId || String(Math.random()),
          name: bus.name || bus.busName || bus.label,
          lat: bus.lat || bus.latitude || bus.y,
          lng: bus.lng || bus.lon || bus.longitude || bus.x,
          routeId: bus.routeId || bus.route || bus.routeID || 'unknown',
          speed: bus.speed || bus.velocity,
          heading: bus.heading || bus.bearing || bus.direction || 0,
          updated: bus.updated || bus.timestamp,
        })).filter((bus: any) => bus.lat && bus.lng); // Only keep buses with valid coordinates
        
        console.log('Normalized buses:', normalizedBuses);
        
        setBuses(normalizedBuses);
        setRoutes(data.routes || []);
        setLastUpdate(new Date());
        setError('');
      }
    } catch (err) {
      console.error('Error fetching bus data:', err);
      setError('Unable to load bus data from UGA Passio Go');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusData();
  }, []);

  const onMapLoad = (map: google.maps.Map) => {
    setMapRef(map);
    
    // Fit bounds to show all buses if available
    if (buses.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      buses.forEach(bus => {
        if (bus.lat && bus.lng) {
          bounds.extend(new window.google.maps.LatLng(bus.lat, bus.lng));
        }
      });
      map.fitBounds(bounds);
    }
  };

  const getRouteColor = (routeId: string) => {
    const route = routes.find(r => r.id === routeId);
    return route?.color || '#BA0C2F';
  };

  const activeBuses = buses.filter(bus => bus.lat && bus.lng);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bus className="h-5 w-5" />
                UGA Campus Buses (Passio Go)
              </CardTitle>
              <CardDescription>
                Live bus tracking powered by Passio Go & UGA TPS
              </CardDescription>
            </div>
            <Button
              onClick={fetchBusData}
              variant="outline"
              size="sm"
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}


          {isLoaded && (
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={ugaCenter}
                zoom={14}
                onLoad={onMapLoad}
                options={{
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: true,
                }}
              >
                {/* Google Maps Transit Layer - shows public transit routes automatically */}
                <TransitLayer />
                
                {/* Render bus markers */}
                {activeBuses.map((bus) => (
                  <Marker
                    key={bus.id}
                    position={{ lat: bus.lat, lng: bus.lng }}
                    icon={{
                      path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                      scale: 5,
                      fillColor: getRouteColor(bus.routeId),
                      fillOpacity: 1,
                      strokeColor: 'white',
                      strokeWeight: 2,
                      rotation: bus.heading || 0,
                    }}
                    title={bus.name || `Bus ${bus.id}`}
                  />
                ))}
              </GoogleMap>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900">
                All UGA Campus Buses ({activeBuses.length})
              </h4>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                Updated: {lastUpdate.toLocaleTimeString()}
              </div>
            </div>

            {loading && buses.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BA0C2F]"></div>
              </div>
            ) : activeBuses.length === 0 ? (
              <div className="p-6 bg-gray-50 rounded-lg text-center">
                <Bus className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600 font-medium">No buses currently active</p>
                <p className="text-sm text-gray-500 mt-2">
                  Buses may not be running at this time. Check{' '}
                  <a href="http://tps.uga.edu/alerts" target="_blank" rel="noopener noreferrer" className="text-[#BA0C2F] hover:underline">
                    UGA TPS alerts
                  </a>
                  {' '}for service updates.
                </p>
                {routes.length > 0 && (
                  <p className="text-xs text-gray-500 mt-3">
                    {routes.filter(r => r.active).length} routes available when service resumes
                  </p>
                )}
              </div>
            ) : (
              <div className="grid gap-3">
                {activeBuses.map((bus) => {
                  const route = routes.find(r => r.id === bus.routeId);
                  return (
                    <div
                      key={bus.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      style={{ borderLeftWidth: '4px', borderLeftColor: route?.color || '#BA0C2F' }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Bus className="h-4 w-4" style={{ color: route?.color || '#BA0C2F' }} />
                            <h5 className="font-semibold text-gray-900">
                              {route?.name || `Route ${bus.routeId}`}
                            </h5>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Bus ID: {bus.name || bus.id}
                          </p>
                          {bus.speed !== undefined && (
                            <p className="text-xs text-gray-500 mt-1">
                              Speed: {Math.round(bus.speed)} mph
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Navigation 
                            className="h-3 w-3" 
                            style={{ transform: `rotate(${bus.heading || 0}deg)` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-200">
            <a
              href="http://tps.uga.edu/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#BA0C2F] hover:underline flex items-center gap-1"
            >
              View on UGA TPS Website
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

