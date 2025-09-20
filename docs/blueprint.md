# **App Name**: AirNavFlow

## Core Features:

- Interactive Airport Network Visualization: Display an interactive graph of airports and flight routes using Cytoscape.js, with features for zooming, panning, and node-specific details fetched from a Firestore collection.
- Cascading Delay Prediction: Enable users to input a congested airport and use a pre-trained GNN model (deployed as a Firebase Function) to predict and display cascading delays to other airports. The prediction tool will factor in graph metrics to decide whether a specific factor should be incorporated into its prediction.
- Rerouting Strategy Simulation: Allow users to select a congested route and simulate rerouting via shortest path algorithms. Display before/after graphs with animated flight paths, calculate metrics like reduced delay time and display results in a dashboard.
- User Authentication: Implement user authentication via Firebase to allow users to save custom simulation data and track simulation history.
- Leaderboard: Implement a leaderboard to gamify the experience and encourage efficient rerouting strategies among users. Use aggregate results saved to the Firestore database.
- Data Export: Offer users the ability to export simulation results and predictions in PDF or CSV format for further analysis.
- GNN Model Integration: Implement a lightweight Graph Neural Network model to provide the predictive capability for cascading airport delays and factor graph based metrics using a 'tool'.

## Style Guidelines:

- Background color: Dark, desaturated blue-gray (#222F3E) to evoke a sense of modern technology and aviation environments.
- Primary color: Electric blue (#7DF9FF) to represent energy, flow, and data streams in the traffic prediction.
- Accent color: Vivid orange (#FFA500) to highlight interactive elements, alerts, and call-to-action buttons.
- Font: 'Inter', a grotesque-style sans-serif, used for both headlines and body text, chosen for its modern, machined look appropriate for data-driven apps. 
- Aviation-inspired icons representing airports, flight routes, and congestion levels. The icons will have a bright color and be used to help visually guide the user through different sections of the web app
- Full-screen layout with interactive elements placed strategically to maximize user engagement. Utilize grid-based layouts to display data and visualizations effectively.
- Use smooth transitions and animations (e.g., flight path animations, loading spinners) to provide a visually appealing and engaging experience. Implement radar-like animations for data updates.