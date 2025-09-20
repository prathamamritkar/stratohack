"use client";

import * as React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression, divIcon, LatLngBounds } from 'leaflet';
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

function MapUpdater({ airports, path, isRerouted }: RouteMapProps) {
  const map = useMap();

  React.useEffect(() => {
    if (path.length >= 2) {
      const bounds = new LatLngBounds(path as LatLngExpression[]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (airports.origin.coords) {
       map.flyTo(airports.origin.coords, 3);
    }
  }, [map, path, airports.origin.coords]);

  React.useEffect(() => {
    return () => {
      // When the component unmounts, remove the map
      // This is a forceful cleanup to prevent initialization errors on hot-reloads
      map.remove();
    };
  }, [map]);

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
}


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
      <MapContainer
        center={center}
        zoom={3}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%', backgroundColor: 'hsl(var(--muted))' }}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
        />
        <MapUpdater airports={airports} path={path} isRerouted={isRerouted} />
      </MapContainer>
    </div>
  );
};

export default RouteMap;