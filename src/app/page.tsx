"use client";

import { useState } from 'react';
import { Container, Card, TextField, Button, Heading, Flex, Text } from '@radix-ui/themes';

export default function Home() {
  const [location, setLocation] = useState('');
  const [datetime, setDatetime] = useState('');
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRecommendation(null);
    try {
      const res = await fetch('/api/recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: location, datetime }),
      });
      const data = await res.json();
      if (res.ok) {
        setRecommendation(data.recommendation);
      } else {
        setError(data.error || 'Something went wrong');
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
        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            <TextField.Root
              placeholder="Enter your location"
              value={location}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
              required
            />
            <TextField.Root
              type="datetime-local"
              value={datetime}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatetime(e.target.value)}
              required
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Get Recommendation'}
            </Button>
          </Flex>
        </form>
        {recommendation && (
          <Text mt="4" as="div" color="green">
            Recommendation: {recommendation}
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
