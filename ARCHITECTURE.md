# Architecture

- `src/core` – pure logic, no I/O: `parse` (text → Constraint), `build` (constraints → Timetable grid), `merges` (grid → merge ranges), `index` (`generate`).
- `src/cli` – Node entry (`index.ts`) and Google Sheets upload (`sheet.ts`). Only place with I/O and network.
- `src/web` – React UI using `core` directly.
- `tests` – unit tests of `core`.

Data flow: lines → `generate` → Timetable JSON → `uploadToSheet`.
