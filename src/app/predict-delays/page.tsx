"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PredictDelaysPage() {
    const [airport, setAirport] = useState('JFK');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any>(null);

    const handlePrediction = () => {
        setLoading(true);
        fetch(`/api/predict-delays?airport=${airport}`)
            .then(res => res.json())
            .then(data => {
                setResults(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch delay predictions", err);
                setLoading(false);
            });
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold text-center my-8">Cascading Delay Prediction</h1>
            <div className="flex justify-center items-center gap-4 mb-8">
                <Input
                    placeholder="Enter Airport Code (e.g., JFK)"
                    value={airport}
                    onChange={e => setAirport(e.target.value.toUpperCase())}
                    className="max-w-xs"
                />
                <Button onClick={handlePrediction} disabled={loading}>
                    {loading ? 'Predicting...' : 'Predict Delays'}
                </Button>
            </div>

            {loading && <div className="text-center"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}

            {results && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Prediction Results for {airport}</h2>
                    <div className="space-y-4">
                        {results.delayChain && results.delayChain.map((chain: any[], index: number) => (
                            <Card key={index}>
                                <CardHeader>
                                    <CardTitle>Delay Chain {index + 1}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {chain.map((flight, flightIndex) => (
                                        <p key={flightIndex} className="mb-2">
                                            Flight {flight.callsign?.trim()} from {flight.origin} to {flight.estarrivalairport} - Potential Delay
                                        </p>
                                    ))}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
