// app/robots.txt/route.ts

import { NextResponse } from 'next/server';

export function GET() {
    const content = `
    User-agent: *
    Allow: /

    Sitemap: https://tadaoservices.com/sitemap.xml
  `.trim();

    return new NextResponse(content, {
        headers: {
            'Content-Type': 'text/plain',
        },
    });
}
