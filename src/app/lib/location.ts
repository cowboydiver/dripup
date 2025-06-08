// Wrapper for OpenCage Geocoding API
// Replace 'YOUR_OPENCAGE_API_KEY' with your actual API key

export interface GeocodeResult {
  lat: number;
  lon: number;
  placeName: string;
}

export async function geocodeAddress(address: string): Promise<GeocodeResult> {
  const apiKey = process.env.OPENCAGE_API_KEY || 'YOUR_OPENCAGE_API_KEY';
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch location data');
  const data = await res.json();
  const result = data.results?.[0];
  if (!result) throw new Error('No location found');
  return {
    lat: result.geometry.lat,
    lon: result.geometry.lng,
    placeName: result.formatted,
  };
}
