export const DEFAULT_BASE = "https://api.cricapi.com/v1";

export function cacheHeaders(res, ttl) {
  const seconds = Number.isFinite(ttl) && ttl > 0 ? ttl : 60;
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", `s-maxage=${seconds}, stale-while-revalidate=${seconds * 2}`);
}

export function upstreamUrl(base, path, key, params = {}) {
  const url = new URL(`${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`);
  url.searchParams.set("apikey", key);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  }
  return url.toString();
}

export async function fetchJson(url) {
  const r = await fetch(url, { headers: { Accept: "application/json" } });
  const text = await r.text();
  let data;
  try { data = JSON.parse(text); } catch { throw new Error(`Invalid upstream JSON (${r.status})`); }
  if (!r.ok) throw new Error(data?.reason || data?.message || `Upstream HTTP ${r.status}`);
  return data;
}

export function apiError(res, status, message, details) {
  return res.status(status).json({ error: message, ...(details ? { details } : {}) });
}