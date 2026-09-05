import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/lib/supabase/types';

/**
 * Garde d'accès de l'application.
 *
 * Fichier `proxy.ts` et non `middleware.ts` : Next.js 16 a déprécié la
 * convention `middleware`, renommée `proxy`. Il doit vivre dans `src/`,
 * au même niveau que `app/` — à la racine du projet, il est ignoré
 * silencieusement, sans le moindre avertissement au démarrage.
 *
 * Deux niveaux de contrôle, tous deux CÔTÉ SERVEUR, avant tout rendu :
 *
 *   1. Toute route applicative exige une session dont l'adresse e-mail est
 *      CONFIRMÉE. Sans cela, un compte fraîchement créé pouvait atteindre le
 *      tableau de bord et son profil en tapant simplement l'URL : rien ne
 *      protégeait ces pages, l'authentification étant entièrement côté
 *      navigateur.
 *   2. `/admin` exige en plus le rôle `admin`.
 *
 * Les pages publiques (connexion, retour de paiement) et les routes API en
 * sont exclues : ces dernières portent leur propre garde et doivent pouvoir
 * répondre un code d'erreur JSON plutôt qu'une redirection HTML.
 */

/** Pages accessibles sans session. */
const ROUTES_PUBLIQUES = ['/connexion', '/abonnement/retour'];
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
  const chemin = request.nextUrl.pathname;
  if (ROUTES_PUBLIQUES.some((r) => chemin.startsWith(r))) {
    return response;
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL('/connexion', request.url));
    }

    // Adresse non confirmée : le compte existe mais n'est pas encore actif.
    // C'est ce contrôle qui manquait — un inscrit non vérifié accédait à tout.
    if (!user.email_confirmed_at) {
      const url = new URL('/connexion', request.url);
      url.searchParams.set('confirmation', 'requise');
      return NextResponse.redirect(url);
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
      return NextResponse.redirect(new URL('/tableau-de-bord', request.url));
    }

    return response;
  } catch (erreur) {
    /**
     * Supabase injoignable, lent ou en panne.
     *
     * Sans ce filet, l'exception remonterait et Next renverrait 500 sur
     * CHAQUE page de l'application : une panne du fournisseur d'identite
     * ferait tomber tout le site, pas seulement l'authentification.
     *
     * On echoue en mode ferme — impossible de verifier la session, donc on
     * traite l'appelant comme non connecte. Jamais l'inverse : laisser
     * passer en cas de panne ouvrirait le contenu payant a tout le monde.
     */
    console.error('[proxy] verification de session impossible', erreur);
    const url = new URL('/connexion', request.url);
    url.searchParams.set('session', 'indisponible');
    return NextResponse.redirect(url);
  }
}

export const config = {
  /**
   * Toutes les pages applicatives.
   *
   * Sont volontairement exclus : `/api` (les routes portent leur propre garde
   * et répondent en JSON), les ressources internes de Next, et les fichiers
   * statiques — les soumettre à un contrôle d'authentification ralentirait
   * chaque image sans rien protéger.
   */
  matcher: [
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
