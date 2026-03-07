import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Routes accessible without authentication
const PUBLIC_ROUTES = ["/login", "/auth/callback"];

// Routes that work in trial mode (no login required)
const TRIAL_ROUTES = ["/home", "/explore"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth callback (no session check needed)
  if (pathname.startsWith("/auth/callback")) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Logged-in users: redirect landing and login to /home
  if (user && (pathname === "/" || pathname === "/login")) {
    const url = request.nextUrl.clone();
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  // Landing and login: allow without auth
  if (pathname === "/" || pathname === "/login") {
    return supabaseResponse;
  }

  // Allow trial mode routes without auth
  if (!user && TRIAL_ROUTES.some((route) => pathname.startsWith(route))) {
    return supabaseResponse;
  }

  // Redirect unauthenticated users to login
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|icons/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
