import { describe, expect, it } from "vitest";
import { findMerges, generate, parseConstraint } from "../src/core";

describe("parseConstraint", () => {
  it("parses person, days, times, description", () => {
    expect(parseConstraint("A M-F 10:00-16:00 work")).toEqual({
      person: "A", days: [0, 1, 2, 3, 4], start: 600, end: 960, description: "work",
    });
  });
  it("supports lists and rejects bad input", () => {
    expect(parseConstraint("B M,W,Fr 9:00-10:00 gym").days).toEqual([0, 2, 4]);
    expect(() => parseConstraint("B M 10:00-9:00 x")).toThrow();
    expect(() => parseConstraint("nonsense")).toThrow();
  });
});

describe("generate", () => {
  const t = generate(["A M-F 10:00-16:00 work", "B M 9:00-10:30 gym"]);
  it("has title row, 0:00 first and 23:45 last", () => {
    expect(t.grid).toHaveLength(97);
    expect(t.grid[0]).toEqual(["Time", "Mon A", "Mon B", "Tue A", "Tue B", "Wed A", "Wed B", "Thu A", "Thu B", "Fri A", "Fri B"]);
    expect(t.grid[1][0]).toBe("0:00");
    expect(t.grid[2][0]).toBe("0:15");
    expect(t.grid[96][0]).toBe("23:45");
  });
  it("fills cells per person and day in 15 min rows", () => {
    expect(t.grid[41][1]).toBe("work");
    expect(t.grid[40][1]).toBe("");
    expect(t.grid[65][1]).toBe("");
    expect(t.grid[37][2]).toBe("gym");
    expect(t.grid[43][2]).toBe("");
  });
  it("extends a previous timetable", () => {
    const next = generate(["A Sa 8:00-9:00 run"], t);
    expect(next.constraints).toHaveLength(3);
    expect(next.days).toEqual([0, 1, 2, 3, 4, 5]);
  });
});

describe("findMerges", () => {
  it("merges equal adjacent cells within a column only", () => {
    const grid = [["T", "x"], ["0", "w"], ["1", "w"], ["2", "w"], ["3", ""], ["4", "w"]];
    expect(findMerges(grid)).toEqual([{ startRow: 1, endRow: 4, column: 1 }]);
  });
});
