'use client';

import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { MapPin } from 'lucide-react';
import { useState } from 'react';

export function LocationManager({ user }: { user: any }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('other');
  const [locations, setLocations] = useState<any[]>([]);

  const handleSaveLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !user?.id) {
      alert('Please enter a location name and sign in');
      return;
    }

    try {
      const response = await fetch('/api/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          type,
          userId: user.id,
          latitude: 33.9519, // Default UGA campus
          longitude: -83.3576,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setLocations([...locations, data.location]);
        setName('');
        setType('other');
        console.log('Location saved successfully');
      } else {
        alert('Failed to save location');
      }
    } catch (error) {
      console.error('Error saving location:', error);
      alert('Error saving location');
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Saved Locations
          </CardTitle>
          <CardDescription>
            Save your favorite places for quick route planning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveLocation} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., My Dorm, Library"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BA0C2F] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BA0C2F] focus:border-transparent"
              >
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="favorite">Favorite</option>
                <option value="other">Other</option>
              </select>
            </div>

            <Button type="submit" className="w-full bg-[#BA0C2F] hover:bg-red-800">
              Add Location
            </Button>
          </form>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Your Locations</h4>
            {locations.length === 0 ? (
              <p className="text-sm text-gray-600">No saved locations yet</p>
            ) : (
              <div className="space-y-2">
                {locations.map((loc, idx) => (
                  <div
                    key={idx}
                    className="p-3 border border-gray-200 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{loc.name}</p>
                      <p className="text-xs text-gray-500">{loc.type}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
