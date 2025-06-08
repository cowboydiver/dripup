"use client";

import { useEffect, useState } from 'react';
import { Container, Card, Button, Heading, Flex, Text } from '@radix-ui/themes';

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

export default function Home() {
  const [recommendations, setRecommendations] = useState<{
    date: string;
    recommendation: string;
    weather?: Weather;
  }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const days = 7;
      const recs: {
        date: string;
        recommendation: string;
        weather?: Weather;
      }[] = [];
      for (let i = 0; i <= days; i++) {
        const isoDate = getIsoDateForDay(i);
        const res = await fetch('/api/recommendation', {
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
  }, []);

  return (
    <Container size="2" mt="6">
      <Card size="3" style={{ maxWidth: 480, margin: '0 auto' }}>
        <Heading mb="4">Bicycle Commute Clothing Recommendation</Heading>
        <Text mb="3">Location: {HARDCODED_LOCATION.placeName}</Text>
        <Button onClick={fetchRecommendations} disabled={loading} mb="4">
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
