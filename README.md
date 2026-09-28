# PitchSide – Live Cricket Scores

A lightweight cricket score dashboard using Cricket Data (CricAPI), with a static frontend and Vercel serverless API routes.

## Deploy
1. Import this repository into Vercel.
2. Add `CRICKETDATA_API_KEY` as a Vercel environment variable.
3. Optional: `CACHE_SECONDS` (default 60) and `CRICKET_API_BASE` (default https://api.cricapi.com/v1).
4. Deploy with no build command.

The API key stays server-side and is never included in the browser code.

## Structure
- `index.html`
- `api/_shared.js`
- `api/scores.js`
- `api/match.js`
- `vercel.json`
- `.env.example`

The frontend falls back to demo matches when the API is unavailable.