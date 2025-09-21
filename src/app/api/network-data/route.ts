import { NextResponse } from 'next/server';
import { parseAirportNodes, parseFlightEdges } from '@/lib/csv-parser';

export async function GET() {
  try {
    const [nodes, edges] = await Promise.all([
      parseAirportNodes(),
      parseFlightEdges(),
    ]);

    const elements = [
      ...nodes.map((n) => ({
        data: { id: n.id, label: n.id, lat: n.lat, lon: n.lon, city: n.city, country: n.country },
      })),
      ...edges.map((e, idx) => ({
        data: { id: `e${idx}-${e.source}-${e.target}`, source: e.source, target: e.target, count: e.count },
      })),
    ];

    return NextResponse.json({ elements });
  } catch (e) {
    console.error('network-data error', e);
    return NextResponse.json({ error: 'failed_to_load_graph' }, { status: 500 });
  }
}
