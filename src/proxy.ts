import { NextResponse, type NextRequest } from 'next/server'

const locales = ['en', 'hi', 'mr'];
const defaultLocale = 'en';

function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Locale Redirection (Fastest Path for Public Users)
  if (
    !pathname.startsWith('/admin') &&
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/_next') &&
    !pathname.includes('.') // typically indicates a file request
  ) {
    const pathnameHasLocale = locales.some(
      (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (!pathnameHasLocale) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = `/${defaultLocale}${pathname}`;
      return applySecurityHeaders(NextResponse.rewrite(redirectUrl));
    }
    
    return applySecurityHeaders(NextResponse.next());
  }

  // 2. Admin Route Protection (Heavy Path)
  if (pathname.startsWith('/admin')) {
    let supabaseResponse = NextResponse.next({
      request,
    })

    // Dynamically import Supabase to keep Edge execution payload extremely light for public routes
    const { createServerClient } = await import('@supabase/ssr')

    // Only initialize Supabase on admin routes to save Edge execution time
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // Skip auth check for login page
    if (pathname.startsWith('/admin/login')) {
      return applySecurityHeaders(supabaseResponse);
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return applySecurityHeaders(NextResponse.redirect(url))
    }
    
    return applySecurityHeaders(supabaseResponse);
  }

  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
