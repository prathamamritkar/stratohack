"use client";

import { useState } from 'react';
import { Input, Button, Spin, List, Card } from 'antd';

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
                <Button type="primary" onClick={handlePrediction} loading={loading}>
                    Predict Delays
                </Button>
            </div>

            {loading && <div className="text-center"><Spin /></div>}

            {results && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Prediction Results for {airport}</h2>
                    <List
                        grid={{ gutter: 16, column: 1 }}
                        dataSource={results.delayChain}
                        renderItem={(chain: any[], index: number) => (
                            <List.Item>
                                <Card title={`Delay Chain ${index + 1}`}>
                                    {chain.map((flight, flightIndex) => (
                                        <p key={flightIndex}>
                                            Flight {flight.callsign?.trim()} from {flight.origin} to {flight.estarrivalairport} - Potential Delay
                                        </p>
                                    ))}
                                </Card>
                            </List.Item>
                        )}
                    />
                </div>
            )}
        </div>
    );
}
