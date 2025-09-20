'use server';

/**
 * @fileOverview An AI agent to predict cascading airport delays using a GNN model.
 *
 * - predictCascadingDelays - A function that predicts cascading delays.
 * - PredictCascadingDelaysInput - The input type for the predictCascadingDelays function.
 * - PredictCascadingDelaysOutput - The return type for the predictCascadingDelays function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const PredictCascadingDelaysInputSchema = z.object({
  congestedAirport: z.string().describe('The IATA code of the congested airport.'),
});
export type PredictCascadingDelaysInput = z.infer<typeof PredictCascadingDelaysInputSchema>;


const AffectedAirportSchema = z.object({
  airport: z.string().describe('The IATA code of the affected airport.'),
  delayProbability: z.number().min(0).max(100).describe('The probability of the delay cascading to this airport, as a percentage.'),
  predictedDelay: z.number().describe('The predicted delay in minutes.'),
});

export const PredictCascadingDelaysOutputSchema = z.object({
  affectedAirports: z.array(AffectedAirportSchema).describe('A ranked list of airports likely to be affected by cascading delays.'),
});
export type PredictCascadingDelaysOutput = z.infer<typeof PredictCascadingDelaysOutputSchema>;

export async function predictCascadingDelays(input: PredictCascadingDelaysInput): Promise<PredictCascadingDelaysOutput> {
  return predictCascadingDelaysFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictCascadingDelaysPrompt',
  input: { schema: PredictCascadingDelaysInputSchema },
  output: { schema: PredictCascadingDelaysOutputSchema },
  prompt: `You are a GNN-based airport traffic prediction model. Your task is to predict cascading delays from a congested airport.

  **Input:**
  - Congested Airport: {{{congestedAirport}}}
  
  **Simulation Logic:**
  1. Identify the top 5 most connected airports to the congested airport. The connected airports are ORD, LAX, DFW, DEN, ATL.
  2. For each connected airport, generate a realistic but varied delay probability and predicted delay time.
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
    const { output } = await prompt(input);
    return output!;
  }
);
