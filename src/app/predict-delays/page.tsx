'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, AlertTriangle, CheckCircle, Info, Plane, Zap } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

import { predictCascadingDelays, PredictCascadingDelaysOutput } from '@/ai/flows/predict-cascading-delays-flow';
import { airportCoordinates } from '@/lib/airport-coordinates';

const RouteMap = dynamic(() => import('@/components/google-route-map'), { 
  ssr: false,
  loading: () => <Skeleton className="h-[400px] w-full" />
});

const formSchema = z.object({
  airport: z.string().min(3, 'Airport code must be 3 characters').max(4, 'Airport code must be at most 4 characters').toUpperCase(),
});

type PredictionResult = PredictCascadingDelaysOutput;

export default function PredictDelaysPage() {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      airport: 'JFK',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setPrediction(null);
    
    if (!airportCoordinates[values.airport]) {
      setError('Invalid airport code. Please use a valid IATA code like JFK, LAX, etc.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await predictCascadingDelays({
        congestedAirport: values.airport,
      });
      setPrediction(result);

    } catch (e) {
      console.error(e);
      setError('Failed to generate prediction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }
  
  const congestedAirportCode = form.watch('airport');
  const congestedAirportCoords = airportCoordinates[congestedAirportCode];

  const affectedAirportsData = prediction?.affectedAirports.map(a => ({
      ...a,
      coords: airportCoordinates[a.airport]
  })).filter(a => a.coords) || [];

  const delayPaths = congestedAirportCoords && prediction ?
    affectedAirportsData.map(a => [congestedAirportCoords, a.coords!])
    : [];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline flex items-center gap-3">
            <Zap className="text-primary w-8 h-8" />
            Cascading Delay Prediction
          </h1>
          <p className="text-muted-foreground mt-2">
            Use a GNN model to predict the propagation of flight delays from a congested airport.
          </p>
        </header>
        
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                 <Card className="bg-card/80 border-accent/20">
                    <CardHeader>
                        <CardTitle>Prediction Parameters</CardTitle>
                        <CardDescription>Enter a congested airport to begin the simulation.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="airport"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Congested Airport (IATA Code)</FormLabel>
                                    <div className="relative">
                                    <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <FormControl>
                                        <Input placeholder="e.g., JFK, LAX, ORD" {...field} className="pl-10" />
                                    </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isLoading} className="bg-accent text-accent-foreground hover:bg-accent/90 w-full">
                            {isLoading ? (
                                <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Predicting Delays...
                                </>
                            ) : (
                                'Predict Delays'
                            )}
                            </Button>
                        </form>
                        </Form>
                    </CardContent>
                </Card>

                 {prediction && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Affected Airports</CardTitle>
                            <CardDescription>Airports likely to experience cascading delays.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                            {affectedAirportsData.map((airport) => (
                                <div key={airport.airport} className="p-4 bg-muted/50 rounded-lg space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-lg text-primary">{airport.airport}</span>
                                        <span className="text-sm font-mono p-1 px-2 rounded bg-destructive/20 text-destructive-foreground">{airport.predictedDelay} min delay</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Progress value={airport.delayProbability} className="h-2" />
                                        <span className="text-xs font-semibold text-muted-foreground w-16 text-right">{airport.delayProbability.toFixed(1)}%</span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </div>
            
            <div className="lg:col-span-2">
                <Card className={`transition-opacity`}>
                     <CardHeader>
                      <CardTitle>Delay Propagation Map</CardTitle>
                      <CardDescription>Visualization of predicted cascading delays.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                       <RouteMap 
                            key={congestedAirportCode}
                            isPredictionMap={true}
                            paths={delayPaths}
                            originAirport={{ code: congestedAirportCode, coords: congestedAirportCoords }}
                            affectedAirports={affectedAirportsData}
                            containerClassName="h-[600px] w-full rounded-lg bg-muted relative overflow-hidden"
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
