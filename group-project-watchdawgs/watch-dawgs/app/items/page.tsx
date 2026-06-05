'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MapPin, ArrowLeft } from 'lucide-react';

interface Incident {
  _id: string;
  location: string;
  type: string;
  severity: string;
  description: string;
}

export default function ItemsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await fetch('/api/incidents');
        const data = await response.json();
        setIncidents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching incidents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 to-red-100">
      <header className="bg-red-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8" />
              <h1 className="text-2xl font-bold">Traffic Incidents</h1>
            </div>
            <Link href="/dashboard">
              <Button variant="ghost" className="text-white hover:bg-white/20">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {incidents.length > 0 ? (
            incidents.map((incident) => (
              <Link key={incident._id} href={`/items/${incident._id}`}>
                <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900 flex-1">{incident.type}</h3>
                      <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
                        incident.severity === 'Critical' ? 'bg-red-600' :
                        incident.severity === 'High' ? 'bg-orange-500' :
                        incident.severity === 'Medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}>
                        {incident.severity}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <MapPin className="h-4 w-4" />
                      <p className="text-sm">{incident.location}</p>
                    </div>
                    <p className="text-gray-600 text-sm">{incident.description}</p>
                  </div>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-lg">No incidents reported yet</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
