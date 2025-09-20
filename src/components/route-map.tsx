"use client";

import * as React from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression, divIcon } from 'leaflet';
import { cn } from '@/lib/utils';
import { getMidpoint } from '@/lib/airport-coordinates';

interface Airport {
    code: string;
    coords?: [number, number];
}

interface RouteMapProps {
    airports: {
        origin: Airport;
        destination: Airport;
    };
    path: [number, number][];
    isRerouted: boolean;
    containerClassName?: string;
}

const createAirportIcon = (code: string) => {
  return divIcon({
    html: `<div class="bg-primary/80 text-primary-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-primary-foreground shadow-md">${code}</div>`,
    className: 'bg-transparent border-none',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Component to draw the path and markers
const RoutePath: React.FC<Omit<RouteMapProps, 'containerClassName'>> = ({ airports, path, isRerouted }) => {
  const map = useMap();

  React.useEffect(() => {
    if (path.length > 1 && airports.origin.coords && airports.destination.coords) {
        const bounds = [airports.origin.coords, airports.destination.coords];
        map.fitBounds(bounds, { padding: [50, 50] });
    } else if (airports.origin.coords) {
        map.setView(airports.origin.coords, 5);
    } else if (airports.destination.coords) {
        map.setView(airports.destination.coords, 5);
    }
  }, [map, path, airports.origin.coords, airports.destination.coords]);

  return (
    <>
      {airports.origin.coords && (
        <Marker position={airports.origin.coords as LatLngExpression} icon={createAirportIcon(airports.origin.code)}>
          <Popup>{airports.origin.code} - Origin</Popup>
        </Marker>
      )}
      {airports.destination.coords && (
        <Marker position={airports.destination.coords as LatLngExpression} icon={createAirportIcon(airports.destination.code)}>
          <Popup>{airports.destination.code} - Destination</Popup>
        </Marker>
      )}
      {path.length > 0 && (
        <Polyline
          positions={path as LatLngExpression[]}
          color={isRerouted ? 'hsl(var(--primary))' : 'hsl(var(--accent))'}
          dashArray={isRerouted ? undefined : '5, 10'}
          weight={3}
        />
      )}
    </>
  );
};


const RouteMap = React.memo(function RouteMap({ airports, path, isRerouted, containerClassName }: RouteMapProps) {
  if (!airports.origin.coords || !airports.destination.coords) {
    return <div className={cn("flex items-center justify-center text-muted-foreground bg-muted", containerClassName)}>
        Enter valid airport codes to see the route.
    </div>;
  }
  
  const center = getMidpoint(airports.origin.coords, airports.destination.coords);
  
  // A unique key for the container to ensure it's re-created if core props change, but stable otherwise.
  const mapKey = `${airports.origin.code}-${airports.destination.code}`;

  return (
    <div className={containerClassName}>
      <MapContainer key={mapKey} center={center} zoom={3} scrollWheelZoom={false} style={{ height: '100%', width: '100%', backgroundColor: 'hsl(var(--muted))' }} attributionControl={false}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
        />
        <RoutePath airports={airports} path={path} isRerouted={isRerouted} />
      </MapContainer>
    </div>
  );
});

export default RouteMap;
