import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const locales = ['en', 'hi', 'mr'];
const defaultLocale = 'en';

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
      return NextResponse.rewrite(redirectUrl);
    }
    
    return NextResponse.next();
  }

  // 2. Admin Route Protection (Heavy Path)
  if (pathname.startsWith('/admin')) {
    let supabaseResponse = NextResponse.next({
      request,
    })

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
      return supabaseResponse;
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
    
    return supabaseResponse;
  }

  return NextResponse.next();
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
