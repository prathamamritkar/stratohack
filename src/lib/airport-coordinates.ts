
export const airportCoordinates: { [key: string]: [number, number] } = {
  'JFK': [40.6413, -73.7781],
  'LAX': [33.9416, -118.4085],
  'ORD': [41.9742, -87.9073],
  'DFW': [32.8998, -97.0403],
  'DEN': [39.8561, -104.6737],
  'ATL': [33.6407, -84.4277],
  'SFO': [37.6213, -122.3790],
  'LHR': [51.4700, -0.4543],
  'CDG': [49.0097, 2.5479],
  'DXB': [25.2532, 55.3657],
  'HND': [35.5494, 139.7798],
  'BOM': [19.0896, 72.8656],
  'DEL': [28.5562, 77.1000],
  'AMS': [52.3105, 4.7683],
  'FRA': [50.0379, 8.5622],
  'IST': [41.2753, 28.7519],
  'CAN': [23.3924, 113.3000],
  'PEK': [40.0801, 116.5845],
  'SYD': [-33.9399, 151.1753],
  'GRU': [-23.4356, -46.4731],
};

export const getMidpoint = (coord1: [number, number], coord2: [number, number]): [number, number] => {
    return [(coord1[0] + coord2[0]) / 2, (coord1[1] + coord2[1]) / 2];
};

export const getRerouteCoord = (coord1: [number, number], coord2: [number, number]): [number, number] => {
  const mid = getMidpoint(coord1, coord2);
  const dx = coord2[1] - coord1[1];
  const dy = coord2[0] - coord1[0];

  // A point perpendicular to the midpoint
  return [mid[0] + dx * 0.2, mid[1] - dy * 0.2];
};
