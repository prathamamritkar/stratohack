'use client';

import { useState, Suspense } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, PlaneTakeoff, PlaneLanding, Percent, Fuel, Loader2 } from 'lucide-react';
import { simulateReroute, SimulateRerouteOutput } from '@/ai/flows/simulate-reroute-flow';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Skeleton } from '@/components/ui/skeleton';
import { getCoordinatesMap, findBestReroute } from '@/lib/airport-coordinates';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


const SimulationChart = dynamic(() => import('@/components/simulation-chart'));
const RouteMap = dynamic(() => import('@/components/google-route-map'), { 
  ssr: false,
  loading: () => <Skeleton className="h-[400px] w-full" />
});


const formSchema = z.object({
  origin: z.string().min(3, 'Airport code must be 3 characters').max(4, 'Airport code must be at most 4 characters').toUpperCase(),
  destination: z.string().min(3, 'Airport code must be 3 characters').max(4, 'Airport code must be at most 4 characters').toUpperCase(),
  congestion: z.number().min(0).max(100),
  fuelCost: z.number().min(0).max(200),
});

export function SimulateReroutesClientPage() {
  const [simulationResult, setSimulationResult] = useState<SimulateRerouteOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const airportCoordinates = getCoordinatesMap();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      origin: 'JFK',
      destination: 'SFO',
      congestion: 50,
      fuelCost: 100,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setSimulationResult(null);

    if (!airportCoordinates[values.origin] || !airportCoordinates[values.destination]) {
      setError('Invalid airport code(s). Please use codes like JFK, SFO, LAX, BOM, DEL.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await simulateReroute(values);
      setSimulationResult(result);
    } catch (e) {
      console.error(e);
      setError('Failed to run simulation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const congestionValue = form.watch('congestion');
  const fuelCostValue = form.watch('fuelCost');
  const origin = form.watch('origin');
  const destination = form.watch('destination');

  const calculatedSavings = simulationResult ? simulationResult.original.delay - simulationResult.rerouted.delay : 0;
  const costIncrease = simulationResult ? simulationResult.rerouted.cost - simulationResult.original.cost : 0;
  
  const originCoords = airportCoordinates[origin];
  const destCoords = airportCoordinates[destination];
  
  const originalRoute = originCoords && destCoords ? [originCoords, destCoords] : [];
  
  const rerouteAirportCode = originCoords && destCoords ? findBestReroute(origin, destination) : null;
  const rerouteAirportCoords = rerouteAirportCode ? airportCoordinates[rerouteAirportCode] : null;
  const reroutedPath = originCoords && destCoords && rerouteAirportCoords ? [originCoords, rerouteAirportCoords, destCoords] : [];


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-card/80 border-accent/20">
            <CardHeader>
              <CardTitle>Simulation Setup</CardTitle>
              <CardDescription>Define the route and simulation variables.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <FormField
                      control={form.control}
                      name="origin"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <Label htmlFor="origin">Origin</Label>
                           <div className="relative">
                            <PlaneTakeoff className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <FormControl>
                              <Input id="origin" {...field} className="pl-9" />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <ArrowRight className="mt-9 text-muted-foreground" />
                     <FormField
                      control={form.control}
                      name="destination"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <Label htmlFor="destination">Destination</Label>
                           <div className="relative">
                            <PlaneLanding className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                             <FormControl>
                              <Input id="destination" {...field} className="pl-9" />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Controller
                      control={form.control}
                      name="congestion"
                      render={({ field }) => (
                        <FormItem>
                           <Label htmlFor="congestion" className="flex items-center gap-2">
                              <Percent className="h-4 w-4" />
                              Congestion Level: {congestionValue}%
                          </Label>
                           <FormControl>
                              <Slider
                                id="congestion"
                                value={[field.value]}
                                onValueChange={(value) => field.onChange(value[0])}
                                max={100}
                                step={1}
                              />
                           </FormControl>
                        </FormItem>
                      )}
                    />

                  <Controller
                      control={form.control}
                      name="fuelCost"
                      render={({ field }) => (
                         <FormItem>
                            <Label htmlFor="fuel-cost" className="flex items-center gap-2">
                                <Fuel className="h-4 w-4" />
                                Fuel Cost Factor: {fuelCostValue}%
                            </Label>
                             <FormControl>
                                <Slider
                                  id="fuel-cost"
                                  value={[field.value]}
                                  onValueChange={(value) => field.onChange(value[0])}
                                  max={200}
                                  step={5}
                                />
                             </FormControl>
                          </FormItem>
                      )}
                    />
                  
                  <AnimatedButton type="submit" disabled={isLoading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                     {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Simulating...
                      </>
                    ) : (
                      'Simulate Reroute'
                    )}
                  </AnimatedButton>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className={`transition-opacity`}>
            <CardHeader>
              <CardTitle>Simulation Results</CardTitle>
              <CardDescription>Comparison of original vs. simulated routes.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                  <div className="text-center py-12 text-muted-foreground flex flex-col items-center justify-center">
                    <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                    <p className="mt-4 font-semibold">Running simulation...</p>
                  </div>
              ) : error ? (
                 <div className="text-center py-12 text-destructive">{error}</div>
              ) : simulationResult ? (
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Delay Time Saved</p>
                        <p className={`text-3xl font-bold ${calculatedSavings > 0 ? 'text-green-400' : 'text-red-400'}`}>{Math.abs(calculatedSavings)} min</p>
                    </div>
                     <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Cost Impact</p>
                        <p className={`text-3xl font-bold ${costIncrease > 0 ? 'text-red-400' : 'text-green-400'}`}>
                          {costIncrease > 0 ? '+' : '-'}₹{Math.abs(costIncrease).toLocaleString('en-IN')}
                        </p>
                    </div>
                  </div>
                  
                  <Separator />

                  <Suspense fallback={<Skeleton className="h-[250px] w-full" />}>
                     <SimulationChart data={simulationResult} />
                  </Suspense>

                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Run a simulation to see the results.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className={`transition-opacity`}>
             <CardHeader>
              <CardTitle>Route Visualization</CardTitle>
              <CardDescription>
                Rerouted through {rerouteAirportCode ? <span className="font-bold text-primary">{rerouteAirportCode}</span> : '...'}
              </CardDescription>
            </CardHeader>
            <CardContent>
               <Tabs defaultValue="original" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="original">Original Route</TabsTrigger>
                  <TabsTrigger value="rerouted">Rerouted Path</TabsTrigger>
                </TabsList>
                <TabsContent value="original" className="mt-4">
                    <RouteMap 
                        key="original-map"
                        airports={{origin: {code: origin, coords: originCoords}, destination: {code: destination, coords: destCoords}}}
                        path={originalRoute}
                        isRerouted={false} 
                        containerClassName="h-[400px] w-full rounded-lg bg-muted relative overflow-hidden"
                      />
                </TabsContent>
                <TabsContent value="rerouted" className="mt-4">
                    <RouteMap
                        key="rerouted-map"
                        airports={{
                            origin: {code: origin, coords: originCoords}, 
                            destination: {code: destination, coords: destCoords},
                            layover: rerouteAirportCode ? { code: rerouteAirportCode, coords: rerouteAirportCoords } : undefined,
                        }}
                        path={reroutedPath} 
                        isRerouted={true}
                        containerClassName="h-[400px] w-full rounded-lg bg-muted relative overflow-hidden"
                      />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
