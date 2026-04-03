export type User = {
  userId: string;
  email: string;
  role: 'user' | 'admin';
};

export type EventSummary = {
  id: string;
  title: string;
  description: string;
  venue: string;
  event_date: string;
  base_price_cents: number;
  total_seats: string;
  available_seats: string;
};

export type Seat = {
  id: string;
  seat_label: string;
  section: string;
  row_name: string;
  price_cents: number;
  status: 'available' | 'held' | 'booked';
};

export type EventDetail = {
  id: string;
  title: string;
  description: string;
  venue: string;
  event_date: string;
  base_price_cents: number;
  seats: Seat[];
};

export type Booking = {
  id: string;
  created_at: string;
  total_amount_cents: number;
  status: string;
  title: string;
  venue: string;
  event_date: string;
  seats: string[];
};
