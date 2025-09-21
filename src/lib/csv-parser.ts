import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';

export interface AirportNode {
  id: string; // airport code
  lat: number;
  lon: number;
  city?: string;
  country?: string;
}

export interface FlightEdge {
  source: string; // origin airport
  target: string; // destination airport
  count: number;  // traffic count or weight from dataset
}

export interface FlightRow {
  callsign?: string;
  estdepartureairport?: string; // origin
  estarrivalairport?: string;   // destination
  firstseen?: number;           // unix (s)
  lastseen?: number;            // unix (s)
  [k: string]: any;
}

const basePath = path.join(process.cwd(), 'src', 'dataset');

function parseCsvFile(filePath: string): any[] {
  const content = fs.readFileSync(filePath, 'utf8');
  const parsed = Papa.parse<any>(content, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  });
  return (parsed.data as any[]).filter(Boolean);
}

function fileIfExists(...candidates: string[]): string | null {
  for (const c of candidates) {
    const p = path.join(basePath, c);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

export async function parseAirportNodes(): Promise<AirportNode[]> {
  const filePath = fileIfExists('airport_nodes.csv', 'airports.csv', 'nodes.csv');
  if (!filePath) return [];
  const rows = parseCsvFile(filePath);
  return rows
    .filter((r) => r.id && r.lat != null && r.lon != null)
    .map((r) => ({
      id: String(r.id).trim(),
      lat: Number(r.lat),
      lon: Number(r.lon),
      city: r.city ? String(r.city).trim() : undefined,
      country: r.country ? String(r.country).trim() : undefined,
    }));
}

export async function parseFlightEdges(): Promise<FlightEdge[]> {
  const filePath =
    fileIfExists('airport_edges.csv', 'flight_edges.csv', 'edges.csv') || '';
  if (!filePath) return [];
  const rows = parseCsvFile(filePath);
  return rows
    .filter((r) => (r.origin_airport || r.source) && (r.destination_airport || r.target))
    .map((r) => {
      const source = (r.origin_airport ?? r.source) as string;
      const target = (r.destination_airport ?? r.target) as string;
      const count =
        r.flight_count != null
          ? Number(r.flight_count)
          : r.count != null
          ? Number(r.count)
          : 1;
      return {
        source: String(source).trim(),
        target: String(target).trim(),
        count: Number.isFinite(count) && count > 0 ? count : 1,
      };
    });
}

// Loads all flights from any CSV in dataset that contains estdepartureairport/estarrivalairport columns
export async function loadFlights(): Promise<FlightRow[]> {
  const files = fs
    .readdirSync(basePath)
    .filter((f) => f.toLowerCase().endsWith('.csv'))
    .map((f) => path.join(basePath, f));

  const flights: FlightRow[] = [];
  for (const f of files) {
    const rows = parseCsvFile(f);
    for (const r of rows) {
      // Only keep rows that look like flights between airports
      const origin = r.estdepartureairport ?? r.origin ?? r.origin_airport;
      const dest = r.estarrivalairport ?? r.destination ?? r.destination_airport;
      if (origin && dest) {
        flights.push({
          callsign: r.callsign ?? undefined,
          estdepartureairport: String(origin).trim(),
          estarrivalairport: String(dest).trim(),
          firstseen: r.firstseen != null ? Number(r.firstseen) : undefined,
          lastseen: r.lastseen != null ? Number(r.lastseen) : undefined,
          ...r,
        });
      }
    }
  }
  return flights;
}
