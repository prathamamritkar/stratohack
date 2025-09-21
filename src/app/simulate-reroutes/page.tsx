import { getAirportData } from '@/lib/data-loader';
import { initializeAirportData } from '@/lib/airport-coordinates';
import { SimulateReroutesClientPage } from './simulate-reroutes-client-page';

export default async function SimulateReroutesPage() {
  const airportData = await getAirportData();
  initializeAirportData(airportData);

  return <SimulateReroutesClientPage />;
}
