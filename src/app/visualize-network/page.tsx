"use client";

import { useEffect, useRef, useState } from 'react';

type Element = { data: any };
type GraphPayload = { elements: Element[] };

export default function VisualizeNetworkPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cyRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function run() {
      try {
        const res = await fetch('/api/network-data');
        const payload: GraphPayload = await res.json();

        const cytoscape = (await import('cytoscape')).default;

        if (!mounted || !containerRef.current) return;

        if (cyRef.current) {
          cyRef.current.destroy();
          cyRef.current = null;
        }

        cyRef.current = cytoscape({
          container: containerRef.current,
          elements: payload.elements,
          style: [
            {
              selector: 'node',
              style: {
                'background-color': '#2563eb',
                'label': 'data(label)',
                'color': '#111827',
                'font-size': 10,
                'text-halign': 'center',
                'text-valign': 'center',
                'width': 14,
                'height': 14,
              },
            },
            {
              selector: 'edge',
              style: {
                'width': 'mapData(count, 1, 100, 1, 6)',
                'line-color': '#9ca3af',
                'target-arrow-color': '#9ca3af',
                'target-arrow-shape': 'triangle',
                'curve-style': 'bezier',
                'opacity': 0.7,
              },
            },
            {
              selector: 'node:selected',
              style: { 'background-color': '#f59e0b' },
            },
          ],
          layout: { name: 'cose', fit: true, padding: 20 },
          wheelSensitivity: 0.2,
        });

        // Basic tooltip via title attribute
        cyRef.current.nodes().forEach((n: any) => {
          const data = n.data();
          n.qtip && n.qtip.destroy?.();
          n._private.data.title = `${data.label}\n(${data.city ?? 'N/A'}, ${data.country ?? 'N/A'})`;
        });

        setLoading(false);
      } catch (e: any) {
        console.error(e);
        setErr(e?.message ?? 'Failed to load network');
        setLoading(false);
      }
    }
    run();
    return () => {
      mounted = false;
      if (cyRef.current) {
        cyRef.current.destroy();
        cyRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-semibold mb-4">Airport Network Visualization</h1>
      {loading && <div className="text-sm text-gray-500">Loading network…</div>}
      {err && <div className="text-sm text-red-600">{err}</div>}
      <div ref={containerRef} className="h-[70vh] w-full border border-gray-200 rounded-lg" />
      <p className="mt-3 text-xs text-gray-500">All nodes/edges are parsed from src/dataset files.</p>
    </div>
  );
}
