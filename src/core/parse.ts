import { Constraint, DAY_NAMES } from "./types";

const DAY_ALIASES: Record<string, number> = Object.fromEntries(
  DAY_NAMES.flatMap((n, i) => [
    [n.toLowerCase(), i],
    [n.slice(0, 2).toLowerCase(), i],
  ]),
);
DAY_ALIASES["m"] = 0;
DAY_ALIASES["w"] = 2;
DAY_ALIASES["f"] = 4;

/**
 * Converts a day token such as "M", "tu" or "Wed" to a day index.
 * @param token Day token.
 * @returns Index 0 (Mon) to 6 (Sun).
 */
function dayIndex(token: string): number {
  const idx = DAY_ALIASES[token.toLowerCase()];
  if (idx === undefined) throw new Error(`Unknown day "${token}"`);
  return idx;
}

/**
 * Parses a day spec like "M-F" or "M,W,Fr" (ranges may wrap, e.g. "Sa-Mo").
 * @param spec Day specification.
 * @returns Sorted unique day indexes.
 */
export function parseDays(spec: string): number[] {
  const days = new Set<number>();
  for (const part of spec.split(",")) {
    const [from, to] = part.split("-");
    const a = dayIndex(from);
    const b = to === undefined ? a : dayIndex(to);
    for (let d = a; ; d = (d + 1) % 7) {
      days.add(d);
      if (d === b) break;
    }
  }
  return [...days].sort((x, y) => x - y);
}

/**
 * Parses "H:MM" or "HH:MM" into minutes from midnight (24:00 allowed).
 * @param text Time text.
 * @returns Minutes from midnight.
 */
export function parseTime(text: string): number {
  const m = /^(\d{1,2}):(\d{2})$/.exec(text);
  if (!m) throw new Error(`Invalid time "${text}"`);
  const mins = Number(m[1]) * 60 + Number(m[2]);
  if (Number(m[2]) > 59 || mins > 1440) throw new Error(`Invalid time "${text}"`);
  return mins;
}

/**
 * Parses a constraint line like "A M-F 10:00-16:00 work".
 * @param line Constraint text: person, days, time range, description.
 * @returns The parsed constraint.
 */
export function parseConstraint(line: string): Constraint {
  const m = /^(\S+)\s+(\S+)\s+(\d{1,2}:\d{2})-(\d{1,2}:\d{2})\s+(.+)$/.exec(line.trim());
  if (!m) throw new Error(`Invalid constraint "${line}"`);
  const start = parseTime(m[3]);
  const end = parseTime(m[4]);
  if (end <= start) throw new Error(`End must be after start in "${line}"`);
  return { person: m[1], days: parseDays(m[2]), start, end, description: m[5].trim() };
}
