import { type NextRequest } from 'next/server'
import { authMiddleware } from '@/lib/auth-middleware'

export async function middleware(request: NextRequest) {
  // Use the new authentication middleware
  return await authMiddleware(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm|mov|avi)$).*)',
  ],
}