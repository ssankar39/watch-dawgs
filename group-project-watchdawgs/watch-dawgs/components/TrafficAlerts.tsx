'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface TrafficIncident {
  object_id: number;
  incident_type: string;
  location: string;
  description: string;
  severity: string;
  reported_time: string;
  latitude?: number;
  longitude?: number;
}

export function TrafficAlerts() {
  const [alerts, setAlerts] = useState<TrafficIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchTrafficIncidents = async () => {
    try {
      setLoading(true);
      // Athens-Clarke County traffic incidents API
      const apiUrl = 'https://services2.arcgis.com/xSEULKvB31odt3XQ/arcgis/rest/services/Traffic_Incidents/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json';
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch traffic incident data');
      }

      const data = await response.json();
      
      // Log to see actual field names
      if (data.features && data.features.length > 0) {
        console.log('First traffic incident:', data.features[0]);
        console.log('Incident attributes:', data.features[0].attributes);
      }
      
      if (data.features && Array.isArray(data.features)) {
        const incidents = data.features.map((feature: any) => {
          const attrs = feature.attributes;
          return {
            object_id: attrs.OBJECTID || attrs.objectid || attrs.FID || Math.random(),
            incident_type: attrs.Type || attrs.type || attrs.IncidentType || attrs.incident_type || 'Incident',
            location: attrs.Location || attrs.location || attrs.ADDRESS || attrs.address || attrs.Street || 'Unknown Location',
            description: attrs.Description || attrs.description || attrs.Details || attrs.details || attrs.Comments || 'No details available',
            severity: attrs.Severity || attrs.severity || attrs.Priority || attrs.priority || 'medium',
            reported_time: attrs.ReportedTime || attrs.reported_time || attrs.DateTime || attrs.CreatedDate || 'Recent',
            latitude: feature.geometry?.y,
            longitude: feature.geometry?.x,
          };
        });
        
        setAlerts(incidents.slice(0, 10));
        setLastUpdate(new Date());
        setError('');
      } else {
        // Use fallback mock data if no real data
        setAlerts(getMockAlerts());
        setError('Using sample data - no live incidents reported');
      }
    } catch (err) {
      console.error('Error fetching traffic incidents:', err);
      setAlerts(getMockAlerts());
      setError('Unable to load live traffic data - showing sample incidents');
    } finally {
      setLoading(false);
    }
  };

  const getMockAlerts = (): TrafficIncident[] => {
    return [
      {
        object_id: 1,
        incident_type: 'Accident',
        location: 'North Campus Drive',
        description: 'Minor accident near parking lot - expect delays',
        severity: 'high',
        reported_time: '5 mins ago',
      },
      {
        object_id: 2,
        incident_type: 'Road Work',
        location: 'South Campus',
        description: 'Road construction on main entrance',
        severity: 'medium',
        reported_time: '1 hour ago',
      },
      {
        object_id: 3,
        incident_type: 'Heavy Traffic',
        location: 'Sanford Stadium',
        description: 'Increased traffic due to event',
        severity: 'medium',
        reported_time: '2 hours ago',
      },
    ];
  };

  useEffect(() => {
    fetchTrafficIncidents();

    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchTrafficIncidents, 60000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    const sev = severity?.toLowerCase();
    if (sev === 'high' || sev === 'critical' || sev === 'severe') {
      return 'border-red-500 bg-red-50';
    } else if (sev === 'medium' || sev === 'moderate') {
      return 'border-yellow-500 bg-yellow-50';
    } else {
      return 'border-blue-500 bg-blue-50';
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Traffic Alerts
              </CardTitle>
              <CardDescription>
                Live incidents from Athens Clarke County
              </CardDescription>
            </div>
            <Button
              onClick={fetchTrafficIncidents}
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
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">{error}</p>
            </div>
          )}

          {loading && alerts.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BA0C2F]"></div>
            </div>
          ) : alerts.length === 0 ? (
            <div className="p-6 bg-green-50 rounded-lg text-center border border-green-200">
              <AlertTriangle className="h-12 w-12 mx-auto text-green-600 mb-3" />
              <p className="text-green-800 font-semibold">No active incidents</p>
              <p className="text-sm text-green-700 mt-2">All clear in the area!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.object_id}
                  className={`border-l-4 p-4 rounded-lg ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{alert.incident_type}</h4>
                      <p className="text-sm text-gray-600 mt-1">📍 {alert.location}</p>
                      <p className="text-sm text-gray-700 mt-1">{alert.description}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {alert.reported_time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm text-blue-900">
                📍 Data from Athens Clarke County Open API
              </p>
              <p className="text-xs text-gray-600">
                Updated: {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}