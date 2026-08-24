import { proxyAuth } from '../../lib/server-auth';

function backendPath(path) {
  const segments = path?.path || [];
  const forwardedSegments = segments[0] === 'backend' ? segments.slice(1) : segments;
  return `/${forwardedSegments.map((segment) => encodeURIComponent(segment)).join('/')}`;
}

async function handle(request, context) {
  const params = await context.params;
  return proxyAuth(request, backendPath(params));
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
