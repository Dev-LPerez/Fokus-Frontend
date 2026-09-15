import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '';

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Check auth session claims / user safely
  let user = null;
  try {
    if (typeof (supabase.auth as unknown as { getClaims?: () => Promise<{ data?: { claims?: unknown } }> }).getClaims === 'function') {
      const { data } = await (supabase.auth as unknown as { getClaims: () => Promise<{ data?: { claims?: unknown } }> }).getClaims();
      user = data?.claims ?? null;
    } else {
      const { data } = await supabase.auth.getUser();
      user = data?.user ?? null;
    }
  } catch {
    const { data } = await supabase.auth.getUser();
    user = data?.user ?? null;
  }

  const { pathname } = request.nextUrl;

  const isProtectedPath =
    pathname.startsWith('/chat') ||
    pathname.startsWith('/conversations') ||
    pathname.startsWith('/calendar') ||
    pathname.startsWith('/projects') ||
    pathname.startsWith('/settings');

  const isAuthPath =
    pathname.startsWith('/login') ||
    pathname.startsWith('/register');

  // If user is not authenticated and is trying to access a protected route
  if (!user && isProtectedPath) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  // If user is already authenticated and visits login or register
  if (user && isAuthPath) {
    const url = request.nextUrl.clone();
    url.pathname = '/chat';
    url.searchParams.delete('redirectTo');
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public asset files (svg, png, jpg, jpeg, gif, webp)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
