"use client";

import { useState } from 'react';
import { Input, Button, Spin, Card } from 'antd';

export default function SimulateReroutesPage() {
    const [origin, setOrigin] = useState('JFK');
    const [destination, setDestination] = useState('LAX');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any>(null);

    const handleSimulation = () => {
        setLoading(true);
        fetch(`/api/simulate-reroutes?origin=${origin}&destination=${destination}`)
            .then(res => res.json())
            .then(data => {
                setResults(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch rerouting simulation", err);
                setLoading(false);
            });
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold text-center my-8">Rerouting Strategy Simulation</h1>
            <div className="flex justify-center items-center gap-4 mb-8">
                <Input
                    placeholder="Origin (e.g., JFK)"
                    value={origin}
                    onChange={e => setOrigin(e.target.value.toUpperCase())}
                    className="max-w-xs"
                />
                <Input
                    placeholder="Destination (e.g., LAX)"
                    value={destination}
                    onChange={e => setDestination(e.target.value.toUpperCase())}
                    className="max-w-xs"
                />
                <Button type="primary" onClick={handleSimulation} loading={loading}>
                    Simulate Reroute
                </Button>
            </div>

            {loading && <div className="text-center"><Spin /></div>}

            {results && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card title="Original Path">
                        <p>Path: {results.originalPath.path.join(' -> ')}</p>
                        <p>Distance: {results.originalPath.distance} segments</p>
                    </Card>
                    <Card title="Rerouted Path (Dijkstra)">
                        <p>Path: {results.reroutedPath.path.join(' -> ')}</p>
                        <p>Distance: {results.reroutedPath.distance} segments</p>
                        <p className="mt-4 font-semibold text-green-500">
                            A shorter or alternative path found via simulation.
                        </p>
                    </Card>
                </div>
            )}
        </div>
    );
}
