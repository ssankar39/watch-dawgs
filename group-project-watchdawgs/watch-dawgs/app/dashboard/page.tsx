'use client';

import Link from 'next/link';
import { useState } from 'react';
import IncidentCard from '@/components/IncidentCard';

interface Incident {
  id: string;
  location: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  time: string;
  author: string;
}

const mockIncidents: Incident[] = [
  {
    id: '1',
    location: 'North Campus Parking',
    type: 'Heavy Traffic',
    severity: 'high',
    description: 'Heavy congestion on North Campus Drive',
    time: '15 mins ago',
    author: 'John Doe',
  },
  {
    id: '2',
    location: 'Sanford Stadium Lot',
    type: 'Accident',
    severity: 'high',
    description: 'Minor fender bender blocking 1 lane',
    time: '32 mins ago',
    author: 'Jane Smith',
  },
  {
    id: '3',
    location: 'South Campus Entrance',
    type: 'Construction',
    severity: 'medium',
    description: 'Ongoing road maintenance',
    time: '1 hour ago',
    author: 'Campus Services',
  },
];

export default function DashboardPage() {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-red-700 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">WatchDawgs</h1>
          <div className="space-x-4">
            <Link href="/dashboard/report" className="hover:text-red-100">
              Report Incident
            </Link>
            <button className="text-red-100 hover:text-white">Logout</button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Traffic Dashboard</h2>
          <p className="text-gray-600">Stay updated with real-time traffic incidents across UGA campus</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-red-700">{incidents.length}</div>
            <div className="text-gray-600">Active Incidents</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-yellow-600">{incidents.filter(i => i.severity === 'medium').length}</div>
            <div className="text-gray-600">Medium Priority</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600">{incidents.filter(i => i.severity === 'low').length}</div>
            <div className="text-gray-600">Low Priority</div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">Recent Incidents</h3>
          {incidents.map(incident => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      </main>
    </div>
  );
}

