import { NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'http://localhost:8080';

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

export async function proxyAuth(
  request,
  backendPath,
  { clearOnUnauthorized = true } = {}
) {
  const body =
    request.method === 'GET'
      ? undefined
      : await request.text();

  const token = request.cookies.get('authToken')?.value;

  console.log('🔐 PROXY:', {
    backendPath,
    hasCookie: !!token,
    tokenLength: token?.length || 0,
  });

  const headers = {};

  if (body) {
    headers['Content-Type'] =
      request.headers.get('content-type') ||
      'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;

    console.log('✅ Authorization header attached');
  }

  // ...
}

export function clearAuthCookie(response) {
  response.cookies.set('authToken', '', {
    ...cookieOptions(),
    maxAge: 0,
  });

  return response;
}

export function getAuthToken(request) {
  return request.cookies.get('authToken')?.value || null;
}