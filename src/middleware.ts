import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // Create a response we can modify
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create Supabase client that can read/write cookies on this request/response
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          // Write cookie to the request so subsequent server code sees it
          request.cookies.set({ name, value, ...(options as object) })
          // Recreate response with updated request headers
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          // Write cookie to the response so the browser saves it
          response.cookies.set({ name, value, ...(options as object) })
        },
        remove(name: string, options: Record<string, unknown>) {
          request.cookies.set({ name, value: '', ...(options as object) })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...(options as object) })
        },
      },
    }
  )

  // IMPORTANT: This call refreshes the session if it's expired and
  // writes the updated session cookies back. Must run on every request.
  await supabase.auth.getUser()

  return response
}

export const config = {
  matcher: [
    /*
     * Match every route EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimisation)
     * - favicon.ico, favicon.svg
     * - public image files
     */
    '/((?!_next/static|_next/image|favicon\\.ico|favicon\\.svg|robots\\.txt|.*\\.(?:png|jpg|jpeg|gif|webp|svg)$).*)',
  ],
}