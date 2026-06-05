'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useJsApiLoader, GoogleMap, Polyline, Marker } from '@react-google-maps/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Car, ChevronDown, ChevronUp } from 'lucide-react';

interface Step {
  html_instructions: string;
  distance: { text: string };
  duration: { text: string };
}

interface PlannedRoute {
  from: string;
  to: string;
  distance: string;
  duration: string;
  steps: Step[];
  startLocation?: { lat: number; lng: number };
  endLocation?: { lat: number; lng: number };
  routePolyline?: Array<{ lat: number; lng: number }>;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

export function RoutePlanner({ user }: { user: any }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ['maps', 'places'],
  });

  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [mode, setMode] = useState('transit');
  const [plannedRoute, setPlannedRoute] = useState<PlannedRoute | null>(null);
  const [loading, setLoading] = useState(false);
  const [startSuggestions, setStartSuggestions] = useState<any[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<any[]>([]);
  const [showStartSuggestions, setShowStartSuggestions] = useState(false);
  const [showEndSuggestions, setShowEndSuggestions] = useState(false);
  const [showDirections, setShowDirections] = useState(true);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);

  const getPlaceSuggestions = async (input: string) => {
    if (!input || input.length < 2 || !isLoaded) {
      return [];
    }

    const service = new window.google.maps.places.AutocompleteService();
    
    try {
      const predictions = await service.getPlacePredictions({
        input: input,
        componentRestrictions: { country: 'us' },
        types: ['geocode', 'establishment'],
      });

      return predictions.predictions || [];
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    }
  };

  const handleStartChange = (value: string) => {
    setStart(value);
    if (value.length > 1 && isLoaded) {
      // Use setTimeout to defer state updates
      setTimeout(async () => {
        const suggestions = await getPlaceSuggestions(value);
        setStartSuggestions(suggestions);
        setShowStartSuggestions(true);
      }, 0);
    } else {
      setStartSuggestions([]);
      setShowStartSuggestions(false);
    }
  };

  const handleEndChange = (value: string) => {
    setEnd(value);
    if (value.length > 1 && isLoaded) {
      // Use setTimeout to defer state updates
      setTimeout(async () => {
        const suggestions = await getPlaceSuggestions(value);
        setEndSuggestions(suggestions);
        setShowEndSuggestions(true);
      }, 0);
    } else {
      setEndSuggestions([]);
      setShowEndSuggestions(false);
    }
  };

  const selectStartSuggestion = (suggestion: any) => {
    setStart(suggestion.description);
    setShowStartSuggestions(false);
    setStartSuggestions([]);
  };

  const selectEndSuggestion = (suggestion: any) => {
    setEnd(suggestion.description);
    setShowEndSuggestions(false);
    setEndSuggestions([]);
  };

  // Decode polyline from Google Maps
  const decodePolyline = (encoded: string) => {
    const poly: Array<{ lat: number; lng: number }> = [];
    let index = 0;
    let lat = 0;
    let lng = 0;

    while (index < encoded.length) {
      let result = 0;
      let shift = 0;
      let b;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      result = 0;
      shift = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      poly.push({
        lat: lat / 1e5,
        lng: lng / 1e5,
      });
    }
    return poly;
  };

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMapRef(map);
    // Fit bounds if route exists
    if (plannedRoute?.startLocation && plannedRoute?.endLocation) {
      const bounds = new window.google.maps.LatLngBounds(
        plannedRoute.startLocation,
        plannedRoute.endLocation
      );
      map.fitBounds(bounds);
    }
  }, [plannedRoute]);

  const handlePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!start.trim() || !end.trim()) {
      alert('Please enter both starting location and destination');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `/api/route?origin=${encodeURIComponent(start.trim())}&destination=${encodeURIComponent(end.trim())}&mode=${encodeURIComponent(mode)}`
      );
      const data = await res.json();

      console.log('Route API response:', data);

      // Check for API errors
      if (!res.ok) {
        alert(`Error: ${data.error || 'Failed to fetch route'}`);
        setPlannedRoute(null);
        return;
      }

      // Check Google Maps response status
      if (data.status !== 'OK') {
        alert(`Route error: ${data.status} - ${data.error_message || 'No route found between locations'}`);
        setPlannedRoute(null);
        return;
      }

      if (data.routes?.length > 0) {
        const route = data.routes[0];
        const leg = route.legs[0];
        
        // Extract polyline points
        let routePolyline: Array<{ lat: number; lng: number }> = [];
        if (route.overview_polyline?.points) {
          routePolyline = decodePolyline(route.overview_polyline.points);
        }

        setPlannedRoute({
          from: leg.start_address,
          to: leg.end_address,
          distance: leg.distance.text,
          duration: leg.duration.text,
          steps: leg.steps,
          startLocation: leg.start_location,
          endLocation: leg.end_location,
          routePolyline: routePolyline,
        });
        alert(`Route found! Distance: ${leg.distance.text}, Duration: ${leg.duration.text}`);
      } else {
        alert('No route found between these locations');
        setPlannedRoute(null);
      }
    } catch (err) {
      console.error('Route planning error:', err);
      alert('Failed to fetch route. Please try again.');
      setPlannedRoute(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Route Planner
          </CardTitle>
          <CardDescription>
            Plan your route and get real-time navigation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isLoaded && <p className="text-gray-600 mb-4">Loading map services...</p>}
          <form onSubmit={handlePlan} className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Starting Location
              </label>
              <input
                ref={startInputRef}
                type="text"
                value={start}
                onChange={(e) => handleStartChange(e.target.value)}
                onFocus={() => start.length > 1 && setShowStartSuggestions(true)}
                placeholder="Enter start location (e.g., Tate Student Center)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BA0C2F] focus:border-transparent"
                required
              />
              {showStartSuggestions && startSuggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
                  {startSuggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      onClick={() => selectStartSuggestion(suggestion)}
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                    >
                      <p className="font-medium text-gray-900">{suggestion.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination
              </label>
              <input
                ref={endInputRef}
                type="text"
                value={end}
                onChange={(e) => handleEndChange(e.target.value)}
                onFocus={() => end.length > 1 && setShowEndSuggestions(true)}
                placeholder="Enter destination (e.g., SLC)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BA0C2F] focus:border-transparent"
                required
              />
              {showEndSuggestions && endSuggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
                  {endSuggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      onClick={() => selectEndSuggestion(suggestion)}
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                    >
                      <p className="font-medium text-gray-900">{suggestion.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transportation Mode
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BA0C2F] focus:border-transparent"
              >
                <option value="transit">Bus/Transit</option>
                <option value="driving">Driving</option>
                <option value="walking">Walking</option>
                <option value="bicycling">Bicycling</option>
              </select>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#BA0C2F] hover:bg-red-800"
              disabled={loading}
            >
              {loading ? 'Planning...' : 'Plan Route'}
            </Button>
          </form>

          {/* ─── Display Planned Route with Map ───────────────────────────── */}
          {plannedRoute && isLoaded && (
            <div className="mt-6 space-y-4">
              {/* Route Summary */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600"><strong>From:</strong> {plannedRoute.from}</p>
                    <p className="text-sm text-gray-600"><strong>To:</strong> {plannedRoute.to}</p>
                    <p className="mt-2"><strong className="text-lg">Distance:</strong> <span className="text-lg text-[#BA0C2F]">{plannedRoute.distance}</span></p>
                    <p><strong className="text-lg">Duration:</strong> <span className="text-lg text-[#BA0C2F]">{plannedRoute.duration}</span></p>
                  </div>
                </div>
              </div>

              {/* Interactive Map */}
              <div className="rounded-lg overflow-hidden border border-gray-300 shadow-md">
                {plannedRoute.startLocation && plannedRoute.endLocation && plannedRoute.routePolyline ? (
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={plannedRoute.startLocation}
                    zoom={13}
                    onLoad={onMapLoad}
                  >
                    {/* Route polyline */}
                    <Polyline
                      path={plannedRoute.routePolyline}
                      options={{
                        strokeColor: '#BA0C2F',
                        strokeOpacity: 0.8,
                        strokeWeight: 4,
                      }}
                    />
                    {/* Start marker */}
                    <Marker
                      position={plannedRoute.startLocation}
                      title="Start"
                      label={{
                        text: 'A',
                        color: 'white',
                      }}
                    />
                    {/* End marker */}
                    <Marker
                      position={plannedRoute.endLocation}
                      title="Destination"
                      label={{
                        text: 'B',
                        color: 'white',
                      }}
                    />
                  </GoogleMap>
                ) : (
                  <div className="h-96 bg-gray-100 flex items-center justify-center">
                    <p className="text-gray-600">Map loading...</p>
                  </div>
                )}
              </div>

              {/* Directions Toggle */}
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setShowDirections(!showDirections)}
                  className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 font-semibold text-gray-900 flex items-center justify-between"
                >
                  <span>Turn-by-turn Directions</span>
                  {showDirections ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {showDirections && (
                  <div className="p-4 bg-white max-h-60 overflow-y-auto">
                    <ol className="space-y-3 list-decimal list-inside">
                      {plannedRoute.steps.map((step, index) => (
                        <li
                          key={index}
                          className="text-sm text-gray-700 leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: `${step.html_instructions} <span class="text-gray-500 ml-2">(${step.distance.text})</span>`,
                          }}
                        />
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>
          )}

          {!plannedRoute && !loading && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                After planning, your route will appear on an interactive map with turn-by-turn directions.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
