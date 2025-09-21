'use server';

/**
 * @fileOverview An AI agent to predict cascading airport delays using a GNN model.
 *
 * - predictCascadingDelays - A function that predicts cascading delays.
 * - PredictCascadingDelaysInput - The input type for the predictCascadingDelays function.
 * - PredictCascadingDelaysOutput - The return type for the predictCascadingDelays function.
 */

import { ai } from '@/ai/genkit';
import { getAirportData } from '@/lib/data-loader';
import { z } from 'genkit';

const PredictCascadingDelaysInputSchema = z.object({
  congestedAirport: z.string().describe('The IATA code of the congested airport.'),
});
export type PredictCascadingDelaysInput = z.infer<typeof PredictCascadingDelaysInputSchema>;


const AffectedAirportSchema = z.object({
  airport: z.string().describe('The IATA code of the affected airport.'),
  delayProbability: z.number().min(0).max(100).describe('The probability of the delay cascading to this airport, as a percentage.'),
  predictedDelay: z.number().describe('The predicted delay in minutes.'),
});

const PredictCascadingDelaysOutputSchema = z.object({
  affectedAirports: z.array(AffectedAirportSchema).describe('A ranked list of airports likely to be affected by cascading delays.'),
});
export type PredictCascadingDelaysOutput = z.infer<typeof PredictCascadingDelaysOutputSchema>;

export async function predictCascadingDelays(input: PredictCascadingDelaysInput): Promise<PredictCascadingDelaysOutput> {
  return predictCascadingDelaysFlow(input);
}

const promptTemplate = ai.definePrompt({
  name: 'predictCascadingDelaysPrompt',
  input: { schema: PredictCascadingDelaysInputSchema.extend({ connectedAirports: z.array(z.string()) }) },
  output: { schema: PredictCascadingDelaysOutputSchema },
  prompt: `You are a GNN-based airport traffic prediction model. Your task is to predict cascading delays from a congested airport.

  **Input:**
  - Congested Airport: {{{congestedAirport}}}
  - Connected Airports: {{{json an=connectedAirports}}}
  
  **Simulation Logic:**
  1. From the list of connected airports, select the top 5 most relevant ones for this simulation.
  2. For each of the 5 selected airports, generate a realistic but varied delay probability and predicted delay time.
     - Probability should be high for the most connected airports and lower for others.
     - Predicted delay should correlate with probability (higher probability = higher delay).
     - Ensure the output is a ranked list, with the highest probability first.
  3.  The values should be different for each airport and for each request, to simulate a real dynamic model. Do not return the same values for all airports.
  
  Provide the output in the specified JSON format.
  `,
});

const predictCascadingDelaysFlow = ai.defineFlow(
  {
    name: 'predictCascadingDelaysFlow',
    inputSchema: PredictCascadingDelaysInputSchema,
    outputSchema: PredictCascadingDelaysOutputSchema,
  },
  async (input) => {
    // In a real application, you would have a graph and find the actual connected airports.
    // Here, we'll just grab a random subset of airports from our dataset to simulate this.
    const allAirports = await getAirportData();
    const connectedAirports = allAirports
      .map(a => a.code)
      .filter(code => code !== input.congestedAirport)
      .sort(() => 0.5 - Math.random()) // Shuffle
      .slice(0, 10); // Take 10 random ones
      
    const { output } = await promptTemplate({...input, connectedAirports });
    return output!;
  }
);
