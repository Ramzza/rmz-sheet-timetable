import { Constraint, DAY_NAMES, SLOTS_PER_DAY, SLOT_MINUTES, Timetable } from "./types";

/**
 * Formats minutes from midnight as "H:MM".
 * @param mins Minutes from midnight.
 * @returns Time label.
 */
export function formatTime(mins: number): string {
  return `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, "0")}`;
}

/**
 * Builds a timetable (people x days columns, 15-minute rows) from constraints.
 * Overlapping constraints for the same cell are joined with " / ".
 * @param constraints All constraints.
 * @returns The timetable including the sheet-ready grid.
 */
export function buildTimetable(constraints: Constraint[]): Timetable {
  const people = [...new Set(constraints.map((c) => c.person))];
  const days = [...new Set(constraints.flatMap((c) => c.days))].sort((a, b) => a - b);
  const columns = days.flatMap((d) => people.map((p) => ({ d, p })));
  const grid: string[][] = [["Time", ...columns.map(({ d, p }) => `${DAY_NAMES[d]} ${p}`)]];
  for (let slot = 0; slot < SLOTS_PER_DAY; slot++) {
    const t = slot * SLOT_MINUTES;
    const cells = columns.map(({ d, p }) =>
      constraints
        .filter((c) => c.person === p && c.days.includes(d) && t >= c.start && t < c.end)
        .map((c) => c.description)
        .join(" / "),
    );
    grid.push([formatTime(t), ...cells]);
  }
  return { people, days, constraints, grid };
}
