import { getWeatherData } from '@/lib/weather';
import { getClothingRecommendation } from '@/lib/recommendationLogic';

export async function POST(req: Request) {
  try {
    const url = new URL(req.url || '', 'http://localhost');
    const dummy = url.searchParams.get('dummy') === '1';
    const temp = url.searchParams.get('temp');
    const precip = url.searchParams.get('precip');
    const wind = url.searchParams.get('wind');
    const code = url.searchParams.get('code');
    const body = await req.json();
    const { lat, lon, datetime } = body;
    if (lat == null || lon == null || !datetime) {
      return new Response(JSON.stringify({ error: 'Missing lat, lon, or datetime' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const weather = await getWeatherData(lat, lon, new Date(datetime), {
      dummyMode: dummy,
      dummyTemp: temp ? Number(temp) : undefined,
      dummyPrecip: precip ? Number(precip) : undefined,
      dummyWind: wind ? Number(wind) : undefined,
      dummyCode: code ? Number(code) : undefined,
    });
    const recommendation = getClothingRecommendation(weather);
    return new Response(
      JSON.stringify({ weather, recommendation }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
