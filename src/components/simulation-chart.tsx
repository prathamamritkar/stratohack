"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { SimulateRerouteOutput } from '@/ai/flows/simulate-reroute-flow';

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

interface SimulationChartProps {
  data: SimulateRerouteOutput;
}

export default function SimulationChart({ data }: SimulationChartProps) {
    const simulationData = [
        { name: 'Original Route', delayTime: data.original.delay, cost: data.original.cost },
        { name: 'Simulated Reroute', delayTime: data.rerouted.delay, cost: data.rerouted.cost },
    ];

  return (
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
  );
}
