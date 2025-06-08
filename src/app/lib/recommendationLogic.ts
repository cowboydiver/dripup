import type { WeatherData } from './weather';

export function getClothingRecommendation(weather: WeatherData): string {
  // Placeholder logic: expand with real rules
  let rec = '';
  if (weather.temperature < 5) {
    rec = 'Wear a warm jacket, gloves, and a hat.';
  } else if (weather.temperature < 15) {
    rec = 'Wear a light jacket or sweater.';
  } else {
    rec = 'A t-shirt should be fine.';
  }

  // Add waterproof clothing recommendation if it rains
  if (weather.precipitation > 0) {
    rec += ' Wear waterproof clothing.';
  }

  // Add bike lights/vest recommendation if sunrise is after 7am or sunset is before 6pm
  if (weather.sunrise && weather.sunset) {
    const sunrise = new Date(weather.sunrise);
    const sunset = new Date(weather.sunset);
    if (sunrise.getHours() > 7 || (sunset.getHours() < 18 || (sunset.getHours() === 18 && sunset.getMinutes() === 0))) {
      rec += ' Also, bring bike lights and a reflective vest.';
    }
  }

  return rec;
}
