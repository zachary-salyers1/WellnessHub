import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect routes that require authentication
  if (!session && (
    req.nextUrl.pathname.startsWith('/dashboard') ||
    req.nextUrl.pathname.startsWith('/workouts') ||
    req.nextUrl.pathname.startsWith('/nutrition') ||
    req.nextUrl.pathname.startsWith('/profile')
  )) {
    const redirectUrl = new URL('/auth/login', req.url);
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users away from auth pages
  if (session && (
    req.nextUrl.pathname.startsWith('/auth/login') ||
    req.nextUrl.pathname.startsWith('/auth/register')
  )) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/workouts/:path*',
    '/nutrition/:path*',
    '/profile/:path*',
    '/auth/:path*',
  ],
};