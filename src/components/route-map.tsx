"use client";

import * as React from "react";
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
    html: `<div class="bg-primary/80 text-primary-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-primary-foreground shadow-md">${code.substring(0, 3)}</div>`,
    className: 'bg-transparent border-none',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const RoutePath: React.FC<Omit<RouteMapProps, 'containerClassName'>> = ({ airports, path, isRerouted }) => {
  const map = useMap();

  React.useEffect(() => {
    if (path.length > 1 && airports.origin.coords && airports.destination.coords) {
        const bounds = [airports.origin.coords, airports.destination.coords];
        if (isRerouted && path.length > 2) {
            bounds.push(path[1]);
        }
        map.fitBounds(bounds as LatLngExpression[], { padding: [50, 50] });
    } else if (airports.origin.coords) {
        map.setView(airports.origin.coords, 5);
    } else if (airports.destination.coords) {
        map.setView(airports.destination.coords, 5);
    }
    
    // Cleanup function to remove map on component unmount
    return () => {
        map.remove();
    };

  }, [map, path, airports.origin.coords, airports.destination.coords, isRerouted]);

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
          pathOptions={{
            color: isRerouted ? 'hsl(var(--primary))' : 'hsl(var(--accent))',
            dashArray: isRerouted ? undefined : '5, 10',
            weight: 3
          }}
        />
      )}
    </>
  );
};

// This component is memoized to prevent re-rendering of MapContainer
const MapDisplay = React.memo(
  function MapDisplay({ children, center }: { children: React.ReactNode, center: LatLngExpression }) {
    return (
      <MapContainer
        center={center}
        zoom={3}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%', backgroundColor: 'hsl(var(--muted))' }}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png" />
        {children}
      </MapContainer>
    );
  }
);


const RouteMap: React.FC<RouteMapProps> = ({ airports, path, isRerouted, containerClassName }) => {

  if (!airports.origin.coords || !airports.destination.coords) {
    return (
      <div className={cn("flex items-center justify-center text-muted-foreground bg-muted", containerClassName)}>
        Enter valid airport codes to see the route.
      </div>
    );
  }
  
  const center = getMidpoint(airports.origin.coords, airports.destination.coords);
  
  return (
    <div className={containerClassName}>
       <MapDisplay center={center}>
          <RoutePath airports={airports} path={path} isRerouted={isRerouted} />
       </MapDisplay>
    </div>
  );
};

export default RouteMap;
