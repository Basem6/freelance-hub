import { clearAuthCookie, proxyAuth } from '../../../lib/server-auth';

export async function POST(request) {
  const response = await proxyAuth(request, '/api/auth/logout', { clearOnUnauthorized: false });
  return clearAuthCookie(response);
}
