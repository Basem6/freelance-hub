import { NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'http://localhost:8080';

function getToken(payload) {
  return payload?.token || payload?.authToken || payload?.accessToken || payload?.data?.token || payload?.data?.authToken || null;
}

function getTokenFromSetCookie(setCookie) {
  if (!setCookie) return null;
  const match = setCookie.match(/(?:^|,\s*)authToken=([^;]+)/);
  return match?.[1] || null;
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

export async function proxyAuth(request, backendPath, { clearOnUnauthorized = true } = {}) {
  const body = request.method === 'GET' ? undefined : await request.text();
  const token = request.cookies.get('authToken')?.value;
  const headers = {};

  if (body) headers['Content-Type'] = request.headers.get('content-type') || 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  let backendResponse;
  try {
    backendResponse = await fetch(`${API_URL}${backendPath}`, {
      method: request.method,
      headers,
      body,
      cache: 'no-store',
    });
  } catch {
    return NextResponse.json({ success: false, message: 'Authentication service unavailable' }, { status: 502 });
  }

  const payload = await readResponse(backendResponse);
  const response = NextResponse.json(payload, { status: backendResponse.status });
  const responseToken = getToken(payload) || getTokenFromSetCookie(backendResponse.headers.get('set-cookie'));

  if (backendResponse.ok && responseToken) {
    response.cookies.set('authToken', responseToken, cookieOptions());
  } else if (clearOnUnauthorized && backendResponse.status === 401) {
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
