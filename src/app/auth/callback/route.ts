import { createServerClient } from '@supabase/ssr';
import { type EmailOtpType } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/lib/supabase/types';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/tableau-de-bord';

  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
          }
        },
      },
    }
  );

  // 1. Échange PKCE par code
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (type === 'recovery' || next.includes('reinitialisation')) {
        return NextResponse.redirect(`${origin}/reinitialisation-mot-de-passe`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // 2. Vérification OTP par token_hash
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      if (type === 'recovery' || next.includes('reinitialisation')) {
        return NextResponse.redirect(`${origin}/reinitialisation-mot-de-passe`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // En cas d'erreur ou d'échec
  if (type === 'recovery' || next.includes('reinitialisation')) {
    return NextResponse.redirect(`${origin}/reinitialisation-mot-de-passe?erreur=invalide`);
  }

  return NextResponse.redirect(`${origin}/connexion?erreur=auth_callback`);
}
