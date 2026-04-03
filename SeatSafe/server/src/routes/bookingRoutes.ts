import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { createBooking, listUserBookings } from '../services/bookingService.js';

const router = Router();

const bookingSchema = z.object({
  eventId: z.string().uuid(),
  seatIds: z.array(z.string().uuid()).min(1)
});

router.use(requireAuth);

router.post('/', async (req, res) => {
  try {
    const body = bookingSchema.parse(req.body);
    const result = await createBooking(req.user!.userId, body.eventId, body.seatIds);
    res.status(201).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Booking failed';
    res.status(400).json({ message });
  }
});

router.get('/me', async (req, res) => {
  const bookings = await listUserBookings(req.user!.userId);
  res.json(bookings);
});

export default router;
