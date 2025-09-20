'use server';

/**
 * @fileOverview An AI agent to simulate rerouting strategies for flights.
 *
 * - simulateReroute - A function that handles the flight rerouting simulation.
 * - SimulateRerouteInput - The input type for the simulateReroute function.
 * - SimulateRerouteOutput - The return type for the simulateReroute function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SimulateRerouteInputSchema = z.object({
  origin: z.string().describe('The IATA code of the origin airport.'),
  destination: z.string().describe('The IATA code of the destination airport.'),
  congestion: z.number().describe('The congestion level at the origin airport, as a percentage (0-100).'),
  fuelCost: z.number().describe('A factor for fuel cost, as a percentage of the standard cost (e.g., 100% is normal, 120% is 20% more expensive).'),
});
export type SimulateRerouteInput = z.infer<typeof SimulateRerouteInputSchema>;

const RouteDetailsSchema = z.object({
  delay: z.number().describe('The total delay time in minutes.'),
  cost: z.number().describe('The total cost of the flight in INR.'),
  mapUrl: z.string().url().describe('A URL to an image visualizing the flight path.'),
});

const SimulateRerouteOutputSchema = z.object({
  original: RouteDetailsSchema.describe('The details for the original, direct route.'),
  rerouted: RouteDetailsSchema.describe('The details for the simulated rerouted path.'),
});
export type SimulateRerouteOutput = z.infer<typeof SimulateRerouteOutputSchema>;

export async function simulateReroute(input: SimulateRerouteInput): Promise<SimulateRerouteOutput> {
  return simulateRerouteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'simulateReroutePrompt',
  input: { schema: SimulateRerouteInputSchema },
  output: { schema: SimulateRerouteOutputSchema },
  prompt: `You are a flight logistics simulator. Your task is to calculate the delay and cost for a flight's original route and a simulated rerouted path based on airport congestion and fuel costs.

  **Input:**
  - Origin: {{{origin}}}
  - Destination: {{{destination}}}
  - Congestion Level: {{{congestion}}}%
  - Fuel Cost Factor: {{{fuelCost}}}%

  **Simulation Logic:**
  1.  **Original Route:**
      - The base delay is 20 minutes.
      - The base cost is 700000 INR.
      - Delay increases with congestion. For every 1% of congestion, add 2 minutes of delay to the base delay.
      - Cost is not affected by congestion on the original route.

  2.  **Rerouted Path:**
      - Rerouting avoids all congestion delay, so the delay is a flat 45 minutes regardless of the congestion input.
      - Rerouting has a higher base cost of 725000 INR.
      - The final cost of the rerouted path is affected by the fuel cost factor. Multiply the rerouted base cost by the fuel cost factor percentage.
      - For example, if fuel cost factor is 120%, the final cost is 725000 * 1.20.

  3.  **Map URLs:**
      - For the original route, use the URL: \`https://picsum.photos/seed/{{origin}}-{{destination}}-orig/400/400\`
      - For the rerouted path, use the URL: \`https://picsum.photos/seed/{{origin}}-{{destination}}-reroute/400/400\`

  Calculate the values and provide the output in the specified JSON format.
  `,
});

const simulateRerouteFlow = ai.defineFlow(
  {
    name: 'simulateRerouteFlow',
    inputSchema: SimulateRerouteInputSchema,
    outputSchema: SimulateRerouteOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
