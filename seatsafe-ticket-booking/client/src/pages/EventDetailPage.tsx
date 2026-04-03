import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../api/http';
import { useAuth } from '../context/AuthContext';
import type { EventDetail } from '../types';

export function EventDetailPage() {
  const { eventId } = useParams();
  const { token, user } = useAuth();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;
    apiFetch<EventDetail>(`/events/${eventId}`)
      .then(setEvent)
      .catch((err) => setError(err.message));
  }, [eventId]);

  const total = useMemo(() => {
    if (!event) return 0;
    return event.seats
      .filter((seat) => selectedSeatIds.includes(seat.id))
      .reduce((sum, seat) => sum + seat.price_cents, 0);
  }, [event, selectedSeatIds]);

  async function bookSeats() {
    if (!token || !event) {
      setError('Log in to complete a booking');
      return;
    }

    try {
      const result = await apiFetch<{ bookingId: string; totalAmountCents: number }>(
        '/bookings',
        {
          method: 'POST',
          body: JSON.stringify({ eventId: event.id, seatIds: selectedSeatIds })
        },
        token
      );
      setMessage(`Booking confirmed: ${result.bookingId}`);
      setSelectedSeatIds([]);
      const refreshed = await apiFetch<EventDetail>(`/events/${event.id}`);
      setEvent(refreshed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed');
    }
  }

  if (error && !event) return <p style={{ color: '#b91c1c' }}>{error}</p>;
  if (!event) return <p>Loading event...</p>;

  return (
    <section>
      <h1>{event.title}</h1>
      <p>{event.description}</p>
      <p><strong>Venue:</strong> {event.venue}</p>
      <p><strong>Date:</strong> {new Date(event.event_date).toLocaleString()}</p>
      {message && <p style={{ color: '#166534' }}>{message}</p>}
      {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
      {!user && <p style={{ color: '#92400e' }}>You can browse seats now. Log in to book them.</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginTop: 24 }}>
        {event.seats.map((seat) => {
          const isSelected = selectedSeatIds.includes(seat.id);
          const isDisabled = seat.status !== 'available';
          return (
            <button
              key={seat.id}
              disabled={isDisabled}
              onClick={() => {
                setSelectedSeatIds((current) =>
                  current.includes(seat.id) ? current.filter((id) => id !== seat.id) : [...current, seat.id]
                );
              }}
              style={{
                padding: 14,
                borderRadius: 12,
                border: isSelected ? '2px solid #2563eb' : '1px solid #cbd5e1',
                background: isDisabled ? '#e2e8f0' : isSelected ? '#dbeafe' : '#fff',
                cursor: isDisabled ? 'not-allowed' : 'pointer'
              }}
            >
              <div style={{ fontWeight: 700 }}>{seat.seat_label}</div>
              <div>{seat.section}</div>
              <div>${(seat.price_cents / 100).toFixed(2)}</div>
              <div style={{ fontSize: 12 }}>{seat.status}</div>
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 24, padding: 20, background: '#fff', borderRadius: 16 }}>
        <p><strong>Selected seats:</strong> {selectedSeatIds.length}</p>
        <p><strong>Total:</strong> ${(total / 100).toFixed(2)}</p>
        <button disabled={!selectedSeatIds.length} onClick={bookSeats} style={{ padding: '0.85rem 1rem' }}>
          Confirm Booking
        </button>
      </div>
    </section>
  );
}
