import { NextRequest, NextResponse } from 'next/server';
import cookie from 'cookie';

const protectedRoutes = ['/'];
const publicRoutes = ['/auth/login'];

export function middleware(req: NextRequest) {
	const path = req.nextUrl.pathname;
	const isProtectedRoute = protectedRoutes.includes(path);
	const isPublicRoute = publicRoutes.includes(path);
	const cookies = cookie.parse(req.headers.get('cookie') || '');
	const token = cookies['jwtTest'];

	// 5. Redirect to /dashboard if the user is authenticated
	if (isProtectedRoute && !token) {
		return NextResponse.redirect(new URL('/auth/login', req.nextUrl));
	}

	if (isPublicRoute && token) {
		return NextResponse.redirect(new URL('/', req.nextUrl));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
