import { NextResponse } from 'next/server';
import { loadFlights } from '@/lib/csv-parser';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const airport = (searchParams.get('airport') || '').trim().toUpperCase();
  const windowMinutes = Number(searchParams.get('window') || 120);

  if (!airport) {
    return NextResponse.json({ error: 'airport_required' }, { status: 400 });
  }

  try {
    const flights = await loadFlights();

    const byDep: Record<string, any[]> = {};
    const byArr: Record<string, any[]> = {};

    for (const f of flights) {
      if (f.estdepartureairport) {
        const key = f.estdepartureairport.toUpperCase();
        (byDep[key] ||= []).push(f);
      }
      if (f.estarrivalairport) {
        const key = f.estarrivalairport.toUpperCase();
        (byArr[key] ||= []).push(f);
      }
    }

    const windowSec = windowMinutes * 60;
    const starts = byDep[airport] || [];
    const chains: any[] = [];

    for (const start of starts) {
      const chain = [start];
      let current = start;
      let safety = 0;

      while (safety < 50) {
        safety++;
        if (current.lastseen == null || current.estarrivalairport == null) break;

        const arrAirport = current.estarrivalairport.toUpperCase();
        const candidates = (byDep[arrAirport] || []).filter((n) => {
          if (n.firstseen == null) return false;
          if (n === current) return false;
          return n.firstseen >= current.lastseen && (n.firstseen - current.lastseen) <= windowSec;
        });

        if (candidates.length === 0) break;

        candidates.sort((a, b) => (a.firstseen ?? Infinity) - (b.firstseen ?? Infinity));
        const next = candidates[0];

        if (chain.includes(next)) break;

        chain.push(next);
        current = next;
      }

      if (chain.length > 1) chains.push(chain);
    }

    const impactScore: Record<string, number> = {};
    for (const chain of chains) {
      for (const f of chain) {
        const a = f.estarrivalairport?.toUpperCase();
        if (a) impactScore[a] = (impactScore[a] || 0) + 1;
      }
    }

    const ranked = Object.entries(impactScore)
      .filter(([a]) => a !== airport)
      .sort((a, b) => b[1] - a[1])
      .map(([airport, score]) => ({ airport, score }));

    return NextResponse.json({ airport, windowMinutes, ranked, chains });
  } catch (e) {
    console.error('predict-delays error', e);
    return NextResponse.json({ error: 'failed_to_predict' }, { status: 500 });
  }
}
