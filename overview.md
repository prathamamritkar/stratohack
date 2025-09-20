## Data Source

The data for this project was acquired from the **[OpenSky Network](https://www.google.com/search?q=https://opensky-network.org/datasets/traffic/)**, as specified in the project's problem statement. The specific datasets utilized are the publicly available daily flight records.

For the construction and evaluation of our models, we used a focused dataset comprising all recorded flights from the **first week of September 2022** (September 1st to September 7th). This provided a comprehensive and recent snapshot of global air traffic.

-----

## Project Methodology

Our approach during this hackathon was structured into a four-phase workflow, moving from foundational data processing to advanced predictive modeling:

1.  **Data Cleaning and Preparation:** The initial phase involved loading and consolidating the raw CSV files into a unified DataFrame. We then selected essential columns, handled missing origin or destination values, and converted Unix timestamps into a standard datetime format for analysis.

2.  **Network Graph Construction:** We transformed the cleaned flight data into a directed network graph using the `NetworkX` library. In this graph, airports represent the **nodes**, and the flights between them constitute the **weighted edges**, with the weight indicating the volume of traffic on that route.

3.  **Baseline Model - Airport Clustering:** A baseline model was established using unsupervised machine learning. We calculated key centrality metrics (Degree, Betweenness, and PageRank) for each airport to quantify its structural importance. Subsequently, we applied the K-Means algorithm to cluster the airports into distinct categories, such as "Global Super-Hubs," "National Hubs," and "Regional Airports."

4.  **Advanced Model - GNN for Congestion Prediction:** The final phase involved developing a sophisticated predictive model. We implemented a **Graph Neural Network (GNN)** using PyTorch Geometric to perform a time-series node regression task. The model was trained to predict the number of arriving flights for each airport in the next hour based on the network's activity in the current hour, thereby forecasting airport congestion.
