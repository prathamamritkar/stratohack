"use client";

import { useState } from 'react';

export default function SimulateReroutesPage() {
  const [origin, setOrigin] = useState('JFK');
  const [destination, setDestination] = useState('LAX');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  async function handleSim(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setResult(null);
    try {
      const res = await fetch(`/api/simulate-reroutes?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to simulate');
      setResult(data);
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to simulate');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-semibold mb-4">Rerouting Strategy Simulation</h1>
      <form onSubmit={handleSim} className="flex flex-col sm:flex-row gap-3 items-start sm:items-end mb-6">
        <div>
          <label className="block text-sm text-gray-700">Origin (IATA)</label>
          <input
            value={origin}
            onChange={(e) => setOrigin(e.target.value.toUpperCase())}
            className="border rounded px-3 py-2 w-40"
            placeholder="e.g., JFK"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Destination (IATA)</label>
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value.toUpperCase())}
            className="border rounded px-3 py-2 w-40"
            placeholder="e.g., LAX"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {loading ? 'Simulating…' : 'Simulate'}
        </button>
      </form>

      {err && <div className="text-sm text-red-600 mb-4">{err}</div>}

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="border rounded p-3">
            <h2 className="font-semibold mb-2">Original Path</h2>
            <p>Path: {result.originalPath?.path?.length ? result.originalPath.path.join(' → ') : 'No direct route in dataset'}</p>
            <p>Cost: {Number.isFinite(result.originalPath?.cost) ? result.originalPath.cost.toFixed(4) : '∞'}</p>
          </div>
          <div className="border rounded p-3">
            <h2 className="font-semibold mb-2">Rerouted Path (Dijkstra)</h2>
            <p>Path: {result.reroutedPath?.path?.length ? result.reroutedPath.path.join(' → ') : 'No path found'}</p>
            <p>Cost: {Number.isFinite(result.reroutedPath?.cost) ? result.reroutedPath.cost.toFixed(4) : '∞'}</p>
            <p className="text-gray-500 mt-2">Weights derive from 1/traffic_count (dataset).</p>
          </div>
        </div>
      )}
    </div>
  );
}
