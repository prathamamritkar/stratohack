'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Network } from 'lucide-react';
import { getCoordinatesMap } from '@/lib/airport-coordinates';
import type { AirportData } from '@/lib/data-loader';

const RouteMap = dynamic(() => import('@/components/google-route-map'), { 
  ssr: false,
  loading: () => <Skeleton className="h-[600px] w-full" />
});

// Define some major routes for visualization
const routes = [
  ['JFK', 'LHR'],
  ['LAX', 'HND'],
  ['ORD', 'CDG'],
  ['DFW', 'DXB'],
  ['ATL', 'SFO'],
  ['DEN', 'JFK'],
  ['BOM', 'DXB'],
  ['DEL', 'LHR'],
];

interface HomePageClientProps {
  airportData: AirportData[];
}

export function HomePageClient({ airportData }: HomePageClientProps) {
  const airportCoordinates = getCoordinatesMap();
  
  const paths = routes.map(([origin, dest]) => {
    const originCoords = airportCoordinates[origin];
    const destCoords = airportCoordinates[dest];
    if (originCoords && destCoords) {
      return [originCoords, destCoords];
    }
    return [];
  }).filter(p => p.length > 0) as [number, number][][];

  return (
    <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground">
            Welcome to <span className="text-primary">AirNavFlow</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Interactive Airport Network Visualization
          </p>
        </header>

          <Card className="relative overflow-hidden shadow-2xl bg-card/80 backdrop-blur-sm border-accent/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Network className="w-8 h-8 text-primary" />
                <div>
                  <CardTitle className="text-2xl">Global Airport Network</CardTitle>
                  <CardDescription>An interactive visualization of major flight routes.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
               <RouteMap
                  isNetworkMap={true}
                  paths={paths}
                  allAirports={airportData.map(a => ({ code: a.code, coords: [a.lat, a.lon] }))}
                  containerClassName="h-[600px] w-full rounded-lg bg-muted relative overflow-hidden"
                />
            </CardContent>
          </Card>
    </div>
  );
}
