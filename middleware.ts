// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const host = req.headers.get("host") || "";
    const { pathname } = req.nextUrl;

    // ✅ Don't redirect .well-known (Digital Asset Links, Apple association, etc.)
    if (pathname.startsWith("/.well-known/")) {
        return NextResponse.next();
    }

    // ✅ Redirect non-www -> www for everything else
    if (host === "tadaomarket.com") {
        const url = req.nextUrl.clone();
        url.hostname = "www.tadaomarket.com";
        return NextResponse.redirect(url, 308);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next|favicon.ico).*)"],
};
