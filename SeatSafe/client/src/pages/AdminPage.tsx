import { FormEvent, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { apiFetch } from '../api/http';
import { useAuth } from '../context/AuthContext';

export function AdminPage() {
  const { token, user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [venue, setVenue] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [basePrice, setBasePrice] = useState('6500');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!user || !token) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      const result = await apiFetch<{ eventId: string }>(
        '/events',
        {
          method: 'POST',
          body: JSON.stringify({
            title,
            description,
            venue,
            eventDate,
            basePriceCents: Number(basePrice),
            sections: [
              { section: 'Floor', rowName: 'A', seatCount: 8, priceCents: Number(basePrice) },
              { section: 'Balcony', rowName: 'B', seatCount: 12, priceCents: Number(basePrice) - 1000 }
            ]
          })
        },
        token
      );
      setMessage(`Created event ${result.eventId}`);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Event creation failed');
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 560, background: '#fff', padding: 24, borderRadius: 16 }}>
      <h1>Create Event</h1>
      {message && <p style={{ color: '#166534' }}>{message}</p>}
      {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: 12, marginBottom: 12 }} />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: 12, marginBottom: 12, minHeight: 120 }} />
      <input placeholder="Venue" value={venue} onChange={(e) => setVenue(e.target.value)} style={{ width: '100%', padding: 12, marginBottom: 12 }} />
      <input type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} style={{ width: '100%', padding: 12, marginBottom: 12 }} />
      <input placeholder="Base price (cents)" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} style={{ width: '100%', padding: 12, marginBottom: 12 }} />
      <button type="submit" style={{ padding: '0.75rem 1rem' }}>Create Event</button>
    </form>
  );
}
