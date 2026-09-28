import { DEFAULT_BASE, cacheHeaders, upstreamUrl, fetchJson, apiError } from "./_shared.js";

export default async function handler(req, res) {
  const ttl = parseInt(process.env.CACHE_SECONDS || "60", 10);
  cacheHeaders(res, ttl);
  if (req.method !== "GET") return apiError(res, 405, "Method not allowed");
  const key = process.env.CRICKETDATA_API_KEY;
  if (!key) return apiError(res, 500, "Missing CRICKETDATA_API_KEY");

  const id = String(req.query?.id || "");
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(id)) return apiError(res, 400, "Invalid match id");

  const base = process.env.CRICKET_API_BASE || DEFAULT_BASE;
  try {
    const [infoResult, cardResult] = await Promise.allSettled([
      fetchJson(upstreamUrl(base, "match_info", key, { offset: 0, id })),
      fetchJson(upstreamUrl(base, "match_scorecard", key, { offset: 0, id }))
    ]);

    const infoJson = infoResult.status === "fulfilled" ? infoResult.value : null;
    const cardJson = cardResult.status === "fulfilled" ? cardResult.value : null;
    const info = infoJson?.status === "success" ? (infoJson.data || {}) : {};
    const cardData = cardJson?.status === "success" ? cardJson.data : null;
    const scorecard = Array.isArray(cardData?.scorecard) ? cardData.scorecard : Array.isArray(cardData) ? cardData : [];

    if (!Object.keys(info).length && !scorecard.length)
      return apiError(res, 502, "Match data unavailable");

    return res.status(200).json({ info, scorecard });
  } catch (e) {
    return apiError(res, 502, "Could not load match data", e.message);
  }
}