import { getWeatherData } from '@/lib/weather';
import { getClothingRecommendation } from '@/lib/recommendationLogic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { lat, lon, datetime } = body;
    if (lat == null || lon == null || !datetime) {
      return new Response(JSON.stringify({ error: 'Missing lat, lon, or datetime' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const weather = await getWeatherData(lat, lon, new Date(datetime));
    const recommendation = getClothingRecommendation(weather);
    return new Response(
      JSON.stringify({ weather, recommendation }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
