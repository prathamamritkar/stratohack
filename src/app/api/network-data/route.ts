import { NextResponse } from 'next/server';
import { parseAirportNodes, parseFlightEdges } from '@/lib/csv-parser';

export async function GET() {
  try {
    const [nodes, edges] = await Promise.all([
      parseAirportNodes(),
      parseFlightEdges(),
    ]);

    const graphData = {
      nodes: nodes.map(node => ({ data: { id: node.id, ...node } })),
      edges: edges.map(edge => ({ data: { ...edge } })),
    };

    return NextResponse.json(graphData);
  } catch (error) {
    console.error('Error parsing graph data:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
