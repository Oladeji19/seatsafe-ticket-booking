import { pool } from '../db/pool.js';

export async function createBooking(userId: string, eventId: string, seatIds: string[]) {
  if (!seatIds.length) {
    throw new Error('At least one seat must be selected');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const seatsResult = await client.query(
      `SELECT id, price_cents, status
       FROM seats
       WHERE event_id = $1 AND id = ANY($2::uuid[])
       FOR UPDATE`,
      [eventId, seatIds]
    );

    if (seatsResult.rowCount !== seatIds.length) {
      throw new Error('One or more seats were not found');
    }

    const unavailableSeat = seatsResult.rows.find((seat) => seat.status !== 'available');
    if (unavailableSeat) {
      throw new Error('One or more seats are no longer available');
    }

    const totalAmount = seatsResult.rows.reduce((sum, seat) => sum + Number(seat.price_cents), 0);

    const bookingResult = await client.query(
      `INSERT INTO bookings (user_id, event_id, total_amount_cents, status)
       VALUES ($1, $2, $3, 'confirmed')
       RETURNING id`,
      [userId, eventId, totalAmount]
    );

    const bookingId = bookingResult.rows[0].id;

    for (const seat of seatsResult.rows) {
      await client.query(
        `INSERT INTO booking_items (booking_id, seat_id, price_cents)
         VALUES ($1, $2, $3)`,
        [bookingId, seat.id, seat.price_cents]
      );
    }

    await client.query(
      `UPDATE seats SET status = 'booked'
       WHERE id = ANY($1::uuid[])`,
      [seatIds]
    );

    await client.query('COMMIT');

    return { bookingId, totalAmountCents: totalAmount };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function listUserBookings(userId: string) {
  const result = await pool.query(
    `SELECT b.id, b.created_at, b.total_amount_cents, b.status,
            e.title, e.venue, e.event_date,
            ARRAY_AGG(s.seat_label ORDER BY s.seat_label) AS seats
     FROM bookings b
     JOIN events e ON e.id = b.event_id
     JOIN booking_items bi ON bi.booking_id = b.id
     JOIN seats s ON s.id = bi.seat_id
     WHERE b.user_id = $1
     GROUP BY b.id, e.id
     ORDER BY b.created_at DESC`,
    [userId]
  );

  return result.rows;
}
