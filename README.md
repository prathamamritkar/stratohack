# AirNavFlow: Airport Traffic Flow Prediction

*Predicting and navigating the complexities of global air traffic.*

---

## About This Project

**AirNavFlow** is a web-based platform developed for the "Airport Traffic Flow Prediction" hackathon. This project models global airport connectivity and leverages Graph Machine Learning to forecast high-congestion airports and their cascading effects. It provides an interactive, data-driven approach to visualizing and understanding the intricate dynamics of airport networks.

### Problem Statement
The core challenge is to model global airport connectivity, predict high-congestion airports using graph-based machine learning, and visualize the results in an interactive manner.

---

## Core Features

This application focuses on three key features, addressing the hackathon's bonus point challenges:

### 1. Interactive Airport Network Visualization
An interactive map that displays major global airports and the flight routes connecting them. This provides a clear, visual representation of the worldwide air traffic network, allowing users to explore airport connections at a glance.

### 2. Cascading Delay Prediction
A predictive tool that simulates the ripple effect of congestion at a major airport. By inputting a congested airport's IATA code (e.g., JFK), the application uses a predictive model to identify which connected airports are most likely to experience subsequent delays. The results are visualized on a map with color-coded pins indicating risk levels and polylines showing delay propagation paths.

### 3. Rerouting Strategy Simulation
A simulation dashboard that compares a direct flight path against a realistic, algorithmically determined reroute. The tool calculates and visualizes the trade-offs between the original and alternate routes in terms of delay time and cost, displaying both paths on a map for easy comparison.

---

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **AI & Machine Learning**: Genkit (Google AI)
- **Mapping**: Google Maps JavaScript API
- **Deployment**: Firebase App Hosting

---

## Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add your Google Maps API key:
    ```
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:9002`.

---

## Team Members

- **Aparna Jha** (`24f2006184`) - Human Factors & Biometrics
- **S.K. Zaheen** (`24f1001764`) - Predictive Modeling & Data Analytics
- **Pratham Amritkar** (`24f2003909`) - AI & Systems Architecture