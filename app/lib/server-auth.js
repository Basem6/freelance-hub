import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// ── Extract a JWT token from the backend's JSON payload ─────────────────────
function getToken(payload) {
  return (
    payload?.token ||
    payload?.authToken ||
    payload?.accessToken ||
    payload?.data?.token ||
    payload?.data?.authToken ||
    null
  );
}

// ── Strip the raw token from the payload before sending to the browser ───────
// The cookie is HttpOnly; the browser JS must never see the bare token string.
function sanitizePayload(payload) {
  if (!payload || typeof payload !== 'object') return payload;
  const sanitized = { ...payload };
  delete sanitized.token;
  delete sanitized.authToken;
  delete sanitized.accessToken;
  if (sanitized.data) {
    sanitized.data = { ...sanitized.data };
    delete sanitized.data.token;
    delete sanitized.data.authToken;
  }
  return sanitized;
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  };
}

async function readResponse(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

// ── Main proxy helper ────────────────────────────────────────────────────────
export async function proxyAuth(
  request,
  backendPath,
  { clearOnUnauthorized = true } = {}
) {
  const body = request.method === 'GET' ? undefined : await request.text();
  console.log("🍪 COOKIES:", request.cookies.getAll());

  const token = request.cookies.get('authToken')?.value;

  console.log("🔑 TOKEN:", token ? "FOUND" : "NOT FOUND");

  const headers = {};
  if (body) {
    headers['Content-Type'] =
      request.headers.get('content-type') || 'application/json';
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // ── Logging (helps diagnose Railway issues) ──────────────────────────────
  const logLabel = `[proxyAuth] ${request.method} ${backendPath}`;
  console.log(logLabel, {
    hasToken: !!token,
    hasBody: !!body,
    target: `${API_URL}${backendPath}`,
  });

  let backendResponse;
  try {
    backendResponse = await fetch(`${API_URL}${backendPath}`, {
      method: request.method,
      headers,
      body,
      cache: 'no-store',
    });
  } catch (err) {
    console.error(logLabel, 'fetch error →', err.message);
    return NextResponse.json(
      { success: false, message: 'Authentication service unavailable' },
      { status: 502 }
    );
  }

  const rawPayload = await readResponse(backendResponse);

  // ── Log backend result ───────────────────────────────────────────────────
  console.log(logLabel, '← backend status', backendResponse.status, {
    success: rawPayload?.success,
    isNewUser: rawPayload?.isNewUser,
    hasToken: !!getToken(rawPayload),
  });

  // ── Extract token before sanitising ─────────────────────────────────────
  const responseToken = getToken(rawPayload);

  // ── Never send the raw token to the browser ──────────────────────────────
  const safePayload = sanitizePayload(rawPayload);

  const response = NextResponse.json(safePayload, {
    status: backendResponse.status,
  });

  if (backendResponse.ok && responseToken) {
    console.log(logLabel, '→ setting authToken cookie');
    response.cookies.set('authToken', responseToken, cookieOptions());
  } else if (clearOnUnauthorized && backendResponse.status === 401) {
    console.log(logLabel, '→ clearing authToken cookie (401)');
    response.cookies.delete('authToken');
  }

  return response;
}

export function clearAuthCookie(response) {
  response.cookies.set('authToken', '', { ...cookieOptions(), maxAge: 0 });
  return response;
}

export function getAuthToken(request) {
  return request.cookies.get('authToken')?.value || null;
}
