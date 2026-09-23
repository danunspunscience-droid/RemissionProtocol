# Skill: /remission-codebase-analysis

## Purpose
Execute a 3-phase staggered codebase audit and gap detection for Remission Protocol without exceeding context windows or causing uncoordinated refactoring.

## Execution Rules
- Execute ONE phase at a time. Do NOT attempt to combine phases in a single run.
- Pause and wait for user approval after Phase 2 before proceeding to Phase 3.

---

### Phase 1: Deep Inspection & System Mapping
1. Audit `/mnt/SSD1/projects/RemissionProtocol/schema.sql` against local D1 database schema (`npx wrangler d1 execute remission-db --local --command "PRAGMA table_list;"`).
2. Map all active functions in `functions/api/` and verify HTTP methods (`GET`, `POST`, `PUT`, `DELETE`) match corresponding frontend calls.
3. Check `apps/web/src/pages/` for legacy PocketBase references or broken `fetch()` routes.
4. Output findings to `CODEBASE_MAP.md`.

---

### Phase 2: Gap & Drift Analysis
1. Identify all schema mismatches (e.g., column name discrepancies, missing `NOT NULL` fallbacks).
2. Identify missing Cloudflare Pages Functions routes or unhandled dynamic ID paths (`[id].js`).
3. Check R2 storage bindings (`MEDIA_BUCKET`) and file streaming endpoints (`/api/files/[key].js`).
4. Output findings to `GAP_ANALYSIS_CURRENT.md`.
5. **HALT & PAUSE**: Present summary of gaps to Daniel for review and explicit approval.

---

### Phase 3: Task Card & Spec Generation
1. Once Daniel approves `GAP_ANALYSIS_CURRENT.md`, generate discrete, atomic Hermes/Roo execution task cards for each fix.
2. Ensure every task card follows the standard `HERMES / ROO EXECUTION SPEC` format with heredoc file replacement and build verification steps.
