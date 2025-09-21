'use server';
import fs from 'fs/promises';
import path from 'path';

export interface AirportData {
  code: string;
  lat: number;
  lon: number;
  name: string;
}

let cachedAirports: AirportData[] | null = null;

export async function getAirportData(): Promise<AirportData[]> {
  if (cachedAirports) {
    return cachedAirports;
  }

  try {
    const filePath = path.join(process.cwd(), 'dataset', 'airports.json');
    const fileContents = await fs.readFile(filePath, 'utf-8');
    const data: AirportData[] = JSON.parse(fileContents);
    cachedAirports = data;
    return data;
  } catch (error) {
    console.error('Failed to read or parse airport data:', error);
    // In case of an error (e.g., file not found), return an empty array
    // to prevent the application from crashing.
    return [];
  }
}

export async function getAirportCoordinatesMap(): Promise<Record<string, [number, number]>> {
  const airports = await getAirportData();
  const coordinateMap: Record<string, [number, number]> = {};
  for (const airport of airports) {
    coordinateMap[airport.code] = [airport.lat, airport.lon];
  }
  return coordinateMap;
}
