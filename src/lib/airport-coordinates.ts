import type { AirportData } from './data-loader';

let airportCoordinates: Record<string, [number, number]> = {};
let allAirports: AirportData[] = [];

export const initializeAirportData = (data: AirportData[]) => {
  const coordinateMap: Record<string, [number, number]> = {};
  for (const airport of data) {
    coordinateMap[airport.code] = [airport.lat, airport.lon];
  }
  airportCoordinates = coordinateMap;
  allAirports = data;
};

export const getAirportCoords = (code: string): [number, number] | undefined => {
    return airportCoordinates[code];
};

export const getCoordinatesMap = () => airportCoordinates;

export const getMidpoint = (coord1: [number, number], coord2: [number, number]): [number, number] => {
    return [(coord1[0] + coord2[0]) / 2, (coord1[1] + coord2[1]) / 2];
};

const haversineDistance = (coords1: [number, number], coords2: [number, number]): number => {
    const toRad = (x: number) => x * Math.PI / 180;
    const R = 6371; // Earth radius in km

    const dLat = toRad(coords2[0] - coords1[0]);
    const dLon = toRad(coords2[1] - coords1[1]);
    const lat1 = toRad(coords1[0]);
    const lat2 = toRad(coords2[0]);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export const findBestReroute = (originCode: string, destinationCode: string): string | null => {
    const originCoords = airportCoordinates[originCode];
    const destinationCoords = airportCoordinates[destinationCode];

    if (!originCoords || !destinationCoords) {
        return null;
    }

    const directDistance = haversineDistance(originCoords, destinationCoords);
    let bestRerouteAirport: string | null = null;
    let minExtraDistance = Infinity;

    for (const airportCode in airportCoordinates) {
        if (airportCode === originCode || airportCode === destinationCode) {
            continue;
        }

        const layoverCoords = airportCoordinates[airportCode];
        const distOriginToLayover = haversineDistance(originCoords, layoverCoords);
        const distLayoverToDest = haversineDistance(layoverCoords, destinationCoords);
        const totalRerouteDistance = distOriginToLayover + distLayoverToDest;

        const extraDistance = totalRerouteDistance - directDistance;

        if (extraDistance > 0 && totalRerouteDistance < directDistance * 1.5) {
             if (extraDistance < minExtraDistance) {
                minExtraDistance = extraDistance;
                bestRerouteAirport = airportCode;
            }
        }
    }
    
    if (!bestRerouteAirport) {
        const fallbackHubs = ['ORD', 'DXB', 'AMS', 'HKG'];
        return fallbackHubs.find(hub => hub !== originCode && hub !== destinationCode) || null;
    }

    return bestRerouteAirport;
};
