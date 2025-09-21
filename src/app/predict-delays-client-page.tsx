"use client";

import { useState } from 'react';

export default function PredictDelaysPage() {
  const [airport, setAirport] = useState('JFK');
  const [windowMinutes, setWindowMinutes] = useState(120);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  async function handlePredict(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setResult(null);
    try {
      const res = await fetch(`/api/predict-delays?airport=${encodeURIComponent(airport)}&window=${windowMinutes}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to predict');
      setResult(data);
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to predict');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-semibold mb-4">Cascading Delay Prediction</h1>
      <form onSubmit={handlePredict} className="flex flex-col sm:flex-row gap-3 items-start sm:items-end mb-6">
        <div>
          <label className="block text-sm text-gray-700">Airport (IATA)</label>
          <input
            value={airport}
            onChange={(e) => setAirport(e.target.value.toUpperCase())}
            className="border rounded px-3 py-2 w-40"
            placeholder="e.g., JFK"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Connection window (minutes)</label>
          <input
            type="number"
            value={windowMinutes}
            onChange={(e) => setWindowMinutes(Math.max(0, Number(e.target.value)))}
            className="border rounded px-3 py-2 w-48"
            min={0}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {loading ? 'Computing…' : 'Predict'}
        </button>
      </form>

      {err && <div className="text-sm text-red-600 mb-4">{err}</div>}

      {result && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Most impacted (ranked)</h2>
          <ul className="list-disc pl-6 text-sm">
            {result.ranked?.map((r: any, idx: number) => (
              <li key={r.airport}>
                {idx + 1}. {r.airport} — score {r.score}
              </li>
            ))}
          </ul>

          <h3 className="text-base font-medium">Sample chains</h3>
          <div className="space-y-2">
            {(result.chains || []).slice(0, 10).map((chain: any[], i: number) => (
              <div key={i} className="text-xs border rounded p-2 bg-gray-50">
                {chain
                  .map((f: any) => `${f.estdepartureairport ?? '?'}→${f.estarrivalairport ?? '?'} (${f.callsign ?? 'N/A'})`)
                  .join('  |  ')}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
