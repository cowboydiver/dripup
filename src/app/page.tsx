"use client";

import { useState } from 'react';
import { Container, Card, Button, Heading, Flex, Text } from '@radix-ui/themes';

// Hardcoded coordinates for the location
const HARDCODED_LOCATION = {
  lat: 56.1518,
  lon: 10.2064,
  placeName: 'Copenhagen, Denmark',
};

function getNextIsoDateWithHour(hour: string) {
  // hour: '08' or '17' (string)
  const now = new Date();
  const commuteDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(hour, 10), 0, 0, 0);
  // If the time has already passed today, use tomorrow
  if (commuteDate < now) {
    commuteDate.setDate(commuteDate.getDate() + 1);
  }
  return commuteDate.toISOString();
}

export default function Home() {
  const [toWorkHour, setToWorkHour] = useState('08');
  const [homeHour, setHomeHour] = useState('17');
  const [toWorkRec, setToWorkRec] = useState<string | null>(null);
  const [homeRec, setHomeRec] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setToWorkRec(null);
    setHomeRec(null);
    try {
      // Prepare ISO datetimes for both commutes
      const toWorkDatetime = getNextIsoDateWithHour(toWorkHour);
      const homeDatetime = getNextIsoDateWithHour(homeHour);
      // Call API for both times
      const [toWorkRes, homeRes] = await Promise.all([
        fetch('/api/recommendation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat: HARDCODED_LOCATION.lat, lon: HARDCODED_LOCATION.lon, datetime: toWorkDatetime }),
        }),
        fetch('/api/recommendation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat: HARDCODED_LOCATION.lat, lon: HARDCODED_LOCATION.lon, datetime: homeDatetime }),
        })
      ]);
      const toWorkData = await toWorkRes.json();
      const homeData = await homeRes.json();
      if (toWorkRes.ok) {
        setToWorkRec(toWorkData.recommendation);
      } else {
        setError(toWorkData.error || 'Something went wrong');
      }
      if (homeRes.ok) {
        setHomeRec(homeData.recommendation);
      } else {
        setError(homeData.error || 'Something went wrong');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="2" mt="6">
      <Card size="3" style={{ maxWidth: 480, margin: '0 auto' }}>
        <Heading mb="4">Bicycle Commute Clothing Recommendation</Heading>
        <Text mb="3">Location: {HARDCODED_LOCATION.placeName}</Text>
        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            <label>
              Commute to work (hour):
              <input
                type="number"
                min="0"
                max="23"
                value={toWorkHour}
                onChange={e => setToWorkHour(e.target.value)}
                required
                style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', marginLeft: 8 }}
              />
            </label>
            <label>
              Commute home (hour):
              <input
                type="number"
                min="0"
                max="23"
                value={homeHour}
                onChange={e => setHomeHour(e.target.value)}
                required
                style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', marginLeft: 8 }}
              />
            </label>
            <Button type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Get Recommendations'}
            </Button>
          </Flex>
        </form>
        {toWorkRec && (
          <Text mt="4" as="div" color="green">
            To work: {toWorkRec}
          </Text>
        )}
        {homeRec && (
          <Text mt="2" as="div" color="green">
            Home: {homeRec}
          </Text>
        )}
        {error && (
          <Text mt="4" as="div" color="red">
            Error: {error}
          </Text>
        )}
      </Card>
    </Container>
  );
}
