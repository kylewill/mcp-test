import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	if (pathname === "/mcp") return NextResponse.next();
	if (pathname.startsWith("/.well-known/")) return NextResponse.next();

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
