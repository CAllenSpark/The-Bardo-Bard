# The Ledger worker — Phase 3

One Cloudflare Worker fronting one Durable Object counter (SQLite-backed, free
plan). Spec is pinned in `docs/BARD_COMPASS.md` §7:

- `POST /tally {node, choice}` → 204 — validated against the Compass §3
  manifest, atomic increment, day-bucket only, no session IDs, no IPs stored.
- `GET /tally?nodes=…` → counts JSON.
- CORS: `OPTIONS` preflight handler; `Access-Control-Allow-Origin` for the
  Pages origin and `null`; no credentials.

Nothing here ships before Gate 2 passes.
