'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowLeft, Calendar, AlertTriangle } from 'lucide-react';

interface Incident {
  _id: string;
  location: string;
  type: string;
  severity: string;
  description: string;
  author?: string;
  createdAt?: string;
}

export default function ItemDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const response = await fetch(`/api/incidents/${id}`);
        if (response.ok) {
          const data = await response.json();
          setIncident(data);
        }
      } catch (error) {
        console.error('Error fetching incident:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchIncident();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading incident...</p>
        </div>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="min-h-screen bg-linear-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Incident not found</p>
          <Link href="/items">
            <Button>Back to Incidents</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 to-red-100">
      <header className="bg-red-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <Link href="/items" className="inline-block mb-4">
            <Button variant="ghost" className="text-white hover:bg-white/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Incidents
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{incident.type}</h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-5 w-5" />
                  <p className="text-lg">{incident.location}</p>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-full text-white font-semibold text-lg ${
                incident.severity === 'Critical' ? 'bg-red-600' :
                incident.severity === 'High' ? 'bg-orange-500' :
                incident.severity === 'Medium' ? 'bg-yellow-500' :
                'bg-green-500'
              }`}>
                {incident.severity}
              </span>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed">{incident.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {incident.author && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Reported By</p>
                  <p className="text-lg text-gray-900">{incident.author}</p>
                </div>
              )}
              {incident.createdAt && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Reported On</p>
                  <p className="text-lg text-gray-900">
                    {new Date(incident.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <Link href="/items">
                <Button className="w-full">Back to All Incidents</Button>
              </Link>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
