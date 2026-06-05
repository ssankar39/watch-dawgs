import { NextRequest, NextResponse } from 'next/server';

// Passio Go API configuration for UGA
// UGA System ID: 3994 (username: 'uga')
const PASSIO_API_BASE = 'https://passiogo.com/mapGetData.php';
const UGA_SYSTEM_ID = '3994';

// GET bus data from Passio Go
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const routeId = searchParams.get('routeId');

    // Fetch buses from Passio Go API using POST with body parameters (matching PassioGo Python library)
    const busesResponse = await fetch(
      `${PASSIO_API_BASE}?getBuses=2`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0',
        },
        body: JSON.stringify({
          s0: UGA_SYSTEM_ID,
          sA: 1
        }),
        next: { revalidate: 10 },
      }
    );

    // Fetch routes using POST with correct parameters
    const routesResponse = await fetch(
      `${PASSIO_API_BASE}?getRoutes=1`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0',
        },
        body: JSON.stringify({
          systemSelected0: UGA_SYSTEM_ID,
          amount: 1
        }),
        next: { revalidate: 10 },
      }
    );

    // Fetch stops to get route paths
    const stopsResponse = await fetch(
      `${PASSIO_API_BASE}?getStops=2`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0',
        },
        body: JSON.stringify({
          s0: UGA_SYSTEM_ID,
          sA: 1
        }),
        next: { revalidate: 10 },
      }
    );

    if (!busesResponse.ok || !routesResponse.ok || !stopsResponse.ok) {
      throw new Error('Failed to fetch from Passio Go');
    }

    const busesData = await busesResponse.json();
    const routesData = await routesResponse.json();
    const stopsData = await stopsResponse.json();

    // Parse buses - they come as an object with bus IDs as keys
    const busesObj = busesData.buses || {};
    const buses = Object.entries(busesObj)
      .filter(([id, _]) => id !== '-1') // Skip invalid buses
      .map(([id, busArray]: [string, any]) => {
        const bus = Array.isArray(busArray) ? busArray[0] : busArray;
        return {
          id: bus.busId || id,
          name: bus.busName,
          type: bus.busType || 'bus',
          lat: bus.latitude,
          lng: bus.longitude,
          routeId: bus.routeId,
          routeName: bus.route,
          color: bus.color,
          speed: bus.speed,
          heading: parseInt(bus.calculatedCourse || '0'),
          updated: bus.created,
          paxLoad: bus.paxLoad100,
        };
      });

    // Parse routes and build paths from stops
    const routesArray = routesData.all || routesData || [];
    
    // Create a map of route stops from stopsData
    const routeStopsMap: { [key: string]: Array<{ lat: number; lng: number }> } = {};
    
    if (stopsData.routes) {
      Object.entries(stopsData.routes).forEach(([routeId, routeData]: [string, any]) => {
        const stops: Array<{ lat: number; lng: number }> = [];
        
        // Route data format: [routeId, routeName, ...stops]
        // Each stop is an array like: [stopType, stopId, ...]
        if (Array.isArray(routeData) && routeData.length > 2) {
          for (let i = 2; i < routeData.length; i++) {
            const stopRef = routeData[i];
            if (Array.isArray(stopRef) && stopRef.length > 1) {
              const stopId = stopRef[1];
              // Find the stop in stopsData.stops
              if (stopsData.stops && stopsData.stops[stopId]) {
                const stop = stopsData.stops[stopId];
                if (stop.latitude && stop.longitude) {
                  stops.push({
                    lat: parseFloat(stop.latitude),
                    lng: parseFloat(stop.longitude)
                  });
                }
              }
            }
          }
        }
        
        if (stops.length > 0) {
          routeStopsMap[routeId] = stops;
        }
      });
    }
    
    const routes = (Array.isArray(routesArray) ? routesArray : Object.values(routesArray)).map((route: any) => {
      const routeId = route.id || route.myid;
      return {
        id: routeId,
        name: route.name,
        shortName: route.shortName,
        color: route.groupColor || '#BA0C2F',
        active: route.outdated === '0',
        path: routeStopsMap[routeId] || []
      };
    });

    console.log('Parsed routes:', routes.length);
    console.log('Routes with paths:', routes.filter((r: any) => r.path && r.path.length > 0).length);
    console.log('Parsed buses:', buses.length);

    // Filter buses by route if specified
    let filteredBuses = buses;
    if (routeId) {
      filteredBuses = buses.filter((bus: any) => bus.routeId === routeId);
    }

    return NextResponse.json(
      { 
        buses: filteredBuses,
        routes: routes,
        lastUpdate: new Date().toISOString(),
        source: 'Passio Go API'
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Passio Go API Error:', error.message);
    return NextResponse.json(
      { 
        buses: [], 
        routes: [],
        error: 'Unable to fetch bus data from UGA Passio Go',
        message: error.message 
      },
      { status: 200 }
    );
  }
}

// POST for getting specific route details
export async function POST(request: NextRequest) {
  try {
    const { action, routeId } = await request.json();

    if (action === 'getRouteDetails') {
      const response = await fetch(
        `${PASSIO_API_BASE}?getRoutes=1`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0',
          },
          body: JSON.stringify({
            systemSelected0: UGA_SYSTEM_ID,
            amount: 1
          }),
        }
      );
      
      const data = await response.json();
      const routesArray = data.all || data || [];
      const route = routesArray.find((r: any) => r.id === routeId);
      
      return NextResponse.json(
        { route, stops: route?.stops || [] },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Route details error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch route details' },
      { status: 500 }
    );
  }
}
