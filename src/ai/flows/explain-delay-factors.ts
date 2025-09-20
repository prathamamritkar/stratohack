'use server';

/**
 * @fileOverview An AI agent to explain the influential graph metrics in predicting cascading delays.
 *
 * - explainDelayFactors - A function that explains the delay factors.
 * - ExplainDelayFactorsInput - The input type for the explainDelayFactors function.
 * - ExplainDelayFactorsOutput - The return type for the explainDelayFactors function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainDelayFactorsInputSchema = z.object({
  airport: z.string().describe('The IATA code of the airport for which to explain delay factors.'),
  metrics: z.array(z.string()).describe('The graph metrics considered by the model, such as degree centrality, betweenness centrality, average duration, hourly arrivals/departures.'),
  prediction: z.string().describe('The predicted delay information for the airport.'),
});
export type ExplainDelayFactorsInput = z.infer<typeof ExplainDelayFactorsInputSchema>;

const ExplainDelayFactorsOutputSchema = z.object({
  explanation: z.string().describe('An explanation of which graph metrics were most influential in predicting cascading delays for the given airport.'),
});
export type ExplainDelayFactorsOutput = z.infer<typeof ExplainDelayFactorsOutputSchema>;

export async function explainDelayFactors(input: ExplainDelayFactorsInput): Promise<ExplainDelayFactorsOutput> {
  return explainDelayFactorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainDelayFactorsPrompt',
  input: {schema: ExplainDelayFactorsInputSchema},
  output: {schema: ExplainDelayFactorsOutputSchema},
  prompt: `You are an AI assistant that explains the factors influencing cascading delay predictions for airports.

  Given an airport, a list of graph metrics, and the prediction made, explain which of the graph metrics were most influential in the prediction and why.

  Airport: {{airport}}
  Metrics: {{metrics}}
  Prediction: {{prediction}}
  \n
  Explain the influence of each metric in a concise manner, focusing on how they contributed to the prediction.
  Conclude with a summary of the most important factors.
  `,
});

const explainDelayFactorsFlow = ai.defineFlow(
  {
    name: 'explainDelayFactorsFlow',
    inputSchema: ExplainDelayFactorsInputSchema,
    outputSchema: ExplainDelayFactorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
