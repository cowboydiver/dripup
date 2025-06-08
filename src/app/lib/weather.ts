// Wrapper for Open-Meteo API
// No API key required

export interface WeatherData {
  temperature: number;
  windSpeed: number;
  precipitation: number;
  isDaylight: boolean;
  description: string;
}

export async function getWeatherData(lat: number, lon: number, datetime: Date): Promise<WeatherData> {
  // Format date for Open-Meteo (ISO string, no ms)
  const isoDate = datetime.toISOString().split('.')[0] + 'Z';
  const endDate = new Date(datetime.getTime() + 60 * 60 * 1000).toISOString().split('.')[0] + 'Z';
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation,windspeed_10m,weathercode,is_day&start=${isoDate}&end=${endDate}&timezone=auto`;

  // Debug output
  console.log('Open-Meteo URL:', url);

  const res = await fetch(url);
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Open-Meteo error:', errorText);
    throw new Error('Failed to fetch weather data');
  }
  const data = await res.json();

  // Find the closest hour's index
  const times = data.hourly.time;
  let idx = 0;
  for (let i = 0; i < times.length; i++) {
    if (times[i] === isoDate) {
      idx = i;
      break;
    }
  }

  return {
    temperature: data.hourly.temperature_2m[idx],
    windSpeed: data.hourly.windspeed_10m[idx],
    precipitation: data.hourly.precipitation[idx],
    isDaylight: data.hourly.is_day ? !!data.hourly.is_day[idx] : false,
    description: `Weather code: ${data.hourly.weathercode[idx]}`,
  };
}
