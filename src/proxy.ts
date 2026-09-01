import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/lib/supabase/types';

/**
 * Garde d'accès à l'espace d'administration.
 *
 * Fichier `proxy.ts` et non `middleware.ts` : Next.js 16 a déprécié la
 * convention `middleware`, renommée `proxy`. Il doit vivre dans `src/`,
 * au même niveau que `app/` — à la racine du projet, il est ignoré
 * silencieusement, sans le moindre avertissement au démarrage.
 *
 * PORTÉE VOLONTAIREMENT RESTREINTE — le `matcher` en bas de fichier ne couvre
 * que `/admin`. Le reste de ChinoisLingo garde son fonctionnement actuel
 * (authentification 100 % navigateur, aucune route protégée) : activer la
 * session serveur partout aurait été un changement d'architecture bien plus
 * large que l'ajout de cet espace.
 *
 * Le contrôle est fait ICI, côté serveur, avant même que la page ne soit
 * rendue. Un utilisateur sans le rôle `admin` est redirigé vers son tableau
 * de bord sans jamais recevoir le code de l'interface d'administration.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Configuration absente : on refuse l'accès plutôt que de laisser passer.
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(new URL('/tableau-de-bord', request.url));
  }

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // getUser() valide le jeton auprès de Supabase — contrairement à
  // getSession(), qui se contente de lire le cookie sans le vérifier.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL('/connexion', request.url));
  }

  const { data: profil } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profil?.role !== 'admin') {
    // Redirection silencieuse : on ne confirme pas l'existence de /admin
    // à quelqu'un qui n'y a pas droit.
    return NextResponse.redirect(new URL('/tableau-de-bord', request.url));
  }

  return response;
}

export const config = {
  // Uniquement /admin et ses sous-chemins. Aucune autre route n'est touchée.
  matcher: ['/admin/:path*'],
};

export default proxy;
