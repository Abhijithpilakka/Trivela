import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (!code) {
    console.error('No code in callback URL')
    return NextResponse.redirect(`${origin}/auth/error`)
  }

  // We need to set cookies on the response, so create response first
  const response = NextResponse.redirect(`${origin}${next}`)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          // Set on both request (for this handler) and response (for the browser)
          request.cookies.set({ name, value, ...(options as object) })
          response.cookies.set({ name, value, ...(options as object) })
        },
        remove(name: string, options: Record<string, unknown>) {
          request.cookies.set({ name, value: '', ...(options as object) })
          response.cookies.set({ name, value: '', ...(options as object) })
        },
      },
    }
  )

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('exchangeCodeForSession error:', error.message)
    return NextResponse.redirect(`${origin}/auth/error`)
  }

  if (!data.user) {
    console.error('No user after code exchange')
    return NextResponse.redirect(`${origin}/auth/error`)
  }

  // Try to upsert the user profile.
  // This may fail if the table doesn't exist yet — that's OK,
  // the client-side useAuth hook handles the fallback.
  try {
    await supabase.from('users').upsert(
      {
        id: data.user.id,
        email: data.user.email ?? '',
        fan_name: data.user.user_metadata?.full_name?.split(' ')[0] ?? '',
        supported_club: '',
        xp: 0,
        level: 1,
      },
      { onConflict: 'id', ignoreDuplicates: true }
    )
  } catch (e) {
    // Silently continue — client will handle onboarding
    console.warn('Profile upsert skipped:', e)
  }

  // Successful — redirect to the originally requested page (or home)
  return response
}