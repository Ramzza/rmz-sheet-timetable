/** A single availability/work constraint for one person. */
export interface Constraint {
  person: string;
  /** Day indexes, 0 = Monday ... 6 = Sunday. */
  days: number[];
  /** Start in minutes from midnight (inclusive). */
  start: number;
  /** End in minutes from midnight (exclusive). */
  end: number;
  description: string;
}

/** Timetable as stored in JSON; `grid` is directly uploadable to a sheet. */
export interface Timetable {
  people: string[];
  /** Day indexes (0 = Monday) that have a column group. */
  days: number[];
  constraints: Constraint[];
  /** Row 0 = header, rows 1..96 = 0:00..23:45; column 0 = time label. */
  grid: string[][];
}

export const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const SLOT_MINUTES = 15;
export const SLOTS_PER_DAY = 96;
