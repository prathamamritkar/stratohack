"use client";

import React, { useCallback, useMemo } from "react";
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';
import { cn } from '@/lib/utils';
import { Skeleton } from "./ui/skeleton";
import { getMidpoint } from "@/lib/airport-coordinates";

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

const mapStyles = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }],
    },
];

const GoogleRouteMap: React.FC<RouteMapProps> = ({ airports, path, isRerouted, containerClassName }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  });

  const pathForPolyline = useMemo(() => path.map(p => ({ lat: p[0], lng: p[1] })), [path]);
  const center = useMemo(() => {
    if (airports.origin.coords && airports.destination.coords) {
      const midpoint = getMidpoint(airports.origin.coords, airports.destination.coords);
      return { lat: midpoint[0], lng: midpoint[1] };
    }
    return { lat: 20.5937, lng: 78.9629 }; // Default to India
  }, [airports.origin.coords, airports.destination.coords]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    if (pathForPolyline.length > 1) {
        const bounds = new window.google.maps.LatLngBounds();
        pathForPolyline.forEach(point => bounds.extend(point));
        map.fitBounds(bounds);
    }
  }, [pathForPolyline]);

  if (loadError) {
    return (
      <div className={cn("flex flex-col items-center justify-center text-destructive bg-muted", containerClassName)}>
         <p>Error loading map.</p>
         <p className="text-xs text-muted-foreground">Please ensure your Google Maps API key is configured correctly.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return <Skeleton className={cn("h-full w-full", containerClassName)} />;
  }
  
  if (!airports.origin.coords || !airports.destination.coords) {
    return (
      <div className={cn("flex items-center justify-center text-muted-foreground bg-muted", containerClassName)}>
        Enter valid airport codes to see the route.
      </div>
    );
  }

  return (
    <div className={containerClassName}>
        <GoogleMap
          mapContainerStyle={{ height: '100%', width: '100%' }}
          center={center}
          zoom={3}
          onLoad={onMapLoad}
          options={{ 
            styles: mapStyles,
            disableDefaultUI: true,
            zoomControl: true,
          }}
        >
            <Marker position={{ lat: airports.origin.coords[0], lng: airports.origin.coords[1] }} label={{ text: airports.origin.code, color: 'white', fontWeight: 'bold' }} />
            <Marker position={{ lat: airports.destination.coords[0], lng: airports.destination.coords[1] }} label={{ text: airports.destination.code, color: 'white', fontWeight: 'bold' }}/>

            <Polyline
              path={pathForPolyline}
              options={{
                strokeColor: isRerouted ? 'hsl(var(--primary))' : 'hsl(var(--accent))',
                strokeOpacity: 1.0,
                strokeWeight: 3,
                icons: isRerouted ? undefined : [{
                    icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 4 },
                    offset: '0',
                    repeat: '20px'
                }]
              }}
            />
        </GoogleMap>
    </div>
  );
};

export default GoogleRouteMap;
