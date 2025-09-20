import { config } from 'dotenv';
config();

import '@/ai/flows/gnn-model-selection.ts';
import '@/ai/flows/explain-delay-factors.ts';
import '@/ai/flows/simulate-reroute-flow.ts';
import '@/ai/flows/predict-cascading-delays-flow.ts';
