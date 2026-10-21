import { buildTimetable } from "./build";
import { parseConstraint } from "./parse";
import { Constraint, Timetable } from "./types";

export * from "./types";
export * from "./parse";
export * from "./build";
export * from "./merges";

/**
 * Creates a timetable from constraint lines, optionally extending a previous one.
 * @param lines New constraint lines.
 * @param previous Earlier timetable JSON whose constraints are kept.
 * @returns The resulting timetable.
 */
export function generate(lines: string[], previous?: Timetable): Timetable {
  const added: Constraint[] = lines.filter((l) => l.trim()).map(parseConstraint);
  return buildTimetable([...(previous?.constraints ?? []), ...added]);
}
