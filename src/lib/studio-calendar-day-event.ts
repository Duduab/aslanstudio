/** One row from `GET /api/calendar-day-events` (Google Calendar `events.list`). */
export type StudioCalendarDayEvent = {
  id: string;
  summary: string;
  timeLabel: string;
};
