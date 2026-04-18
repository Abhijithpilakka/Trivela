import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  console.log('🔐 OAuth callback hit:', { code: code ? '***' : 'missing', next })

  if (!code) {
    console.error('No code in OAuth callback')
    return NextResponse.redirect(`${origin}/auth/error`)
  }

  // Build the redirect response first so we can set cookies on it
  const callbackBase = process.env.NEXT_PUBLIC_APP_URL || origin
  const redirectUrl = `${callbackBase.replace(/\/$/, '')}${next}`

  // Keep track of cookies set by exchangeCodeForSession
  const setCookies: Array<{ name: string; value: string; options?: any }> = []

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
          // Store for later application to response
          setCookies.push(...cookiesToSet)
          // Also set on request so it's available for profile fetching
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
        },
      },
    }
  )

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)
  console.log('exchangeCodeForSession result:', { hasUser: !!data?.user, error: error?.message })

  if (error || !data.user) {
    console.error('❌ exchangeCodeForSession failed:', error?.message)
    return NextResponse.redirect(`${origin}/auth/error`)
  }
  console.log('✅ Session exchanged successfully for user:', data.user.email)

  // Profile row will be created by the DB trigger (handle_new_user).
  // We also try here as a safety net — errors are non-fatal.
  try {
    await supabase.from('users').upsert(
      {
        id: data.user.id,
        email: data.user.email ?? '',
        fan_name: data.user.user_metadata?.full_name?.split(' ')[0]?.trim() ?? '',
        supported_club: '',
        xp: 0,
        level: 1,
      },
      { onConflict: 'id', ignoreDuplicates: true }
    )
  } catch (e) {
    // Non-fatal — client will handle onboarding
    console.warn('Profile upsert in callback:', e)
  }

  // Build response and copy ALL cookies from request (including those set by exchangeCodeForSession)
  const response = NextResponse.redirect(redirectUrl)
  const allCookies = request.cookies.getAll()
  console.log('📍 Cookies to set on response:', allCookies.map(c => c.name))

  allCookies.forEach(({ name, value }) => {
    response.cookies.set(name, value)
  })

  // Also apply any cookies that were stored with options from setCookies
  setCookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options)
  })

  console.log('🎯 Redirecting to:', redirectUrl)
  return response
}