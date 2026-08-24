import { proxyAuth } from '../../../../lib/server-auth';

export async function POST(request) {
  return proxyAuth(request, '/api/auth/google/complete');
}
