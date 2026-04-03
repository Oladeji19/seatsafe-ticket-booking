import { pool } from '../db/pool.js';

export async function listEvents() {
  const result = await pool.query(
    `SELECT e.id, e.title, e.description, e.venue, e.event_date, e.base_price_cents,
            COUNT(s.id) AS total_seats,
            COUNT(*) FILTER (WHERE s.status = 'available') AS available_seats
     FROM events e
     LEFT JOIN seats s ON s.event_id = e.id
     GROUP BY e.id
     ORDER BY e.event_date ASC`
  );

  return result.rows;
}

export async function getEventById(eventId: string) {
  const eventResult = await pool.query('SELECT * FROM events WHERE id = $1', [eventId]);
  if (!eventResult.rowCount) {
    return null;
  }

  const seatsResult = await pool.query(
    `SELECT id, seat_label, section, row_name, price_cents, status
     FROM seats
     WHERE event_id = $1
     ORDER BY section, row_name, seat_label`,
    [eventId]
  );

  return {
    ...eventResult.rows[0],
    seats: seatsResult.rows
  };
}

export async function createEvent(input: {
  title: string;
  description: string;
  venue: string;
  eventDate: string;
  basePriceCents: number;
  sections: Array<{ section: string; rowName: string; seatCount: number; priceCents?: number }>;
}) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const eventResult = await client.query(
      `INSERT INTO events (title, description, venue, event_date, base_price_cents)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [input.title, input.description, input.venue, input.eventDate, input.basePriceCents]
    );

    const eventId = eventResult.rows[0].id;

    for (const section of input.sections) {
      for (let i = 1; i <= section.seatCount; i += 1) {
        const seatLabel = `${section.rowName}${i}`;
        await client.query(
          `INSERT INTO seats (event_id, seat_label, section, row_name, price_cents, status)
           VALUES ($1, $2, $3, $4, $5, 'available')`,
          [eventId, seatLabel, section.section, section.rowName, section.priceCents ?? input.basePriceCents]
        );
      }
    }

    await client.query('COMMIT');
    return eventId;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
