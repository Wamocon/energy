import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { routing } from './src/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect dashboard routes (with or without locale prefix)
  const isDashboard =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/en/dashboard');

  if (isDashboard) {
    // Apply intl routing first, then check auth
    const intlResponse = intlMiddleware(request);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        db: { schema: process.env.SUPABASE_DB_SCHEMA ?? 'public' },
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              intlResponse.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const locale = pathname.startsWith('/en/') ? 'en' : 'de';
      const loginPath = locale === 'en' ? '/en/auth/login' : '/auth/login';
      return NextResponse.redirect(new URL(loginPath, request.url));
    }

    return intlResponse;
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
