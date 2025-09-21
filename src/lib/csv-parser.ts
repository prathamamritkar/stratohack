import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';

export interface AirportNode {
  id: string;
  lat: number;
  lon: number;
  city: string;
  country: string;
}

export interface FlightEdge {
  source: string;
  target: string;
  count: number;
}

// Get the base path of the project
const basePath = path.join(process.cwd(), 'src', 'dataset');

export const parseAirportNodes = (): Promise<AirportNode[]> => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(basePath, 'airport_nodes.csv');
    const fileStream = fs.createReadStream(filePath);

    Papa.parse<any>(fileStream, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        const nodes: AirportNode[] = results.data
          .filter(row => row.id && row.lat && row.lon)
          .map(row => ({
            id: row.id,
            lat: row.lat,
            lon: row.lon,
            city: row.city,
            country: row.country,
          }));
        resolve(nodes);
      },
      error: (error: any) => {
        reject(error);
      },
    });
  });
};

export const parseFlightEdges = (): Promise<FlightEdge[]> => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(basePath, 'flight_edges.csv');
    const fileStream = fs.createReadStream(filePath);

    Papa.parse<any>(fileStream, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        const edges: FlightEdge[] = results.data
          .filter(row => row.origin_airport && row.destination_airport && row.flight_count)
          .map(row => ({
            source: row.origin_airport,
            target: row.destination_airport,
            count: row.flight_count,
          }));
        resolve(edges);
      },
      error: (error: any) => {
        reject(error);
      },
    });
  });
};

export const getFlightData = (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        const filePath = path.join(basePath, 'flights_from_JFK.csv');
        const fileStream = fs.createReadStream(filePath);

        Papa.parse(fileStream, {
            header: true,
            dynamicTyping: true,
            complete: (results) => {
                resolve(results.data);
            },
            error: (error) => {
                reject(error);
            },
        });
    });
};
