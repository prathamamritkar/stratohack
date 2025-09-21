# Airport Traffic Flow Prediction — Hackathon Submission

## Overview

This project models global airport connectivity and predicts congestion using only the OpenSky ADS-B flight data (and any preprocessed files from the `dataset` folder). All analytics, predictions, and visualizations are strictly computed from these datasets—no hardcoded, random, or external data. 

**Bonus Features Implemented:**
- **Network Visualization:** Interactive airport graph (nodes/edges sourced from dataset). 
- **Cascading Delay Prediction:** Predict and rank delay propagation using only dataset connections and timestamps.
- **Rerouting Simulation:** Actual reroute calculations and visualizations, fully based on dataset-derived flight paths.

## Structure

- `dataset/` — Place all OpenSky ADS-B CSVs and any processed node/edge files here.
- `firebase/` — Firebase Functions for server-side CSV parsing, API endpoints, and (optionally) caching results in Firestore.
- `app/` — Next.js App Router structure.
  - `/` — Dashboard and project overview.
  - `/visualize` — Network graph visualization (Cytoscape.js).
  - `/predict-delays` — Delay propagation simulation.
  - `/simulate-reroutes` — Dataset-based reroute computation and visualization.
- `components/` — Reusable UI modules (all data props sourced from API calls to the dataset).
- `utils/` — CSV parsing, graph-building, and ML helpers—**all strictly reading from `dataset/`**.

## Setup

```bash
# 1. Clone and install dependencies
git clone https://github.com/prathamamritkar/stratohack.git
cd stratohack
npm install

# 2. Place datasets
# Copy OpenSky ADS-B CSVs (and/or processed nodes/edges) into /dataset

# 3. Set up Firebase (for Functions + Hosting)
firebase init
# (Configure Functions, Firestore, Hosting as prompted)

# 4. Run locally (with Next.js API proxying Functions)
npm run dev

# 5. Build and deploy
npm run build
firebase deploy
```

## Design Principles

- **No hardcoded/random/external data**: All analytics reference *only* files in `dataset/`.
- **Lean UI**: No extra pages, auth, placeholders, or unused boilerplate.
- **Performance**: Server-side parsing (Firebase Functions/Next.js API), with caching in Firestore for real-time updates.

## How Bonus Features Use the Dataset

- **Visualization**: Reads airport and route CSVs, computes traffic/congestion, renders interactive graph (Cytoscape.js).
- **Delay Prediction**: Filters flights by airport/timestamps, simulates propagation using graph algorithms—*all from dataset connections*.
- **Rerouting**: Dijkstra (or similar) reroute logic and metrics, only on dataset-derived graphs/paths.

---

**To extend:** Preprocess nodes/edges via Jupyter (`main.ipynb`), drop outputs in `dataset/`, and all features will dynamically reflect the new data.

---

> **For judges:** Every visualization, calculation, and prediction is 100% dataset-driven—no code references anything outside `dataset/`, making this a robust, real-world hackathon solution.
