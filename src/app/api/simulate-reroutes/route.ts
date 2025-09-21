import { NextResponse } from 'next/server';
import { parseFlightEdges } from '@/lib/csv-parser';

type Graph = Record<string, Record<string, number>>;

function buildGraph(edges: { source: string; target: string; count: number }[]): Graph {
  const g: Graph = {};
  for (const e of edges) {
    const w = 1 / Math.max(1, e.count);
    const s = e.source.toUpperCase();
    const t = e.target.toUpperCase();
    (g[s] ||= {})[t] = Math.min((g[s]?.[t] ?? Infinity), w);
  }
  return g;
}

function dijkstra(graph: Graph, start: string, goal: string) {
  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const q = new Set<string>(Object.keys(graph));

  for (const v of q) {
    dist[v] = Infinity;
    prev[v] = null;
  }
  for (const v of Object.values(graph)) {
    for (const t of Object.keys(v)) {
      if (!(t in dist)) {
        dist[t] = Infinity;
        prev[t] = null;
        q.add(t);
      }
    }
  }

  dist[start] = 0;

  while (q.size) {
    let u: string | null = null;
    for (const v of q) {
      if (u === null || dist[v] < dist[u]) u = v;
    }
    if (u === null) break;
    q.delete(u);

    if (u === goal) break;

    const neighbors = graph[u] || {};
    for (const [v, w] of Object.entries(neighbors)) {
      const alt = dist[u] + w;
      if (alt < dist[v]) {
        dist[v] = alt;
        prev[v] = u;
      }
    }
  }

  const path: string[] = [];
  let cur: string | null = goal;
  if (!prev[cur] && cur !== start) {
    return { path: [], cost: Infinity };
  }
  while (cur) {
    path.unshift(cur);
    cur = prev[cur];
  }
  return { path, cost: dist[goal] };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = (searchParams.get('origin') || '').trim().toUpperCase();
  const destination = (searchParams.get('destination') || '').trim().toUpperCase();

  if (!origin || !destination) {
    return NextResponse.json({ error: 'origin_and_destination_required' }, { status: 400 });
  }

  try {
    const edges = await parseFlightEdges();
    const graph = buildGraph(edges);

    const directWeight = graph[origin]?.[destination];
    const originalPath =
      directWeight != null
        ? { path: [origin, destination], cost: directWeight }
        : { path: [], cost: Infinity };

    const reroutedPath = dijkstra(graph, origin, destination);

    return NextResponse.json({ origin, destination, originalPath, reroutedPath });
  } catch (e) {
    console.error('simulate-reroutes error', e);
    return NextResponse.json({ error: 'failed_to_simulate' }, { status: 500 });
  }
}
