document.addEventListener("DOMContentLoaded", async () => {
  const tokenInput = document.getElementById("tokenInput");
  const analyzeBtn = document.getElementById("analyzeBtn");
  const scanBtn = document.getElementById("scanBtn");
  const scanStatus = document.getElementById("scanStatus");
  const jwtFound = document.getElementById("jwtFound");

  const results = document.getElementById("results");
  const riskPill = document.getElementById("riskPill");
  const riskText = document.getElementById("riskText");
  const expText = document.getElementById("expText");
  const skewText = document.getElementById("skewText");
  const algText = document.getElementById("algText");
  const claimWarnings = document.getElementById("claimWarnings");
  const recommendations = document.getElementById("recommendations");
  const headerJson = document.getElementById("headerJson");
  const payloadJson = document.getElementById("payloadJson");

  // ----------------------------
  // Token extraction
  // ----------------------------
  function looksLikeJwtOrJwe(token) {
    if (!token || typeof token !== "string") return false;
    const s = token.trim()
      .replace(/^Bearer\s+/i, "")
      .replace(/%2E/gi, ".")
      .replace(/^"+|"+$/g, "");
    const parts = s.split(".");
    if (!(parts.length === 3 || parts.length === 5)) return false;
    const b64url = /^[A-Za-z0-9\-_]+$/;
    return parts.every((p) => p.length > 0 && b64url.test(p));
  }

  function extractJwtCandidatesFromString(raw) {
    if (raw === null || raw === undefined) return [];
    const out = new Set();

    const s0 = String(raw).trim()
      .replace(/^Bearer\s+/i, "")
      .replace(/%2E/gi, ".")
      .replace(/^"+|"+$/g, "");

    const jwt3 = /([A-Za-z0-9\-_]+)\.([A-Za-z0-9\-_]+)\.([A-Za-z0-9\-_]+)/g;
    const jwe5 =
      /([A-Za-z0-9\-_]+)\.([A-Za-z0-9\-_]+)\.([A-Za-z0-9\-_]+)\.([A-Za-z0-9\-_]+)\.([A-Za-z0-9\-_]+)/g;

    let m;
    while ((m = jwt3.exec(s0)) !== null) out.add(`${m[1]}.${m[2]}.${m[3]}`);
    while ((m = jwe5.exec(s0)) !== null) out.add(`${m[1]}.${m[2]}.${m[3]}.${m[4]}.${m[5]}`);

    if ((s0.startsWith("{") && s0.endsWith("}")) || (s0.startsWith("[") && s0.endsWith("]"))) {
      try {
        const obj = JSON.parse(s0);
        const stack = [obj];
        while (stack.length) {
          const cur = stack.pop();
          if (typeof cur === "string") {
            extractJwtCandidatesFromString(cur).forEach((t) => out.add(t));
          } else if (Array.isArray(cur)) {
            cur.forEach((x) => stack.push(x));
          } else if (cur && typeof cur === "object") {
            Object.values(cur).forEach((x) => stack.push(x));
          }
        }
      } catch {}
    }

    return Array.from(out);
  }

  // ----------------------------
  // Decode JWT (3-part only)
  // ----------------------------
  function base64UrlToUtf8(b64url) {
    const b64 =
      b64url.replace(/-/g, "+").replace(/_/g, "/") +
      "===".slice((b64url.length + 3) % 4);
    const binary = atob(b64);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  function safeJsonParse(s) {
    try { return JSON.parse(s); } catch { return null; }
  }

  function decodeJwt3(token) {
    const s = token.trim().replace(/^Bearer\s+/i, "").replace(/%2E/gi, ".");
    const parts = s.split(".");
    if (parts.length !== 3) throw new Error("Not a 3-part JWT (might be JWE).");
    const [h, p, sig] = parts;
    const headerStr = base64UrlToUtf8(h);
    const payloadStr = base64UrlToUtf8(p);
    const header = safeJsonParse(headerStr);
    const payload = safeJsonParse(payloadStr);
    return { header, payload, signatureB64Url: sig, headerStr, payloadStr };
  }

  // ----------------------------
  // Analysis
  // ----------------------------
  function secondsToHuman(s) {
    const abs = Math.abs(s);
    const sign = s < 0 ? "-" : "";
    if (abs < 60) return `${sign}${abs}s`;
    const m = Math.round(abs / 60);
    if (m < 60) return `${sign}${m}m`;
    const h = Math.round(m / 60);
    if (h < 48) return `${sign}${h}h`;
    const d = Math.round(h / 24);
    return `${sign}${d}d`;
  }

  function formatUnixSeconds(sec) {
    if (typeof sec !== "number") return "—";
    const d = new Date(sec * 1000);
    return `${d.toLocaleString()} (${sec})`;
  }

  function analyzeToken(header, payload) {
    const warnings = [];
    const recs = [];
    let score = 0;

    const alg = header?.alg;
    if (!alg) {
      warnings.push({ level: "high", text: "Missing header.alg — verifier may accept unexpected algorithms." });
      recs.push("Require explicit allow-list of algorithms (RS256/ES256) on the server.");
      score += 3;
    } else {
      if (String(alg).toLowerCase() === "none") {
        warnings.push({ level: "high", text: "alg=none — unsafe if accepted." });
        recs.push("Reject alg=none; enforce signed tokens only.");
        score += 5;
      }
      if (/^HS/i.test(String(alg))) {
        warnings.push({ level: "med", text: `Symmetric algorithm (${alg}) — ensure strong secret + avoid confusion.` });
        recs.push("Use a strong rotated secret; prefer RS256/ES256 for multi-service verification.");
        score += 2;
      }
    }

    const now = Math.floor(Date.now() / 1000);
    const exp = payload?.exp;
    const nbf = payload?.nbf;
    const iat = payload?.iat;
    const allowedSkewSec = 60;

    if (typeof exp !== "number") {
      warnings.push({ level: "high", text: "Missing exp — tokens without expiry can live indefinitely." });
      recs.push("Always include exp; short TTLs (5–15 min) for access tokens.");
      score += 4;
    } else {
      const ttl = exp - now;
      if (ttl <= 0) {
        warnings.push({ level: "high", text: "Token is expired." });
        recs.push("Reject expired tokens; ensure NTP clock sync on issuer/validator.");
        score += 4;
      } else if (ttl > 60 * 60 * 24) {
        warnings.push({ level: "med", text: `Long-lived token TTL ~ ${secondsToHuman(ttl)}.` });
        recs.push("Shorten access token TTL; use refresh tokens for long sessions.");
        score += 2;
      }
    }

    if (typeof nbf === "number") {
      const wait = nbf - now;
      if (wait > allowedSkewSec) {
        warnings.push({ level: "med", text: `nbf in future by ~${secondsToHuman(wait)} — clock skew risk.` });
        recs.push("Allow small skew (30–120s) and sync clocks.");
        score += 1;
      }
    }

    if (typeof iat === "number") {
      const drift = iat - now;
      if (drift > allowedSkewSec) {
        warnings.push({ level: "med", text: `iat in future by ~${secondsToHuman(drift)} — time drift suspected.` });
        recs.push("Validate iat with skew allowance; sync clocks.");
        score += 1;
      }
    }

    if (!payload?.iss) {
      warnings.push({ level: "med", text: "Missing iss — issuer validation becomes weaker." });
      recs.push("Validate iss strictly against expected issuer.");
      score += 2;
    }

    if (!payload?.aud) {
      warnings.push({ level: "med", text: "Missing aud — token may be used by unintended services." });
      recs.push("Validate aud strictly (service/client id).");
      score += 2;
    }

    warnings.push({ level: "info", text: "Signature not verified here (no key/JWKS). Decode ≠ trust." });
    recs.push("Verify signature server-side with correct key + strict algorithm allow-list.");

    let risk = "Low";
    if (score >= 7) risk = "High";
    else if (score >= 3) risk = "Medium";

    return { risk, alg, exp, allowedSkewSec, warnings, recommendations: Array.from(new Set(recs)) };
  }

  function setRiskPill(risk) {
    riskPill.textContent = risk;
    riskPill.className = "pill";
    if (risk === "Low") riskPill.classList.add("low");
    if (risk === "Medium") riskPill.classList.add("med");
    if (risk === "High") riskPill.classList.add("high");
  }

  function renderAnalysis(decoded, analysis) {
    results.style.display = "block";
    setRiskPill(analysis.risk);
    riskText.textContent = analysis.risk;
    algText.textContent = analysis.alg || "—";

    const now = Math.floor(Date.now() / 1000);
    if (typeof analysis.exp === "number") {
      const ttl = analysis.exp - now;
      expText.textContent = `${formatUnixSeconds(analysis.exp)} • TTL ${secondsToHuman(ttl)}`;
    } else {
      expText.textContent = "Missing exp";
    }
    skewText.textContent = `Guidance: allow ~${analysis.allowedSkewSec}s clock skew`;

    claimWarnings.innerHTML = "";
    for (const w of analysis.warnings) {
      const li = document.createElement("li");
      li.className = w.level === "high" ? "bad" : w.level === "med" ? "warn" : "muted";
      li.textContent = `${w.level.toUpperCase()}: ${w.text}`;
      claimWarnings.appendChild(li);
    }

    recommendations.innerHTML = "";
    for (const r of analysis.recommendations) {
      const li = document.createElement("li");
      li.textContent = r;
      recommendations.appendChild(li);
    }

    headerJson.textContent = decoded.header ? JSON.stringify(decoded.header, null, 2) : decoded.headerStr;
    payloadJson.textContent = decoded.payload ? JSON.stringify(decoded.payload, null, 2) : decoded.payloadStr;
  }

  function renderJweNote(token) {
    results.style.display = "block";
    setRiskPill("Low");
    riskText.textContent = "Low";
    algText.textContent = "JWE (encrypted)";
    expText.textContent = "Not readable (encrypted)";
    skewText.textContent = "—";
    claimWarnings.innerHTML = `<li class="muted">INFO: Looks like JWE (5 parts). Claims can’t be decoded without keys.</li>`;
    recommendations.innerHTML = `<li>Inspect decrypted token server-side or add decrypt/key support.</li>`;
    headerJson.textContent = token;
    payloadJson.textContent = "";
  }

  function analyzeCurrentInput() {
    const raw = (tokenInput.value || "").trim();
    const candidates = extractJwtCandidatesFromString(raw).filter(looksLikeJwtOrJwe);

    if (!candidates.length) {
      results.style.display = "block";
      setRiskPill("High");
      riskText.textContent = "High";
      claimWarnings.innerHTML = `<li class="bad">HIGH: No JWT/JWE found (need header.payload.signature).</li>`;
      recommendations.innerHTML = `<li>Paste a valid JWT/JWE or click “Scan active site”.</li>`;
      headerJson.textContent = "";
      payloadJson.textContent = "";
      return;
    }

    const token = candidates[0];
    const parts = token.split(".");
    if (parts.length === 5) return renderJweNote(token);

    const decoded = decodeJwt3(token);
    if (!decoded.header || !decoded.payload) {
      results.style.display = "block";
      setRiskPill("High");
      riskText.textContent = "High";
      claimWarnings.innerHTML = `<li class="bad">HIGH: Could not parse JWT header/payload JSON.</li>`;
      recommendations.innerHTML = `<li>Verify token encoding and that it is a standard JWT.</li>`;
      headerJson.textContent = token;
      payloadJson.textContent = "";
      return;
    }

    const analysis = analyzeToken(decoded.header, decoded.payload);
    renderAnalysis(decoded, analysis);
  }

  // ----------------------------
  // Scan: cookies + storage
  // ----------------------------
  async function getActiveTab() {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    return tabs && tabs.length ? tabs[0] : null;
  }

  async function getCookiesForTab(tabUrl) {
    const u = new URL(tabUrl);
    let cookies = await browser.cookies.getAll({ domain: u.hostname });
    if (!cookies.length) cookies = await browser.cookies.getAll({ url: tabUrl });
    return cookies || [];
  }

  async function getAllFrameIds(tabId) {
    // Firefox supports enumerate frames
    const frames = await browser.webNavigation.getAllFrames({ tabId });
    return (frames || []).map((f) => f.frameId);
  }

  async function scanActiveSite() {
    scanStatus.textContent = "Scanning cookies + local/session storage…";
    jwtFound.innerHTML = "";

    const tab = await getActiveTab();
    if (!tab?.id || !tab?.url) {
      scanStatus.textContent = "No active tab found.";
      return;
    }
    if (/^(about|moz-extension):\/\//i.test(tab.url)) {
      scanStatus.textContent = "Open a normal website tab (not about:/moz-extension:) and try again.";
      return;
    }

    const found = [];
    const seen = new Set();

    // Cookies
    try {
      const cookies = await getCookiesForTab(tab.url);
      for (const c of cookies) {
        const tokens = extractJwtCandidatesFromString(c.value).filter(looksLikeJwtOrJwe);
        for (const t of tokens) {
          const key = `cookie:${c.name}:${t}`;
          if (seen.has(key)) continue;
          seen.add(key);
          found.push({ source: "cookie", key: c.name, token: t });
        }
      }
    } catch (e) {
      console.error("Cookie scan error:", e);
    }

    // localStorage/sessionStorage from all frames via content script
    try {
      const frameIds = await getAllFrameIds(tab.id);

      for (const frameId of frameIds) {
        const resp = await browser.tabs.sendMessage(tab.id, { type: "GET_STORAGE" }, { frameId }).catch(() => null);
        const payload = resp?.ok ? resp.payload : null;
        if (!payload) continue;

        for (const [k, v] of payload.local || []) {
          const tokens = extractJwtCandidatesFromString(v).filter(looksLikeJwtOrJwe);
          for (const t of tokens) {
            const key = `ls:${payload.href}:${k}:${t}`;
            if (seen.has(key)) continue;
            seen.add(key);
            found.push({ source: `localStorage (${payload.href})`, key: k, token: t });
          }
        }

        for (const [k, v] of payload.session || []) {
          const tokens = extractJwtCandidatesFromString(v).filter(looksLikeJwtOrJwe);
          for (const t of tokens) {
            const key = `ss:${payload.href}:${k}:${t}`;
            if (seen.has(key)) continue;
            seen.add(key);
            found.push({ source: `sessionStorage (${payload.href})`, key: k, token: t });
          }
        }
      }
    } catch (e) {
      console.error("Storage scan error:", e);
    }

    scanStatus.textContent = found.length ? `Found ${found.length} token(s).` : "No JWT/JWE found.";
    renderFoundTokens(found);
  }

  function renderFoundTokens(found) {
    jwtFound.innerHTML = "";
    if (!found.length) {
      jwtFound.innerHTML = `<div class="muted" style="margin-top:8px;">No JWT/JWE found in cookies/localStorage/sessionStorage.</div>`;
      return;
    }

    const title = document.createElement("div");
    title.className = "muted";
    title.style.marginTop = "8px";
    title.textContent = `Found ${found.length} token(s). Click to analyze:`;
    jwtFound.appendChild(title);

    found.forEach((item, idx) => {
      const box = document.createElement("div");
      box.className = "jwtItem";
      const preview = item.token.slice(0, 18) + "…" + item.token.slice(-12);
      box.innerHTML = `
        <div style="display:flex; justify-content:space-between;">
          <div><strong>${escapeHtml(item.key)}</strong></div>
          <div class="muted">#${idx + 1}</div>
        </div>
        <div class="mono">${escapeHtml(preview)}</div>
        <div class="muted">Source: ${escapeHtml(item.source)}</div>
      `;
      box.addEventListener("click", () => {
        tokenInput.value = item.token;
        analyzeCurrentInput();
      });
      jwtFound.appendChild(box);
    });
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // Wire
  analyzeBtn.addEventListener("click", analyzeCurrentInput);
  scanBtn.addEventListener("click", scanActiveSite);

  setRiskPill("—");
  scanStatus.textContent = "Ready. Click “Scan active site”.";
});
