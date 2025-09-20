
"use client";

import React, { useCallback, useMemo } from "react";
import { GoogleMap, useJsApiLoader, MarkerF, Polyline, InfoWindow } from '@react-google-maps/api';
import { cn } from '@/lib/utils';
import { Skeleton } from "./ui/skeleton";
import { getMidpoint, airportCoordinates } from "@/lib/airport-coordinates";

interface Airport {
    code: string;
    coords?: [number, number];
}

interface AffectedAirport {
    airport: string;
    delayProbability: number;
    predictedDelay: number;
    coords?: [number, number];
}

interface RouteMapProps {
    airports?: {
        origin: Airport;
        destination: Airport;
        layover?: Airport;
    };
    path?: [number, number][];
    paths?: [number, number][][];
    isRerouted?: boolean;
    isNetworkMap?: boolean;
    isPredictionMap?: boolean;
    originAirport?: Airport;
    affectedAirports?: AffectedAirport[];
    containerClassName?: string;
}

const mapStyles = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
    { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
    { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
    { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
    { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
    { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
];

const RouteMap: React.FC<RouteMapProps> = ({ 
    airports, 
    path, 
    paths,
    isRerouted, 
    isNetworkMap,
    isPredictionMap,
    originAirport,
    affectedAirports,
    containerClassName 
}) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [selectedAirport, setSelectedAirport] = React.useState<AffectedAirport | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || ""
  });

  const center = useMemo(() => {
    if (airports?.origin.coords && airports?.destination.coords) {
      const midpoint = getMidpoint(airports.origin.coords, airports.destination.coords);
      return { lat: midpoint[0], lng: midpoint[1] };
    }
    return { lat: 20.5937, lng: 78.9629 }; // Default to India
  }, [airports?.origin.coords, airports?.destination.coords]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    const bounds = new window.google.maps.LatLngBounds();
    if (isNetworkMap || isPredictionMap) {
        (paths || []).flat().forEach(coords => {
             bounds.extend({ lat: coords[0], lng: coords[1] });
        });
        Object.values(airportCoordinates).forEach(coords => {
            if (coords) bounds.extend({ lat: coords[0], lng: coords[1] });
        });
    } else if (path) {
        path.forEach(p => bounds.extend({ lat: p[0], lng: p[1] }));
    }
    if (bounds.isEmpty()) {
      map.setCenter(center);
      map.setZoom(isNetworkMap ? 2 : 4);
    } else {
       map.fitBounds(bounds, 50);
    }
  }, [path, paths, isNetworkMap, isPredictionMap, center]);

  if (!apiKey) {
    return (
        <div className={cn("flex flex-col items-center justify-center text-center text-destructive bg-muted", containerClassName)}>
            <p className="font-bold">Google Maps API Key is missing.</p>
            <p className="text-xs text-muted-foreground mt-1">Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env file.</p>
        </div>
    );
  }

  if (loadError) {
    return (
      <div className={cn("flex flex-col items-center justify-center text-destructive bg-muted", containerClassName)}>
         <p>Error loading map.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return <Skeleton className={cn("h-full w-full", containerClassName)} />;
  }
  
  if (!isNetworkMap && !isPredictionMap && (!airports?.origin.coords || !airports?.destination.coords)) {
    return (
      <div className={cn("flex items-center justify-center text-muted-foreground bg-muted", containerClassName)}>
        Enter valid airport codes to see the route.
      </div>
    );
  }
  
  const getPinColor = (probability: number) => {
    if (probability > 75) return 'red'; // High risk
    if (probability > 40) return 'orange'; // Medium risk
    return 'yellow'; // Low risk
  };

  const markerLabel = (text: string, color: string = 'white') => ({
      text,
      color,
      fontWeight: 'bold',
      fontSize: '12px'
  });

  return (
    <div className={containerClassName}>
        <GoogleMap
          mapContainerStyle={{ height: '100%', width: '100%' }}
          center={center}
          zoom={3}
          onLoad={onMapLoad}
          options={{ styles: mapStyles, disableDefaultUI: true, zoomControl: true }}
        >
            {isNetworkMap && Object.entries(airportCoordinates).map(([code, coords]) => (
                <MarkerF key={code} position={{ lat: coords[0], lng: coords[1] }} label={markerLabel(code, 'white')} />
            ))}

            {isPredictionMap && originAirport?.coords && (
                 <MarkerF 
                    position={{ lat: originAirport.coords[0], lng: originAirport.coords[1] }} 
                    label={markerLabel(originAirport.code, 'white')}
                    icon={{ path: google.maps.SymbolPath.CIRCLE, scale: 8, fillColor: 'hsl(var(--primary))', fillOpacity: 1, strokeWeight: 2, strokeColor: 'white' }}
                 />
            )}
            {isPredictionMap && affectedAirports?.map((airport) => (
                airport.coords && <MarkerF 
                    key={airport.airport} 
                    position={{ lat: airport.coords[0], lng: airport.coords[1] }}
                    label={markerLabel(airport.airport, 'black')}
                    icon={{ path: google.maps.SymbolPath.CIRCLE, scale: 6, fillColor: getPinColor(airport.delayProbability), fillOpacity: 1, strokeWeight: 0 }}
                    onClick={() => setSelectedAirport(airport)}
                />
            ))}
            
            {selectedAirport && selectedAirport.coords && (
                <InfoWindow
                    position={{ lat: selectedAirport.coords[0], lng: selectedAirport.coords[1] }}
                    onCloseClick={() => setSelectedAirport(null)}
                >
                    <div className="bg-card text-card-foreground p-2 rounded-lg border-none shadow-lg">
                        <h4 className="font-bold text-base text-primary">{selectedAirport.airport}</h4>
                        <p>Delay: {selectedAirport.predictedDelay} mins</p>
                        <p>Probability: {selectedAirport.delayProbability.toFixed(1)}%</p>
                    </div>
                </InfoWindow>
            )}

            {!isNetworkMap && !isPredictionMap && airports?.origin.coords && airports?.destination.coords && (
              <>
                <MarkerF position={{ lat: airports.origin.coords[0], lng: airports.origin.coords[1] }} label={markerLabel(airports.origin.code)} />
                <MarkerF position={{ lat: airports.destination.coords[0], lng: airports.destination.coords[1] }} label={markerLabel(airports.destination.code)}/>
                {airports.layover?.coords && <MarkerF position={{ lat: airports.layover.coords[0], lng: airports.layover.coords[1] }} label={markerLabel(airports.layover.code)} />}
              </>
            )}

            {path && (
                <Polyline path={path.map(p => ({ lat: p[0], lng: p[1] }))} options={{ strokeColor: isRerouted ? 'hsl(var(--primary))' : 'hsl(var(--accent))', strokeOpacity: 1.0, strokeWeight: 3, geodesic: true }}/>
            )}

            {paths && paths.map((p, i) => (
                <Polyline key={i} path={p.map(coord => ({ lat: coord[0], lng: coord[1] }))} options={{ strokeColor: isPredictionMap ? 'hsl(var(--destructive))' : 'hsl(var(--primary))' , strokeOpacity: 0.7, strokeWeight: 2, geodesic: true }}/>
            ))}

        </GoogleMap>
    </div>
  );
};

export default RouteMap;


    
