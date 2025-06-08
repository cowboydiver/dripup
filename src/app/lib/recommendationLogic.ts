import type { WeatherData } from './weather';

export function getClothingRecommendation(weather: WeatherData): string {
  // Placeholder logic: expand with real rules
  if (weather.temperature < 5) {
    return 'Wear a warm jacket, gloves, and a hat.';
  } else if (weather.temperature < 15) {
    return 'Wear a light jacket or sweater.';
  } else {
    return 'A t-shirt should be fine.';
  }
}
