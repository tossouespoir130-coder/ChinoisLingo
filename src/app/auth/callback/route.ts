import { createServerClient } from '@supabase/ssr';
import { type EmailOtpType } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/lib/supabase/types';
import { COOKIE_RECUPERATION, DUREE_RECUPERATION_SECONDES } from '@/lib/auth/motDePasse';

/**
 * Destination interne uniquement. Sans ce filtre, `?next=@site-pirate.com`
 * produisait `https://chinoislingo.com@site-pirate.com` : une redirection
 * ouverte, exploitable dans un e-mail d'hameçonnage portant notre domaine.
 */
function destinationSure(next: string | null): string {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) {
    return '/tableau-de-bord';
  }
  return next;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = destinationSure(searchParams.get('next'));
  const estRecuperation = type === 'recovery' || next.startsWith('/reinitialisation-mot-de-passe');

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

  /** Lien de récupération vérifié : on ouvre la page de réinitialisation, et elle seule. */
  const versReinitialisation = () => {
    cookieStore.set(COOKIE_RECUPERATION, '1', {
      path: '/',
      maxAge: DUREE_RECUPERATION_SECONDES,
      sameSite: 'lax',
      secure: origin.startsWith('https://'),
    });
    return NextResponse.redirect(`${origin}/reinitialisation-mot-de-passe`);
  };

  // 1. Échange PKCE par code
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (estRecuperation) return versReinitialisation();
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
      if (estRecuperation) return versReinitialisation();
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // En cas d'erreur ou d'échec
  if (estRecuperation) {
    return NextResponse.redirect(`${origin}/reinitialisation-mot-de-passe?erreur=invalide`);
  }

  return NextResponse.redirect(`${origin}/connexion?erreur=auth_callback`);
}
