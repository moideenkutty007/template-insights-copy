import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const pathname = request.nextUrl.pathname
 
  // If the pathname is '/dashboard', redirect to the root page
  if (pathname === '/dashboard') {
    return NextResponse.redirect(new URL('/', request.url))
  }
 
  // Otherwise, continue with the request
  return NextResponse.next()
}