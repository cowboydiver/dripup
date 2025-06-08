import { geocodeAddress } from '@/lib/location';
import { getWeatherData } from '@/lib/weather';
import { getClothingRecommendation } from '@/lib/recommendationLogic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { address, datetime } = body;
    if (!address || !datetime) {
      return new Response(JSON.stringify({ error: 'Missing address or datetime' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    // 1. Geocode address
    const location = await geocodeAddress(address);
    // 2. Get weather data
    const weather = await getWeatherData(location.lat, location.lon, new Date(datetime));
    // 3. Get clothing recommendation
    const recommendation = getClothingRecommendation(weather);
    // 4. Respond with all relevant data
    return new Response(
      JSON.stringify({ location, weather, recommendation }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
