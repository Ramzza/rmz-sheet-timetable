# PRD (status quo)

Each requirement is covered by `tests/timetable.test.ts` unless noted.

1. Constraints are text: `A M-F 10:00-16:00 work` (person, days, time range, description).
2. Multiple people: each day has one column per person.
3. Rows are 15 minutes; row 1 is the title/header, row 2 is 0:00, last row is 23:45.
4. Output is JSON containing constraints and a sheet-ready grid.
5. Upload to a Google Sheet by sheet id is a separate step (not unit tested; needs Google API).
6. A previous JSON plus extra constraints yields an updated timetable.
7. Adjacent equal cells in a column are merged in the sheet (merge detection tested).
8. A React frontend allows editing constraints and downloading JSON (not unit tested).
