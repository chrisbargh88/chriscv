// src/services/opensky.js
const bbox = { lamin: -34.3, lamax: -32.5, lomin: 149.8, lomax: 152.1 };
const BASE = `https://opensky-network.org/api/states/all?lamin=${bbox.lamin}&lomin=${bbox.lomin}&lamax=${bbox.lamax}&lomax=${bbox.lomax}`;

function withTimeout(url, ms = 10000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { signal: ctrl.signal }).finally(() => clearTimeout(t));
}

function tryUrls(urls) {
  return urls.reduce(
    (p, url) =>
      p.catch(async () => {
        const r = await withTimeout(url, 10000);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      }),
    Promise.reject(new Error("start"))
  );
}

export async function fetchLiveFlightsCount() {
  const json = await tryUrls([
    BASE,
    `https://cors.isomorphic-git.org/${BASE}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(BASE)}`
  ]);
  const count = Array.isArray(json.states) ? json.states.length : 0;
  const source = json.source || (json.url?.includes('allorigins') ? 'OpenSky (mirror2)' : 'OpenSky');
  return { count, source: 'OpenSky' };
}

// Sydney Airport approx coords (YSSY)
const SYD = { lat: -33.9399, lon: 151.1753 };

// Haversine distance in nautical miles
function haversineNM(lat1, lon1, lat2, lon2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const R_km = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const d_km = 2 * R_km * Math.asin(Math.sqrt(a));
  return d_km * 0.539957; // km -> NM
}

function msToKnots(ms) {
  return (ms * 1.94384); // meters/sec to knots
}
function mToFeet(m) {
  return m * 3.28084;
}

export async function fetchLiveFlightsStates(limit = 30) {
  const json = await tryUrls([
    BASE,
    `https://cors.isomorphic-git.org/${BASE}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(BASE)}`
  ]);

  const now = Math.floor(Date.now() / 1000);
  const rows = (json.states || []).map((s) => {
    // OpenSky states indices: https://opensky-network.org/apidoc/rest.html#response
    const [
      icao24, callsignRaw, origin_country, time_position, last_contact,
      lon, lat, baro_altitude, on_ground, velocity, heading, vertical_rate,
      sensors, geo_altitude, squawk, spi, position_source
    ] = s;

    const callsign = (callsignRaw || '').trim();
    const distNM = (lat != null && lon != null) ? haversineNM(SYD.lat, SYD.lon, lat, lon) : null;

    return {
      icao24,
      callsign: callsign || '(no callsign)',
      origin_country,
      lat, lon,
      on_ground: !!on_ground,
      heading: heading != null ? Math.round(heading) : null,
      speed_kts: velocity != null ? Math.round(msToKnots(velocity)) : null,
      alt_ft: (geo_altitude != null ? Math.round(mToFeet(geo_altitude)) :
               baro_altitude != null ? Math.round(mToFeet(baro_altitude)) : null),
      dist_nm: distNM != null ? Math.round(distNM) : null,
      age_s: last_contact != null ? (now - last_contact) : null,
    };
  });

  // Sort by distance to SYD, then airborne first
  const sorted = rows
    .filter(r => r.dist_nm != null)
    .sort((a, b) => a.dist_nm - b.dist_nm);

  return sorted.slice(0, limit);
}
