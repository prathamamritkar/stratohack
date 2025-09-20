'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, PlaneTakeoff, PlaneLanding, Percent, Fuel, Loader2 } from 'lucide-react';
import Image from 'next/image';
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { simulateReroute, SimulateRerouteOutput } from '@/ai/flows/simulate-reroute-flow';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
  origin: z.string().min(3, 'Airport code must be 3 characters').max(4, 'Airport code must be at most 4 characters').toUpperCase(),
  destination: z.string().min(3, 'Airport code must be 3 characters').max(4, 'Airport code must be at most 4 characters').toUpperCase(),
  congestion: z.number().min(0).max(100),
  fuelCost: z.number().min(0).max(200),
});

const chartConfig = {
  delayTime: {
    label: "Delay Time (min)",
    color: "hsl(var(--primary))",
  },
  cost: {
    label: "Cost ($)",
    color: "hsl(var(--accent-foreground))",
  },
};

export default function SimulateReroutesPage() {
  const [simulationResult, setSimulationResult] = useState<SimulateRerouteOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  
  const simulationData = simulationResult ? [
    { name: 'Original Route', delayTime: simulationResult.original.delay, cost: simulationResult.original.cost },
    { name: 'Simulated Reroute', delayTime: simulationResult.rerouted.delay, cost: simulationResult.rerouted.cost },
  ] : [];

  const calculatedSavings = simulationResult ? simulationResult.original.delay - simulationResult.rerouted.delay : 0;
  const costIncrease = simulationResult ? simulationResult.rerouted.cost - simulationResult.original.cost : 0;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">Rerouting Strategy Simulation</h1>
        <p className="text-muted-foreground">
          Simulate rerouting strategies to mitigate congestion and analyze the impact.
        </p>
      </header>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
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
                  
                  <Button type="submit" disabled={isLoading} className="w-full">
                     {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Simulating...
                      </>
                    ) : (
                      'Simulate Reroute'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className={!isLoading && !simulationResult ? 'opacity-50' : ''}>
            <CardHeader>
              <CardTitle>Simulation Results</CardTitle>
              <CardDescription>Comparison of original vs. simulated routes.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                  <div className="text-center py-12 text-muted-foreground flex items-center justify-center">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    <p>Running simulation...</p>
                  </div>
              ) : error ? (
                 <div className="text-center py-12 text-red-500">{error}</div>
              ) : simulationResult ? (
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Delay Time Saved</p>
                        <p className={`text-3xl font-bold ${calculatedSavings > 0 ? 'text-green-500' : 'text-red-500'}`}>{Math.abs(calculatedSavings)} min</p>
                    </div>
                     <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Cost Impact</p>
                        <p className={`text-3xl font-bold ${costIncrease > 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {costIncrease > 0 ? '+' : '-'}${Math.abs(costIncrease)}
                        </p>
                    </div>
                  </div>
                  
                  <Separator />

                  <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <BarChart data={simulationData} accessibilityLayer>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                       <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" />
                       <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--accent-foreground))" />
                      <RechartsTooltip cursor={false} content={<ChartTooltipContent />} />
                      <Bar dataKey="delayTime" yAxisId="left" fill="var(--color-delayTime)" radius={4} />
                      <Bar dataKey="cost" yAxisId="right" fill="var(--color-cost)" radius={4} />
                    </BarChart>
                  </ChartContainer>

                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Run a simulation to see the results.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className={!isLoading && !simulationResult ? 'opacity-50' : ''}>
            <CardHeader>
              <CardTitle>Route Visualization</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <h3 className="font-semibold text-center">Before</h3>
                 <div className="aspect-square w-full rounded-lg bg-muted relative overflow-hidden">
                   <Image src={simulationResult?.original.mapUrl || "https://picsum.photos/seed/route-before/400/400"} alt="Route before" fill data-ai-hint="flight route map"/>
                 </div>
               </div>
               <div className="space-y-2">
                 <h3 className="font-semibold text-center">After</h3>
                 <div className="aspect-square w-full rounded-lg bg-muted relative overflow-hidden">
                    <Image src={simulationResult?.rerouted.mapUrl || "https://picsum.photos/seed/route-after/400/400"} alt="Route after" fill data-ai-hint="alternate flight route"/>
                 </div>
               </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
