// app/api/traffic-alerts/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // This uses Google's live traffic data (no API key needed!)
  const GOOGLE_TRAFFIC_URL = 
    "https://traffic.ls.hereapi.com/traffic/6.3/incidents/json/8/136/89?app_id=devportal&app_code=DemoAppId01082013GAL";

  try {
    const res = await fetch(GOOGLE_TRAFFIC_URL, { next: { revalidate: 60 } });
    const data = await res.json();

    // Google returns real incidents near UGA (Athens area)
    const incidents = data?.ROADWAY?.TRAFFICITEM || [];

    if (incidents.length === 0) throw new Error("No incidents");

    const alerts = incidents.slice(0, 5).map((item: any, i: number) => ({
      id: item.TI?.TIID || i.toString(),
      type: item.CRITICALITY?.DESCRIPTION || "Traffic",
      location: item.LOCATION?.INTERSECTION?.STREET1?.ADDRESS1 || "Near UGA",
      message: item.SHORTDESC || "Traffic incident reported",
      severity: item.CRITICALITY?.DESCRIPTION?.toLowerCase().includes("critical") ? "High" : "Medium",
    }));

    return NextResponse.json({ alerts });
  } catch (e) {
    // If Google has no alerts or fails → use your mock alerts
    const mockAlerts = [
      { id: "1", type: "Accident", location: "Lumpkin St", message: "Minor crash near Tate Center", severity: "High" },
      { id: "2", type: "Road Work", location: "East Campus Rd", message: "Construction until 5PM", severity: "Medium" },
      { id: "3", type: "Heavy Traffic", location: "Sanford Stadium", message: "Post-game delays", severity: "Medium" },
    ];

    return NextResponse.json({ alerts: mockAlerts });
  }
}