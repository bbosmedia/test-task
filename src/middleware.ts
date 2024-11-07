import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const protectedRoutes = ['/'];
const publicRoutes = ['/auth/login'];

export async function middleware(req: NextRequest) {
	const cookieStore = await cookies();
	const path = req.nextUrl.pathname;
	const isProtectedRoute = protectedRoutes.includes(path);
	const isPublicRoute = publicRoutes.includes(path);
	const user = cookieStore.get('jwtTest');

	// 5. Redirect to /dashboard if the user is authenticated
	if (isProtectedRoute && !user) {
		return NextResponse.redirect(new URL('/auth/login', req.nextUrl));
	}

	if (isPublicRoute && user) {
		return NextResponse.redirect(new URL('/', req.nextUrl));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
