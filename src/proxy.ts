import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/lib/supabase/types';
import { COOKIE_SESSION_EPHEMERE, adapterDuree } from '@/lib/supabase/session-ephemere';

/**
 * Garde d'accès de l'application.
 *
 * Fichier `proxy.ts` et non `middleware.ts` : Next.js 16 a déprécié la
 * convention `middleware`, renommée `proxy`. Il doit vivre dans `src/`,
 * au même niveau que `app/` — à la racine du projet, il est ignoré
 * silencieusement, sans le moindre avertissement au démarrage.
 *
 * Trois niveaux de contrôle, tous CÔTÉ SERVEUR, avant tout rendu :
 *
 *   1. Toute route applicative exige une session dont l'adresse e-mail est
 *      CONFIRMÉE. Sans cela, un compte fraîchement créé pouvait atteindre le
 *      tableau de bord et son profil en tapant simplement l'URL : rien ne
 *      protégeait ces pages, l'authentification étant entièrement côté
 *      navigateur.
 *   2. `/admin` exige en plus le rôle `admin`.
 *   3. Les pages d'entrée (`/`, `/connexion`) renvoient un apprenant déjà
 *      connecté vers son tableau de bord. Sans cela, taper l'adresse du site
 *      affichait le formulaire de connexion même avec une session valide —
 *      et « Rester connecté » n'aurait servi à rien.
 *
 * Le retour de paiement et les routes API en sont exclus : ces dernières
 * portent leur propre garde et doivent pouvoir répondre un code d'erreur JSON
 * plutôt qu'une redirection HTML.
 */

/** Pages accessibles sans session (visiteurs). */
const ROUTES_PUBLIQUES = [
  '/abonnement/retour',
  '/onboarding',
  '/inscription',
  '/desabonnement',
  '/reinitialisation-mot-de-passe'
];

/** Pages d'entrée d'authentification : un apprenant connecté est renvoyé vers son tableau de bord. */
const PAGES_ENTREE = ['/connexion'];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const chemin = request.nextUrl.pathname;
  const estEntree = PAGES_ENTREE.includes(chemin);
  const estRacine = chemin === '/';

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Configuration absente : on refuse l'accès protégé plutôt que de laisser passer.
  if (!supabaseUrl || !supabaseAnonKey) {
    if (estRacine || ROUTES_PUBLIQUES.some((r) => chemin.startsWith(r))) return response;
    return estEntree ? response : NextResponse.redirect(new URL('/tableau-de-bord', request.url));
  }

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        const ephemere = request.cookies.has(COOKIE_SESSION_EPHEMERE);
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, adapterDuree(options, ephemere))
        );
      },
    },
  });

  /**
   * Redirection qui conserve les cookies de session rafraîchis par `getUser()`.
   */
  const rediriger = (cible: string, parametres: Record<string, string> = {}) => {
    const url = new URL(cible, request.url);
    Object.entries(parametres).forEach(([cle, valeur]) => url.searchParams.set(cle, valeur));
    const redirection = NextResponse.redirect(url);
    response.cookies.getAll().forEach((cookie) => redirection.cookies.set(cookie));
    return redirection;
  };

  // Traitement spécial de la Racine ("/")
  if (estRacine) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        if (user.email_confirmed_at) {
          return rediriger('/tableau-de-bord');
        } else {
          // Compte non confirmé : guider vers l'écran d'activation
          return rediriger('/connexion', { confirmation: 'requise' });
        }
      }
    } catch {
      // Si Supabase est momentanément indisponible, laisser passer la landing
    }
    return response;
  }

  // Autres routes publiques (ex: /onboarding, /inscription)
  if (ROUTES_PUBLIQUES.some((r) => chemin === r || chemin.startsWith(r + '/'))) {
    return response;
  }

  // Retour d'un lien reçu par e-mail (confirmation, mot de passe oublié, activation) :
  // la page doit afficher le message et le formulaire de connexion sans redirection automatique.
  if (
    chemin === '/connexion' &&
    (request.nextUrl.searchParams.has('code') ||
      request.nextUrl.searchParams.has('confirme') ||
      request.nextUrl.searchParams.has('confirmation') ||
      request.nextUrl.searchParams.has('session'))
  ) {
    return response;
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (estEntree) {
      if (user?.email_confirmed_at) return rediriger('/tableau-de-bord');
      return response;
    }

    if (!user) {
      return rediriger('/connexion');
    }

    // Adresse non confirmée : le compte existe mais n'est pas encore actif.
    if (!user.email_confirmed_at) {
      return rediriger('/connexion', { confirmation: 'requise' });
    }

    // Au-delà, seul /admin impose une condition supplémentaire.
    if (!chemin.startsWith('/admin')) {
      return response;
    }

    const { data: profil } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profil?.role !== 'admin') {
      // Redirection silencieuse : on ne confirme pas l'existence de /admin
      // à quelqu'un qui n'y a pas droit.
      return rediriger('/tableau-de-bord');
    }

    return response;
  } catch (erreur) {
    /**
     * Supabase injoignable, lent ou en panne.
     */
    console.error('[proxy] verification de session impossible', erreur);

    if (estEntree) {
      return response;
    }
    return rediriger('/connexion', { session: 'indisponible' });
  }
}

export const config = {
  /**
   * Toutes les pages applicatives, plus les deux pages d'entrée.
   *
   * Sont volontairement exclus : `/api` (les routes portent leur propre garde
   * et répondent en JSON), les ressources internes de Next, et les fichiers
   * statiques — les soumettre à un contrôle d'authentification ralentirait
   * chaque image sans rien protéger.
   */
  matcher: [
    '/',
    '/connexion',
    '/admin/:path*',
    '/tableau-de-bord/:path*',
    '/vocabulaire/:path*',
    '/ecoute-lecture/:path*',
    '/formation/:path*',
    '/livres/:path*',
    '/mon-compte/:path*',
    '/parametres/:path*',
    '/abonnement/:path*',
  ],
};

export default proxy;
