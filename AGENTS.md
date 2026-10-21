# Agents guide

- Commands: `npm i`, `npm run lint`, `npm run build`, `npm test` (all must pass).
- Keep files ≤ 200 lines (lint-enforced); JSDoc on every function; keep it simple.
- Keep `core` pure; I/O only in `cli`.
- `PRD.md` is the source of truth for requirements; every requirement needs a test, and new tests must fail without the code change. Update `PRD.md`/`README.md`/`ARCHITECTURE.md` with behaviour changes.
