'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ReportIncidentPage() {
  const [formData, setFormData] = useState({
    location: '',
    type: '',
    severity: 'medium',
    description: '',
    contactInfo: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle form submission
    console.log('Report submitted:', formData);
    // Redirect to dashboard
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-red-700 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">WatchDawgs</h1>
          <div className="space-x-4">
            <Link href="/dashboard" className="hover:text-red-100">
              Dashboard
            </Link>
            <button className="text-red-100 hover:text-white">Logout</button>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Report an Incident</h2>
          <p className="text-gray-600">Help the UGA community by reporting traffic incidents</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="e.g., North Campus Drive"
                required
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Incident Type *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                <option value="">Select an incident type</option>
                <option value="traffic">Heavy Traffic</option>
                <option value="accident">Accident</option>
                <option value="construction">Construction</option>
                <option value="hazard">Road Hazard</option>
                <option value="event">Campus Event</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
                Severity *
              </label>
              <select
                id="severity"
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="low">Low - Minor inconvenience</option>
                <option value="medium">Medium - Noticeable impact</option>
                <option value="high">High - Major congestion</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Provide details about the incident..."
                rows={5}
                required
              />
            </div>

            <div>
              <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Information (Optional)
              </label>
              <input
                id="contactInfo"
                name="contactInfo"
                type="text"
                value={formData.contactInfo}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Your phone or email"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 py-2 bg-red-700 text-white rounded-lg font-semibold hover:bg-red-800 transition-colors"
              >
                Submit Report
              </button>
              <Link
                href="/dashboard"
                className="flex-1 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
