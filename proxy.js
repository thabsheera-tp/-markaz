import { NextResponse } from 'next/server';

export function proxy(req) {
  const { pathname } = req.nextUrl;

  // 1. Guard /api/admin/* endpoints before hitting backend lambdas
  if (pathname.startsWith('/api/admin/')) {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1] || req.cookies.get('markaz_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required to access administrator endpoints.' },
        { status: 401 }
      );
    }
  }

  const response = NextResponse.next();

  // 2. Prevent search engines and scrapers from indexing /admin and /api
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  }

  // 3. Reinforce critical security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/admin', '/api/:path*'],
};
