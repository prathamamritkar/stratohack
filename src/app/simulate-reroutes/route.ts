import { NextResponse } from 'next/server';
import { parseAirportNodes, parseFlightEdges } from '@/lib/csv-parser';

// Basic implementation of Dijkstra's algorithm
const dijkstra = (nodes: any[], edges: any[], startNode: string, endNode: string) => {
    const graph: { [key: string]: { [key: string]: number } } = {};
    for (const edge of edges) {
        if (!graph[edge.source]) graph[edge.source] = {};
        if (!graph[edge.target]) graph[edge.target] = {};
        graph[edge.source][edge.target] = 1; // Assuming weight 1 for simplicity
        graph[edge.target][edge.source] = 1; // Assuming bidirectional for pathfinding
    }

    const distances: { [key: string]: number } = {};
    const prev: { [key: string]: string | null } = {};
    const pq = new Set<string>();

    for (const node of nodes) {
        distances[node.id] = Infinity;
        prev[node.id] = null;
        pq.add(node.id);
    }

    distances[startNode] = 0;

    while (pq.size > 0) {
        let minNode = null;
        for (const node of pq) {
            if (minNode === null || distances[node] < distances[minNode]) {
                minNode = node;
            }
        }

        if (minNode === null) break;
        pq.delete(minNode);

        if (minNode === endNode) {
            const path = [];
            let current = endNode;
            while (current) {
                path.unshift(current);
                current = prev[current]!;
            }
            return { path, distance: distances[endNode] };
        }

        const neighbors = graph[minNode] || {};
        for (const neighbor in neighbors) {
            const alt = distances[minNode] + neighbors[neighbor];
            if (alt < distances[neighbor]) {
                distances[neighbor] = alt;
                prev[neighbor] = minNode;
            }
        }
    }

    return { path: [], distance: Infinity };
};


export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');

    if (!origin || !destination) {
        return new NextResponse('Origin and destination are required', { status: 400 });
    }

    try {
        const [nodes, edges] = await Promise.all([
            parseAirportNodes(),
            parseFlightEdges(),
        ]);

        const originalPath = { path: [origin, destination], distance: 1 }; // Simplified
        const reroutedPath = dijkstra(nodes, edges, origin, destination);

        return NextResponse.json({ originalPath, reroutedPath });
    } catch (error) {
        console.error('Error in rerouting simulation:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
