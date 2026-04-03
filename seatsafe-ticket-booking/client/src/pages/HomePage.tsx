import { useEffect, useState } from 'react';
import { apiFetch } from '../api/http';
import { EventCard } from '../components/EventCard';
import type { EventSummary } from '../types';

export function HomePage() {
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<EventSummary[]>('/events')
      .then(setEvents)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <section>
      <h1>Browse Events</h1>
      <p>Book seats with a concurrency-safe checkout flow that prevents double-booking.</p>
      {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {events.map((event) => <EventCard key={event.id} event={event} />)}
      </div>
    </section>
  );
}
