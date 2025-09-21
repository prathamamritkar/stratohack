"use client";

import { useEffect, useState } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import { Layout, Spin } from 'antd';

const { Content } = Layout;

export default function VisualizeNetworkPage() {
    const [graphData, setGraphData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/network-data')
            .then(res => res.json())
            .then(data => {
                setGraphData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch network data", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Spin size="large" /></div>;
    }

    return (
        <Content style={{ padding: '0 50px', marginTop: 64 }}>
            <h1 className="text-3xl font-bold text-center my-8">Airport Network Visualization</h1>
            <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                <CytoscapeComponent
                    elements={CytoscapeComponent.normalizeElements(graphData)}
                    style={{ width: '100%', height: '70vh' }}
                    stylesheet={[
                        {
                            selector: 'node',
                            style: { 'background-color': '#666', 'label': 'data(id)' }
                        },
                        {
                            selector: 'edge',
                            style: { 'width': 2, 'line-color': '#ccc', 'target-arrow-color': '#ccc', 'target-arrow-shape': 'triangle' }
                        }
                    ]}
                    layout={{ name: 'cose', idealEdgeLength: 100, nodeOverlap: 20, refresh: 20, fit: true, padding: 30 }}
                />
            </div>
        </Content>
    );
}
