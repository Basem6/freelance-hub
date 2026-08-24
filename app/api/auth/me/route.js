import { proxyAuth } from '../../../lib/server-auth';

export async function GET(request) {
  return proxyAuth(request, '/api/auth/me');
}
