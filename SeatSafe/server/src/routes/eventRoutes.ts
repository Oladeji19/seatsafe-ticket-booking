import { Router } from 'express';
import { z } from 'zod';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { createEvent, getEventById, listEvents } from '../services/eventService.js';

const router = Router();

const createEventSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  venue: z.string().min(2),
  eventDate: z.string(),
  basePriceCents: z.number().int().positive(),
  sections: z.array(
    z.object({
      section: z.string(),
      rowName: z.string(),
      seatCount: z.number().int().positive(),
      priceCents: z.number().int().positive().optional()
    })
  ).min(1)
});

router.get('/', async (_req, res) => {
  const events = await listEvents();
  res.json(events);
});

router.get('/:eventId', async (req, res) => {
  const event = await getEventById(req.params.eventId);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }
  return res.json(event);
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const body = createEventSchema.parse(req.body);
    const eventId = await createEvent(body);
    res.status(201).json({ eventId });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not create event';
    res.status(400).json({ message });
  }
});

export default router;
