import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import {
  API_AUTH_PREFIX,
  AUTH_ROUTES,
  PUBLIC_PATHS,
  ROLE_PATH_MAP
} from './constants/routes';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = req?.auth?.user?.role;

  if (process.env.NODE_ENV === 'development') {
    console.log(
      'Middleware - Path:',
      pathname,
      'Logged in:',
      isLoggedIn,
      'Role:',
      role
    );
  }

  const isPublic = PUBLIC_PATHS.some(
    (path) =>
      pathname === path || (path !== '/' && pathname.startsWith(`${path}/`))
  );

  const isAuthRoute = AUTH_ROUTES.some(
    (authPath) => pathname === authPath || pathname.startsWith(`${authPath}/`)
  );

  // Allow access to NextAuth API routes
  if (pathname.startsWith(API_AUTH_PREFIX)) {
    return NextResponse.next();
  }

  // If user is logged in and tries to visit a login route → redirect to role's home
  if (isLoggedIn && isAuthRoute) {
    const allowedPath =
      ROLE_PATH_MAP[role as keyof typeof ROLE_PATH_MAP] || '/';
    return NextResponse.redirect(new URL(allowedPath, req.url));
  }

  // If user is not logged in and route is protected → send to login
  if (!isLoggedIn && !isPublic && !isAuthRoute) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Role-based route restriction
  if (isLoggedIn && role) {
    const allowedPrefix = ROLE_PATH_MAP[role as keyof typeof ROLE_PATH_MAP];
    if (
      allowedPrefix &&
      !pathname.startsWith(allowedPrefix) &&
      !isPublic &&
      !isAuthRoute &&
      !pathname.startsWith(API_AUTH_PREFIX)
    ) {
      return NextResponse.redirect(new URL(allowedPrefix, req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Avoid Next.js internals and static assets
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)'
  ]
};
