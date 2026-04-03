import { Link } from 'react-router-dom';
import type { EventSummary } from '../types';

export function EventCard({ event }: { event: EventSummary }) {
  return (
    <article style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 12px 30px rgba(15,23,42,0.08)' }}>
      <h3 style={{ marginTop: 0 }}>{event.title}</h3>
      <p>{event.description}</p>
      <p><strong>Venue:</strong> {event.venue}</p>
      <p><strong>Date:</strong> {new Date(event.event_date).toLocaleString()}</p>
      <p><strong>Availability:</strong> {event.available_seats} / {event.total_seats} seats open</p>
      <Link to={`/events/${event.id}`} style={{ display: 'inline-block', marginTop: 8, color: '#2563eb' }}>
        View seats
      </Link>
    </article>
  );
}
