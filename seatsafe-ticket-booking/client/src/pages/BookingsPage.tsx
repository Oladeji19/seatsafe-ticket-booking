import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { apiFetch } from '../api/http';
import { useAuth } from '../context/AuthContext';
import type { Booking } from '../types';

export function BookingsPage() {
  const { token, user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    apiFetch<Booking[]>('/bookings/me', {}, token)
      .then(setBookings)
      .catch((err) => setError(err.message));
  }, [token]);

  if (!user || !token) return <Navigate to="/login" replace />;

  return (
    <section>
      <h1>My Bookings</h1>
      {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
      <div style={{ display: 'grid', gap: 16 }}>
        {bookings.map((booking) => (
          <article key={booking.id} style={{ background: '#fff', padding: 20, borderRadius: 16 }}>
            <h3 style={{ marginTop: 0 }}>{booking.title}</h3>
            <p>{booking.venue}</p>
            <p>{new Date(booking.event_date).toLocaleString()}</p>
            <p><strong>Seats:</strong> {booking.seats.join(', ')}</p>
            <p><strong>Total:</strong> ${(booking.total_amount_cents / 100).toFixed(2)}</p>
            <p><strong>Status:</strong> {booking.status}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
