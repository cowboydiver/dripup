// Wrapper for Open-Meteo API
// No API key required

export interface WeatherData {
  temperature: number;
  windSpeed: number;
  precipitation: number;
  isDaylight: boolean;
  description: string;
  sunrise: string;
  sunset: string;
}

function getWeatherDescription(weathercode: number): string {
  // See https://open-meteo.com/en/docs#api_form for weather codes
  const codes: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };
  return codes[weathercode] || 'Unknown';
}

export async function getWeatherData(lat: number, lon: number, datetime: Date): Promise<WeatherData> {
  // Format date for Open-Meteo (YYYY-MM-DD)
  const dateStr = datetime.toISOString().slice(0, 10);
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,precipitation_sum,weathercode,windspeed_10m_max,sunrise,sunset&start_date=${dateStr}&end_date=${dateStr}&timezone=auto&windspeed_unit=ms`;

  // Debug output
  console.log('Open-Meteo Daily URL:', url);

  const res = await fetch(url);
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Open-Meteo error:', errorText);
    throw new Error('Failed to fetch weather data');
  }
  const data = await res.json();

  // Find the index for the requested day (should be 0)
  const idx = 0;
  return {
    temperature: data.daily.temperature_2m_max[idx],
    windSpeed: Math.round(data.daily.windspeed_10m_max[idx]),
    precipitation: data.daily.precipitation_sum[idx],
    isDaylight: true, // Not available in daily, assume true for noon
    description: getWeatherDescription(data.daily.weathercode[idx]),
    sunrise: data.daily.sunrise[idx],
    sunset: data.daily.sunset[idx],
  };
}
