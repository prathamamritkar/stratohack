import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitBranch, Database, Cpu, Rocket } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground font-headline">About AirNavFlow</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            An innovative approach to predicting and mitigating airport congestion using Graph Machine Learning.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3"><Rocket className="text-primary"/> The Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              AirNavFlow is a hackathon project designed to demonstrate the power of Graph Neural Networks (GNNs) in modeling complex, real-world systems like global air traffic. By representing airports as nodes and flight paths as edges, we can predict the cascading effects of delays and simulate intelligent rerouting strategies to enhance the efficiency and resilience of air travel.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3"><Cpu className="text-primary"/> Core Technology</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4">
                    <GitBranch className="w-8 h-8 text-primary/80 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Graph Neural Networks</h3>
                      <p className="text-sm text-muted-foreground">We use GNNs (like GCN and GAT) to learn complex patterns in the airport network, enabling accurate predictions of how delays propagate through the system.</p>
                    </div>
                  </div>
                   <div className="flex items-start gap-4">
                    <Database className="w-8 h-8 text-primary/80 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Real-World Data</h3>
                      <p className="text-sm text-muted-foreground">Our models are conceptualized to be trained on ADS-B flight data from sources like the OpenSky Network, providing a realistic foundation for our predictions.</p>
                    </div>
                  </div>
                </CardContent>
            </Card>
            <div className="relative rounded-lg overflow-hidden aspect-square">
                 <Image src="https://picsum.photos/seed/tech-abstract/600/600" alt="Tech Abstract" fill className="object-cover" data-ai-hint="abstract technology" />
                 <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
            </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Hackathon Edge</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant="outline">Interactive Visualizations</Badge>
            <Badge variant="outline">Real-time Simulation</Badge>
            <Badge variant="outline">GenAI-powered Model Selection</Badge>
            <Badge variant="outline">Firebase Integration</Badge>
            <Badge variant="outline">Responsive Dark-Mode UI</Badge>
            <Badge variant="outline">Scalable Architecture</Badge>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
