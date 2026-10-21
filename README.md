# rmz-sheet-timetable

Builds a 15-minute-row timetable from text constraints, saves it as JSON and uploads it to a Google Sheet.

## Start
```sh
npm i
npm test         # unit tests
npm run lint
npm run build    # tsc type check + frontend build
```

## CLI
Constraint format: `<person> <days> <start>-<end> <description>`, e.g. `A M-F 10:00-16:00 work`.
Days: `M Tu W Th F Sa Su` (also `Mon`..`Sun`), ranges `M-F`, lists `M,W,Fr`.

```sh
npm run cli -- generate --out timetable.json "A M-F 10:00-16:00 work" "B M 9:00-10:30 gym"
# iterate: add constraints on top of an earlier result
npm run cli -- generate --input timetable.json --out timetable.json "A F 12:00-13:00 lunch"
# upload (service account with edit access; set GOOGLE_APPLICATION_CREDENTIALS)
npm run cli -- upload --sheet <sheetId> --file timetable.json
```
Equal adjacent cells in a column are merged in the sheet. The first tab is overwritten.

## Frontend
`npm run dev` – edit constraints (one per line), preview the table, download the JSON.

See `PRD.md`, `ARCHITECTURE.md`, `AGENTS.md`.
