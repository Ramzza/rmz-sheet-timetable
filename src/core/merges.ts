/** A rectangular range to merge; indexes are 0-based, end exclusive. */
export interface MergeRange {
  startRow: number;
  endRow: number;
  column: number;
}

/**
 * Finds vertical runs of identical non-empty adjacent cells per data column
 * (the time column and header row are skipped).
 * @param grid Timetable grid.
 * @returns Ranges spanning at least two rows.
 */
export function findMerges(grid: string[][]): MergeRange[] {
  const merges: MergeRange[] = [];
  for (let col = 1; col < (grid[0]?.length ?? 0); col++) {
    let start = 1;
    for (let row = 2; row <= grid.length; row++) {
      const same = row < grid.length && grid[row][col] !== "" && grid[row][col] === grid[start][col];
      if (same) continue;
      if (row - start > 1 && grid[start][col] !== "") merges.push({ startRow: start, endRow: row, column: col });
      start = row;
    }
  }
  return merges;
}
