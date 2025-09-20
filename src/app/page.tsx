'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Network } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex-1 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground font-headline">
            Welcome to <span className="text-primary">AirNavFlow</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Predicting Airport Traffic Flow and Cascading Delays with Graph Machine Learning.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Button asChild size="lg">
                <Link href="/predict-delays">
                  Predict Delays
                  <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Button asChild variant="secondary" size="lg">
                <Link href="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-16 sm:mt-24">
          <Card className="relative overflow-hidden shadow-2xl bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Network className="w-8 h-8 text-primary" />
                <div>
                  <CardTitle className="text-2xl">Interactive Airport Network</CardTitle>
                  <CardDescription>Visualize the complex web of flight routes in real-time.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full rounded-lg bg-background/50 relative flex items-center justify-center border border-dashed">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://picsum.photos/seed/network-map/1200/675"
                        alt="Airport Network Map"
                        fill
                        className="object-cover opacity-20"
                        data-ai-hint="world map network"
                    />
                </div>
                <div className="relative z-10 text-center p-8">
                  <h3 className="text-lg font-medium text-foreground">Interactive Graph Coming Soon</h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                    An interactive visualization powered by Cytoscape.js will be available here, allowing you to explore airport connections, view metrics, and filter data.
                  </p>
                  <div className="mt-6 flex justify-center">
                    <div className="relative w-24 h-24">
                      <div className="absolute inset-0 radar-pulse"></div>
                      <div className="absolute inset-2 radar-pulse" style={{ animationDelay: '0.5s' }}></div>
                      <div className="absolute inset-4 radar-pulse" style={{ animationDelay: '1s' }}></div>
                      <div className="absolute inset-0 flex items-center justify-center bg-accent/20 rounded-full">
                         <Network className="w-10 h-10 text-accent-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
       <style jsx>{`
        .bg-grid-pattern {
          background-image: linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
}
