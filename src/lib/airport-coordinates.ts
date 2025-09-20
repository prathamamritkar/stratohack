
export const airportCoordinates: { [key: string]: [number, number] } = {
  // North America
  'JFK': [40.6413, -73.7781],  // New York
  'LAX': [33.9416, -118.4085], // Los Angeles
  'ORD': [41.9742, -87.9073],  // Chicago
  'DFW': [32.8998, -97.0403],  // Dallas/Fort Worth
  'DEN': [39.8561, -104.6737], // Denver
  'ATL': [33.6407, -84.4277],  // Atlanta
  'SFO': [37.6213, -122.3790], // San Francisco
  'SEA': [47.4502, -122.3088], // Seattle
  'LAS': [36.0840, -115.1537], // Las Vegas
  'MCO': [28.4312, -81.3081],  // Orlando
  'MIA': [25.7959, -80.2871],  // Miami
  'YYZ': [43.6777, -79.6248],  // Toronto
  'YVR': [49.1939, -123.1840], // Vancouver
  'MEX': [19.4363, -99.0721],  // Mexico City

  // Europe
  'LHR': [51.4700, -0.4543],  // London
  'CDG': [49.0097, 2.5479],  // Paris
  'AMS': [52.3105, 4.7683],  // Amsterdam
  'FRA': [50.0379, 8.5622],  // Frankfurt
  'IST': [41.2753, 28.7519],  // Istanbul
  'BCN': [41.2974, 2.0833],   // Barcelona
  'FCO': [41.8003, 12.2388],  // Rome
  'MUC': [48.3537, 11.7861],  // Munich
  'ZRH': [47.4647, 8.5492],   // Zurich
  'CPH': [55.6180, 12.6508],  // Copenhagen

  // Asia
  'DXB': [25.2532, 55.3657],  // Dubai
  'HND': [35.5494, 139.7798], // Tokyo-Haneda
  'BOM': [19.0896, 72.8656],  // Mumbai
  'DEL': [28.5562, 77.1000],  // Delhi
  'CAN': [23.3924, 113.3000], // Guangzhou
  'PEK': [40.0801, 116.5845], // Beijing
  'HKG': [22.3080, 113.9185], // Hong Kong
  'SIN': [1.3644, 103.9915],  // Singapore
  'ICN': [37.4602, 126.4407], // Seoul-Incheon
  'BKK': [13.6900, 100.7501], // Bangkok

  // South America
  'GRU': [-23.4356, -46.4731], // São Paulo
  'EZE': [-34.8222, -58.5358], // Buenos Aires
  'SCL': [-33.3930, -70.7858], // Santiago
  'BOG': [4.7016, -74.1469],   // Bogotá
  
  // Oceania
  'SYD': [-33.9399, 151.1753], // Sydney
  'MEL': [-37.6690, 144.8410], // Melbourne
  'AKL': [-37.0082, 174.7917], // Auckland

  // Africa
  'JNB': [-26.1392, 28.2460],  // Johannesburg
  'CAI': [30.1219, 31.4056],   // Cairo
};

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

        // Ensure the layover isn't too far out of the way
        if (extraDistance > 0 && totalRerouteDistance < directDistance * 1.5) {
             if (extraDistance < minExtraDistance) {
                minExtraDistance = extraDistance;
                bestRerouteAirport = airportCode;
            }
        }
    }
    
    // Fallback if no suitable airport is found (e.g. for very short routes)
    if (!bestRerouteAirport) {
        // Simple fallback: pick a major hub that isn't the origin/destination
        const fallbackHubs = ['ORD', 'DXB', 'AMS', 'HKG'];
        return fallbackHubs.find(hub => hub !== originCode && hub !== destinationCode) || null;
    }

    return bestRerouteAirport;
};

export const getRerouteCoord = (coord1: [number, number], coord2: [number, number]): [number, number] => {
  const mid = getMidpoint(coord1, coord2);
  const dx = coord2[1] - coord1[1];
  const dy = coord2[0] - coord1[0];

  // A point perpendicular to the midpoint
  return [mid[0] + dx * 0.2, mid[1] - dy * 0.2];
};
