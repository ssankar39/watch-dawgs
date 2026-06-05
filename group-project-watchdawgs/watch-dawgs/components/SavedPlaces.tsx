'use client';

import { useState, useEffect, useRef } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { MapPin, Home, Briefcase, Star, X } from 'lucide-react';

interface SavedLocation {
  _id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: 'home' | 'work' | 'other';
}

export function SavedPlaces({ user }: { user: any }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ['maps', 'places'],
  });

  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<'home' | 'work' | 'other'>('other');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<{
    address: string;
    lat: number;
    lng: number;
  } | null>(null);
  const [locations, setLocations] = useState<SavedLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch saved locations on mount
  useEffect(() => {
    if (user?.id) {
      fetchLocations();
    }
  }, [user]);

  const fetchLocations = async () => {
    try {
      const response = await fetch(`/api/places?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setLocations(data.locations || []);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

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

  const handleAddressChange = async (value: string) => {
    setAddress(value);
    setSelectedPlace(null);
    
    if (value.length > 1 && isLoaded) {
      const results = await getPlaceSuggestions(value);
      setSuggestions(results);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = async (suggestion: any) => {
    setAddress(suggestion.description);
    setShowSuggestions(false);
    setSuggestions([]);

    // Get lat/lng from place_id
    if (isLoaded) {
      const service = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );

      service.getDetails(
        {
          placeId: suggestion.place_id,
          fields: ['geometry', 'formatted_address'],
        },
        (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
            setSelectedPlace({
              address: suggestion.description,
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            });
          }
        }
      );
    }
  };

  const handleSaveLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      alert('Please sign in to save locations');
      return;
    }

    if (!selectedPlace) {
      alert('Please select a location from the suggestions');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/places', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          name: name || selectedPlace.address,
          address: selectedPlace.address,
          latitude: selectedPlace.lat,
          longitude: selectedPlace.lng,
          type,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setLocations([data.location, ...locations]);
        
        // Reset form
        setAddress('');
        setName('');
        setType('other');
        setSelectedPlace(null);
        alert('Location saved successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save location');
      }
    } catch (error) {
      console.error('Error saving location:', error);
      alert('Error saving location');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLocation = async (locationId: string) => {
    if (!confirm('Are you sure you want to delete this location?')) {
      return;
    }

    try {
      const response = await fetch(`/api/places/${locationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setLocations(locations.filter(loc => loc._id !== locationId));
      } else {
        alert('Failed to delete location');
      }
    } catch (error) {
      console.error('Error deleting location:', error);
      alert('Error deleting location');
    }
  };

  const getTypeIcon = (locationType: string) => {
    switch (locationType) {
      case 'home':
        return <Home className="h-4 w-4 text-blue-600" />;
      case 'work':
        return <Briefcase className="h-4 w-4 text-green-600" />;
      default:
        return <MapPin className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeLabel = (locationType: string) => {
    return locationType.charAt(0).toUpperCase() + locationType.slice(1);
  };

  // Group locations by type
  const groupedLocations = {
    home: locations.filter(loc => loc.type === 'home'),
    work: locations.filter(loc => loc.type === 'work'),
    other: locations.filter(loc => loc.type === 'other'),
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Saved Places
          </CardTitle>
          <CardDescription>
            Save your favorite places for quick access in route planning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveLocation} className="space-y-4 mb-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Location *
              </label>
              <input
                ref={inputRef}
                type="text"
                value={address}
                onChange={(e) => handleAddressChange(e.target.value)}
                placeholder="Enter an address or place name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BA0C2F] focus:border-transparent"
                required
              />
              
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.place_id}
                      onClick={() => selectSuggestion(suggestion)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <p className="text-sm text-gray-900">
                        {suggestion.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Name (Optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., My Apartment, Campus Library"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BA0C2F] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setType('home')}
                  className={`flex-1 px-4 py-2 border rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    type === 'home'
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Home className="h-4 w-4" />
                  Home
                </button>
                <button
                  type="button"
                  onClick={() => setType('work')}
                  className={`flex-1 px-4 py-2 border rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    type === 'work'
                      ? 'bg-green-50 border-green-500 text-green-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Briefcase className="h-4 w-4" />
                  Work
                </button>
                <button
                  type="button"
                  onClick={() => setType('other')}
                  className={`flex-1 px-4 py-2 border rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    type === 'other'
                      ? 'bg-gray-50 border-gray-500 text-gray-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <MapPin className="h-4 w-4" />
                  Other
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#BA0C2F] hover:bg-red-800"
              disabled={loading || !selectedPlace}
            >
              {loading ? 'Saving...' : 'Save Place'}
            </Button>
          </form>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Your Saved Places</h4>
            
            {locations.length === 0 ? (
              <p className="text-sm text-gray-600">No saved places yet</p>
            ) : (
              <div className="space-y-6">
                {/* Home Locations */}
                {groupedLocations.home.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-blue-700 mb-2 flex items-center gap-1">
                      <Home className="h-4 w-4" />
                      Home
                    </h5>
                    <div className="space-y-2">
                      {groupedLocations.home.map((loc) => (
                        <div
                          key={loc._id}
                          className="p-3 border border-gray-200 rounded-lg flex items-start justify-between hover:bg-gray-50"
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{loc.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{loc.address}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteLocation(loc._id)}
                            className="text-gray-400 hover:text-red-600 ml-2"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Work Locations */}
                {groupedLocations.work.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      Work
                    </h5>
                    <div className="space-y-2">
                      {groupedLocations.work.map((loc) => (
                        <div
                          key={loc._id}
                          className="p-3 border border-gray-200 rounded-lg flex items-start justify-between hover:bg-gray-50"
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{loc.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{loc.address}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteLocation(loc._id)}
                            className="text-gray-400 hover:text-red-600 ml-2"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Other Locations */}
                {groupedLocations.other.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Other
                    </h5>
                    <div className="space-y-2">
                      {groupedLocations.other.map((loc) => (
                        <div
                          key={loc._id}
                          className="p-3 border border-gray-200 rounded-lg flex items-start justify-between hover:bg-gray-50"
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{loc.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{loc.address}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteLocation(loc._id)}
                            className="text-gray-400 hover:text-red-600 ml-2"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
