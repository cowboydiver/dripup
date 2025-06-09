"use client";

import { useEffect, useState } from 'react';
import { Container, Card, Button, Heading, Flex, Text, Switch, TextField } from '@radix-ui/themes';
import Image from 'next/image';

// Hardcoded coordinates for the location
const HARDCODED_LOCATION = {
  lat: 56.1518,
  lon: 10.2064,
  placeName: 'Aarhus, Denmark',
};

function getIsoDateForDay(dayOffset: number) {
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset, 12, 0, 0, 0); // 12:00 (noon)
  return date.toISOString();
}

function getDayLabel(idx: number, isoDate: string) {
  const dateObj = new Date(isoDate);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleDateString(undefined, { month: 'long' });
  const formattedDate = `${day} ${month}`;
  if (idx === 0) return `Today, ${formattedDate}`;
  if (idx === 1) return `Tomorrow, ${formattedDate}`;
  const weekday = dateObj.toLocaleDateString(undefined, { weekday: 'long' });
  return `${weekday}, ${formattedDate}`;
}

interface Weather {
  temperature: number;
  windSpeed: number;
  precipitation: number;
  isDaylight: boolean;
  description: string;
  sunrise?: string;
  sunset?: string;
}

function getIconsForRecommendation(rec: string) {
  const icons = [];
  // Gloves/hat: no PNG, so skip
  if (/t-shirt/i.test(rec)) icons.push(
    <Image key="tshirt" src="/tshirt.png" alt="T-shirt" width={40} height={40} style={{objectFit:'contain'}} />
  );
  if (/light jacket|sweater/i.test(rec)) icons.push(
    <Image key="lightjacket" src="/light_jacket.png" alt="Light jacket" width={40} height={40} style={{objectFit:'contain'}} />
  );
  if (/warm jacket|heavy jacket/i.test(rec)) icons.push(
    <Image key="heavyjacket" src="/heavyjacket.png" alt="Heavy jacket" width={40} height={40} style={{objectFit:'contain'}} />
  );
  if (/waterproof/i.test(rec)) icons.push(
    <Image key="raincoat" src="/raincoat.png" alt="Raincoat" width={40} height={40} style={{objectFit:'contain'}} />
  );
  if (/reflective vest|bike lights/i.test(rec)) icons.push(
    <Image key="vest" src="/reflectivevest.png" alt="Reflective vest" width={40} height={40} style={{objectFit:'contain'}} />
  );
  if (/sunglasses/i.test(rec)) icons.push(
    <Image key="sunglasses" src="/sunglasses.png" alt="Sunglasses" width={40} height={40} style={{objectFit:'contain'}} />
  );
  return icons;
}

export default function Home() {
  const [recommendations, setRecommendations] = useState<{
    date: string;
    recommendation: string;
    weather?: Weather;
  }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dummyMode, setDummyMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('dummyMode');
      return stored === 'true';
    }
    return false;
  });
  // Dummy data controls
  const [dummyTemp, setDummyTemp] = useState('10');
  const [dummyPrecip, setDummyPrecip] = useState('0');
  const [dummyWind, setDummyWind] = useState('3');
  const [dummyCode, setDummyCode] = useState('0');

  const fetchRecommendations = async (dummy = dummyMode) => {
    setLoading(true);
    setError(null);
    try {
      const days = 7;
      const recs: {
        date: string;
        recommendation: string;
        weather?: Weather;
      }[] = [];
      let query = `?dummy=${dummy ? '1' : '0'}`;
      if (dummy) {
        query += `&temp=${dummyTemp}&precip=${dummyPrecip}&wind=${dummyWind}&code=${dummyCode}`;
      }
      for (let i = 0; i <= days; i++) {
        const isoDate = getIsoDateForDay(i);
        const res = await fetch(`/api/recommendation${query}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat: HARDCODED_LOCATION.lat, lon: HARDCODED_LOCATION.lon, datetime: isoDate }),
        });
        const data = await res.json();
        if (res.ok) {
          recs.push({ date: isoDate, recommendation: data.recommendation, weather: data.weather });
        } else {
          recs.push({ date: isoDate, recommendation: data.error || 'Error' });
        }
      }
      setRecommendations(recs);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dummyMode]);

  const handleToggleDummy = () => {
    setDummyMode((prev) => {
      localStorage.setItem('dummyMode', (!prev).toString());
      return !prev;
    });
  };

  return (
    <Container size="2" mt="6">
      <Card size="3" style={{ maxWidth: 480, margin: '0 auto' }}>
        <Heading mb="4">Bicycle Commute Clothing Recommendation</Heading>
        <Text mb="3">Location: {HARDCODED_LOCATION.placeName}</Text>
        <Flex align="center" gap="2" mb="4">
          <Switch checked={dummyMode} onCheckedChange={handleToggleDummy} />
          <Text>Dummy data: {dummyMode ? 'ON' : 'OFF'}</Text>
        </Flex>
        {dummyMode && (
          <Flex direction="column" gap="2" mb="4">
            <Flex align="center" gap="2">
              <TextField.Root
                type="number"
                value={dummyTemp}
                onChange={e => setDummyTemp(e.target.value)}
                style={{ width: 80 }}
                min="-30"
                max="40"
                step="1"
                placeholder="Temp (°C)"
              />
              <Text>°C</Text>
            </Flex>
            <Flex align="center" gap="2">
              <TextField.Root
                type="number"
                value={dummyPrecip}
                onChange={e => setDummyPrecip(e.target.value)}
                style={{ width: 80 }}
                min="0"
                max="100"
                step="0.1"
                placeholder="Precip (mm)"
              />
              <Text>mm</Text>
            </Flex>
            <Flex align="center" gap="2">
              <TextField.Root
                type="number"
                value={dummyWind}
                onChange={e => setDummyWind(e.target.value)}
                style={{ width: 80 }}
                min="0"
                max="40"
                step="1"
                placeholder="Wind (m/s)"
              />
              <Text>m/s</Text>
            </Flex>
            <Flex align="center" gap="2">
              <TextField.Root
                type="number"
                value={dummyCode}
                onChange={e => setDummyCode(e.target.value)}
                style={{ width: 80 }}
                min="0"
                max="99"
                step="1"
                placeholder="Weather code"
              />
              <Text>code</Text>
            </Flex>
            <Text size="1" color="gray">Weather codes: 0=Clear, 1=Mainly clear, 2=Partly cloudy, 3=Overcast, 61=Rain, 65=Heavy rain, 71=Snow, 75=Heavy snow, 95=Thunderstorm, etc.</Text>
          </Flex>
        )}
        <Button onClick={() => fetchRecommendations()} disabled={loading} mb="4">
          {loading ? 'Loading...' : 'Refresh Recommendations'}
        </Button>
        <Flex direction="column" gap="2">
          {recommendations.map((rec, idx) => (
            <Card key={rec.date} style={{ background: '#f8f8f8' }}>
              <Text weight="bold">{getDayLabel(idx, rec.date)}</Text>
              {rec.weather && (
                <>
                  <Text as="div">Temperature: {rec.weather.temperature}°C</Text>
                  <Text as="div">Condition: {rec.weather.description}</Text>
                  <Text as="div">Chance of rain: {rec.weather.precipitation} mm</Text>
                  <Text as="div">Windspeed: {rec.weather.windSpeed} m/s</Text>
                  <Text as="div">Sunrise: {rec.weather.sunrise ? new Date(rec.weather.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</Text>
                  <Text as="div">Sunset: {rec.weather.sunset ? new Date(rec.weather.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</Text>
                </>
              )}
              <Flex gap="2" mt="2">{getIconsForRecommendation(rec.recommendation)}</Flex>
              <Text as="div" mt="2">{rec.recommendation}</Text>
            </Card>
          ))}
        </Flex>
        {error && (
          <Text mt="4" as="div" color="red">
            Error: {error}
          </Text>
        )}
      </Card>
    </Container>
  );
}
