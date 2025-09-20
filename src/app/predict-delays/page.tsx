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
import { Loader2, AlertTriangle, CheckCircle, Info, Plane, Zap } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from '@/components/ui/progress';

import { predictCascadingDelays, PredictCascadingDelaysOutput } from '@/ai/flows/predict-cascading-delays-flow';

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

        <Card className="bg-card/80 border-accent/20">
          <CardHeader>
            <CardTitle>Prediction Parameters</CardTitle>
            <CardDescription>Enter a congested airport to begin the simulation.</CardDescription>
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
                </div>
                <Button type="submit" disabled={isLoading} className="bg-accent text-accent-foreground hover:bg-accent/90">
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

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {prediction && (
          <div className="space-y-6 pt-4">
            <Separator />
            <h2 className="text-2xl font-bold tracking-tight">Prediction Results for {form.getValues('airport')}</h2>
            <Card>
                <CardHeader>
                    <CardTitle>Affected Airports</CardTitle>
                    <CardDescription>The following airports are likely to experience cascading delays.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {prediction.affectedAirports.map((airport) => (
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
          </div>
        )}
      </div>
    </div>
  );
}
