import { DEFAULT_BASE, cacheHeaders, upstreamUrl, fetchJson, apiError } from "./_shared.js";

export default async function handler(req, res) {
  const ttl = parseInt(process.env.CACHE_SECONDS || "60", 10);
  cacheHeaders(res, ttl);
  if (req.method !== "GET") return apiError(res, 405, "Method not allowed");
  const key = process.env.CRICKETDATA_API_KEY;
  if (!key) return apiError(res, 500, "Missing CRICKETDATA_API_KEY");

  try {
    const base = process.env.CRICKET_API_BASE || DEFAULT_BASE;
    const j = await fetchJson(upstreamUrl(base, "currentMatches", key, { offset: 0 }));
    if (j.status !== "success") return apiError(res, 502, j.reason || "Upstream API error");
    return res.status(200).json({ matches: Array.isArray(j.data) ? j.data : [] });
  } catch (e) {
    return apiError(res, 502, "Could not load cricket matches", e.message);
  }
}