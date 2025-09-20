'use client';

import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, PlaneTakeoff, PlaneLanding, Percent, Fuel } from 'lucide-react';
import Image from 'next/image';
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";

const simulationData = [
  { name: 'Original Route', delayTime: 120, cost: 8500 },
  { name: 'Simulated Reroute', delayTime: 45, cost: 9200 },
];

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
  const [congestion, setCongestion] = useState([50]);
  const [fuelCost, setFuelCost] = useState([100]);
  const [isSimulated, setIsSimulated] = useState(false);

  const handleSimulate = () => {
    setIsSimulated(true);
  };

  const calculatedSavings = isSimulated ? simulationData[0].delayTime - simulationData[1].delayTime : 0;
  const costIncrease = isSimulated ? simulationData[1].cost - simulationData[0].cost : 0;

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
            <CardContent className="space-y-6">
              <div className="flex gap-4 items-center">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="origin">Origin</Label>
                  <div className="relative">
                    <PlaneTakeoff className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="origin" defaultValue="JFK" className="pl-9" />
                  </div>
                </div>
                <ArrowRight className="mt-7 text-muted-foreground" />
                <div className="flex-1 space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                   <div className="relative">
                    <PlaneLanding className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="destination" defaultValue="SFO" className="pl-9" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="congestion" className="flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    Congestion Level: {congestion[0]}%
                </Label>
                <Slider id="congestion" defaultValue={[50]} max={100} step={1} onValueChange={setCongestion} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuel-cost" className="flex items-center gap-2">
                    <Fuel className="h-4 w-4" />
                    Fuel Cost Factor: {fuelCost[0]}%
                </Label>
                <Slider id="fuel-cost" defaultValue={[100]} max={200} step={5} onValueChange={setFuelCost} />
              </div>
              
              <Button onClick={handleSimulate} className="w-full">
                Simulate Reroute
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className={isSimulated ? 'opacity-100' : 'opacity-50'}>
            <CardHeader>
              <CardTitle>Simulation Results</CardTitle>
              <CardDescription>Comparison of original vs. simulated routes.</CardDescription>
            </CardHeader>
            <CardContent>
              {isSimulated ? (
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Delay Time Saved</p>
                        <p className="text-3xl font-bold text-green-500">{calculatedSavings} min</p>
                    </div>
                     <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Additional Cost</p>
                        <p className="text-3xl font-bold text-red-500">${costIncrease}</p>
                    </div>
                  </div>
                  
                  <Separator />

                  <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <BarChart data={simulationData} accessibilityLayer>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                       <YAxis />
                      <RechartsTooltip cursor={false} content={<ChartTooltipContent />} />
                      <Bar dataKey="delayTime" fill="var(--color-delayTime)" radius={4} />
                      <Bar dataKey="cost" fill="var(--color-cost)" radius={4} />
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

          <Card className={isSimulated ? 'opacity-100' : 'opacity-50'}>
            <CardHeader>
              <CardTitle>Route Visualization</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <h3 className="font-semibold text-center">Before</h3>
                 <div className="aspect-square w-full rounded-lg bg-muted relative overflow-hidden">
                   <Image src="https://picsum.photos/seed/route-before/400/400" alt="Route before" fill data-ai-hint="flight route map"/>
                 </div>
               </div>
               <div className="space-y-2">
                 <h3 className="font-semibold text-center">After</h3>
                 <div className="aspect-square w-full rounded-lg bg-muted relative overflow-hidden">
                    <Image src="https://picsum.photos/seed/route-after/400/400" alt="Route after" fill data-ai-hint="alternate flight route"/>
                 </div>
               </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
