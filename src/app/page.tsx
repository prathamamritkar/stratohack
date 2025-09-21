import { getAirportData } from '@/lib/data-loader';
import { initializeAirportData } from '@/lib/airport-coordinates';
import { HomePageClient } from './home-client-page';

export default async function Home() {
  const airportData = await getAirportData();
  initializeAirportData(airportData);

  return <HomePageClient airportData={airportData} />;
}
