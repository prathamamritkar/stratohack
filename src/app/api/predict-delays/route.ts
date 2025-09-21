import { NextResponse } from 'next/server';
import { getFlightData } from '@/lib/csv-parser';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const airport = searchParams.get('airport');

  if (!airport) {
    return new NextResponse('Airport parameter is required', { status: 400 });
  }

  try {
    const allFlights = await getFlightData();

    // Filter flights related to the selected airport (origin or destination)
    const relatedFlights = allFlights.filter(
      (flight) => flight.origin === airport || flight.estdepartureairport === airport
    );

    // Simple delay propagation logic: find flights departing after an arrival
    const delayChain = [];
    const visitedFlights = new Set();

    for (const initialFlight of relatedFlights) {
      if (initialFlight.arrivaldelay > 0) {
        let currentFlight = initialFlight;
        let chain = [currentFlight];
        visitedFlights.add(currentFlight.id);

        let nextDepartureTime = currentFlight.lastposupdate + (currentFlight.arrivaldelay * 60);

        // Find next connecting flight
        let nextFlight = allFlights.find(f => 
            f.origin === currentFlight.estarrivalairport &&
            f.firstseen > nextDepartureTime &&
            !visitedFlights.has(f.id)
        );

        if(nextFlight) {
            chain.push(nextFlight);
            visitedFlights.add(nextFlight.id);
        }
        delayChain.push(chain);
      }
    }

    return NextResponse.json({ delayChain });
  } catch (error) {
    console.error('Error predicting delays:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
