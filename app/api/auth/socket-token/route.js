import { NextResponse } from 'next/server';
import { getAuthToken } from '../../../lib/server-auth';

export async function GET(request) {
  const token = getAuthToken(request);

  if (!token) {
    return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
  }

  return NextResponse.json({ success: true, token });
}