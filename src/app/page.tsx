import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-2">Airport Traffic Flow Prediction</h1>
        <p className="text-xl text-gray-400">Hackathon Submission</p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full">
        <FeatureCard
          title="Interactive Airport Network"
          description="Visualize the airport network graph, with nodes and edges derived from the project datasets."
          href="/visualize-network"
        />
        <FeatureCard
          title="Cascading Delay Prediction"
          description="Predict cascading delays originating from a selected airport using real flight data."
          href="/predict-delays"
        />
        <FeatureCard
          title="Rerouting Strategy Simulation"
          description="Simulate flight rerouting strategies to mitigate delays using Dijkstra's algorithm."
          href="/simulate-reroutes"
        />
      </main>

      <footer className="mt-12 text-center text-gray-500">
        <p>Powered by Next.js and Firebase. All data sourced from `src/dataset`.</p>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  href: string;
}

function FeatureCard({ title, description, href }: FeatureCardProps) {
  return (
    <Link href={href} className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition-colors">
        <h2 className="text-2xl font-semibold mb-3">{title}</h2>
        <p className="text-gray-400">{description}</p>
    </Link>
  );
}
