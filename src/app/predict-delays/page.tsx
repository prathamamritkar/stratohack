'use client';
import { useState } from 'react';
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
import { Loader2, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { selectGnnModel, SelectGnnModelOutput } from '@/ai/flows/gnn-model-selection';
import { explainDelayFactors, ExplainDelayFactorsOutput } from '@/ai/flows/explain-delay-factors';

const formSchema = z.object({
  airport: z.string().min(3, 'Airport code must be 3 characters').max(4, 'Airport code must be at most 4 characters').toUpperCase(),
  criteria: z.string().min(10, 'Please provide more detailed criteria.'),
});

type PredictionResult = {
  modelSelection: SelectGnnModelOutput;
  delayExplanation: ExplainDelayFactorsOutput;
};

const mockMetrics = ['Degree Centrality', 'Betweenness Centrality', 'Average Flight Duration', 'Hourly Arrivals/Departures'];
const mockPrediction = 'High probability of cascading delays affecting 5 connected airports within the next 6 hours.';


export default function PredictDelaysPage() {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      airport: 'JFK',
      criteria: 'Prioritize accuracy for short-term predictions in a dense network.',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const modelSelection = await selectGnnModel({
        airport: values.airport,
        gnnModelSelectionCriteria: values.criteria,
      });

      const delayExplanation = await explainDelayFactors({
        airport: values.airport,
        metrics: mockMetrics,
        prediction: mockPrediction,
      });
      
      setPrediction({ modelSelection, delayExplanation });

    } catch (e) {
      console.error(e);
      setError('Failed to generate prediction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
      <div className="space-y-4">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">Cascading Delay Prediction</h1>
          <p className="text-muted-foreground">
            Use AI to select a GNN model and predict the propagation of flight delays.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Prediction Parameters</CardTitle>
            <CardDescription>Enter a congested airport and criteria for model selection.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="airport"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Congested Airport (IATA Code)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., JFK, LAX, ORD" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="criteria"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GNN Model Selection Criteria</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., High accuracy, fast inference..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Prediction...
                    </>
                  ) : (
                    'Predict Delays'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {prediction && (
          <div className="space-y-4 pt-4">
            <Separator />
            <h2 className="text-2xl font-bold tracking-tight">Prediction Results for {form.getValues('airport')}</h2>
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-card/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="text-green-500" />
                            GNN Model Selected
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-baseline gap-2">
                            <p className="text-4xl font-bold text-primary">{prediction.modelSelection.selectedModel}</p>
                            <p className="text-sm text-muted-foreground">selected</p>
                        </div>
                        <Alert>
                            <Info className="h-4 w-4" />
                            <AlertTitle>Justification</AlertTitle>
                            <AlertDescription>
                                {prediction.modelSelection.justification}
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>

                <Card className="bg-card/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <AlertTriangle className="text-orange-500"/>
                            Delay Factors Analysis
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Predicted Impact</AlertTitle>
                            <AlertDescription>
                                {mockPrediction}
                            </AlertDescription>
                        </Alert>
                        <div>
                            <h4 className="font-semibold mb-2">Key Influential Metrics:</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap font-mono p-4 bg-muted rounded-md">
                                {prediction.delayExplanation.explanation}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
