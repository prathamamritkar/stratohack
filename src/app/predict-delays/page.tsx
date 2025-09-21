import { getAirportData } from '@/lib/data-loader';
import { initializeAirportData } from '@/lib/airport-coordinates';
import { PredictDelaysClientPage } from '../predict-delays-client-page';

export default async function PredictDelaysPage() {
  const airportData = await getAirportData();
  initializeAirportData(airportData);

  return <PredictDelaysClientPage />;
}
