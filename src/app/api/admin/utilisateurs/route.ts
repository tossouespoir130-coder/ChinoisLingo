import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { exigerAdmin } from '@/lib/admin/garde';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PAR_PAGE = 25;

/**
 * GET /api/admin/utilisateurs?page=1&recherche=...&validation=...
 * Liste paginée des utilisateurs avec statut de validation et abonnement.
 */
export async function GET(requete: Request) {
  const garde = await exigerAdmin(requete);
  if (!garde.ok) {
    return NextResponse.json({ erreur: garde.erreur }, { status: garde.statut });
  }

  const params = new URL(requete.url).searchParams;
  const page = Math.max(1, parseInt(params.get('page') ?? '1', 10) || 1);
  const recherche = (params.get('recherche') ?? '').trim();
  const filtreProfil = (params.get('profil') ?? '').trim();
  const filtreObjectif = (params.get('objectif') ?? '').trim();
  const filtreNiveau = (params.get('niveau') ?? '').trim();
  const filtreStatut = (params.get('statut') ?? '').trim();
  const filtreValidation = (params.get('validation') ?? '').trim();

  const admin = createAdminClient();
  const maintenant = new Date();

  let requeteSql = admin
    .from('profiles')
    .select(
      'id, full_name, username, email, created_at, last_sign_in_at, last_active_date, streak_days, total_login_days, current_period_end, subscription_plan, role, onboarding_profil, onboarding_objectif, onboarding_niveau, onboarding_rappels',
      { count: 'exact' }
    )
    .order('role', { ascending: true, nullsFirst: false })
    .order('total_login_days', { ascending: false, nullsFirst: false })
    .order('streak_days', { ascending: false, nullsFirst: false })
    .order('last_sign_in_at', { ascending: false, nullsFirst: false })
    .range((page - 1) * PAR_PAGE, page * PAR_PAGE - 1);

  if (recherche) {
    const motif = recherche.replace(/[,()]/g, ' ');
    requeteSql = requeteSql.or(
      `full_name.ilike.%${motif}%,email.ilike.%${motif}%,username.ilike.%${motif}%,onboarding_profil.ilike.%${motif}%,onboarding_objectif.ilike.%${motif}%,onboarding_niveau.ilike.%${motif}%`
    );
  }

  if (filtreProfil) {
    requeteSql = requeteSql.ilike('onboarding_profil', `%${filtreProfil}%`);
  }

  if (filtreObjectif) {
    requeteSql = requeteSql.ilike('onboarding_objectif', `%${filtreObjectif}%`);
  }

  if (filtreNiveau) {
    requeteSql = requeteSql.ilike('onboarding_niveau', `%${filtreNiveau}%`);
  }

  if (filtreStatut === 'premium') {
    requeteSql = requeteSql.gt('current_period_end', maintenant.toISOString());
  } else if (filtreStatut === 'gratuit') {
    requeteSql = requeteSql.or(`current_period_end.is.null,current_period_end.lte.${maintenant.toISOString()}`);
  }

  const { data, count, error } = await requeteSql;

  if (error) {
    console.error('[admin] liste des utilisateurs', error);
    return NextResponse.json({ erreur: 'Lecture impossible.' }, { status: 500 });
  }

  const maintenantMs = maintenant.getTime();

  // Récupération en parallèle du statut de confirmation email et dernière connexion dans Supabase Auth
  const authStatusMap = new Map<
    string,
    { emailConfirmed: boolean; emailConfirmedAt: string | null; lastSignInAt: string | null }
  >();

  await Promise.all(
    (data ?? []).map(async (u) => {
      try {
        const { data: authUser, error: authError } = await admin.auth.admin.getUserById(u.id);
        if (!authError && authUser?.user) {
          const isConfirmed = Boolean(authUser.user.email_confirmed_at || authUser.user.confirmed_at);
          authStatusMap.set(u.id, {
            emailConfirmed: isConfirmed,
            emailConfirmedAt: authUser.user.email_confirmed_at || authUser.user.confirmed_at || null,
            lastSignInAt: authUser.user.last_sign_in_at || null,
          });
        }
      } catch (err) {
        console.error('[admin] error checking auth user status for', u.id, err);
      }
    })
  );

  let utilisateurs = (data ?? []).map((u) => {
    const joursActifs = Math.max(u.total_login_days || 0, u.streak_days || 0, 1);
    const authStatus = authStatusMap.get(u.id);
    const authLastSignIn = authStatus?.lastSignInAt;

    // Déterminer la date/heure de dernière connexion la plus précise et récente
    let derniereConnexion = authLastSignIn || u.last_sign_in_at || u.last_active_date || u.created_at;
    if (authLastSignIn && u.last_sign_in_at) {
      derniereConnexion =
        new Date(authLastSignIn).getTime() > new Date(u.last_sign_in_at).getTime()
          ? authLastSignIn
          : u.last_sign_in_at;
    }

    return {
      id: u.id,
      nom: u.full_name || u.username || '—',
      email: u.email ?? '—',
      inscritLe: u.created_at,
      derniereConnexion,
      joursConnexion: joursActifs,
      role: u.role || 'user',
      // Validation du compte / email
      emailConfirme: authStatus?.emailConfirmed ?? false,
      emailConfirmeLe: authStatus?.emailConfirmedAt ?? null,
      // Onboarding data
      profil: u.onboarding_profil || null,
      objectif: u.onboarding_objectif || null,
      niveau: u.onboarding_niveau || null,
      rappels: u.onboarding_rappels ?? true,
      // Statut d'abonnement
      premium: u.current_period_end
        ? new Date(u.current_period_end).getTime() > maintenantMs
        : false,
      plan: u.subscription_plan,
      finPeriode: u.current_period_end,
    };
  });

  // Filtre éventuel sur le statut de validation email
  if (filtreValidation === 'valide') {
    utilisateurs = utilisateurs.filter((u) => u.emailConfirme);
  } else if (filtreValidation === 'en_attente') {
    utilisateurs = utilisateurs.filter((u) => !u.emailConfirme);
  }

  // Tri strict :
  // 1. Tous les administrateurs (role === 'admin') TOUJOURS en premier (en haut)
  // 2. Entre administrateurs : du plus grand nombre de jours actifs au plus petit (décroissant)
  // 3. Pour tous les autres utilisateurs : du plus grand nombre de jours actifs au plus petit (décroissant)
  utilisateurs.sort((a, b) => {
    const aIsAdmin = a.role === 'admin';
    const bIsAdmin = b.role === 'admin';

    if (aIsAdmin && !bIsAdmin) return -1;
    if (!aIsAdmin && bIsAdmin) return 1;

    // Même rang : ordre décroissant des jours actifs
    if (b.joursConnexion !== a.joursConnexion) {
      return b.joursConnexion - a.joursConnexion;
    }

    // En cas d'égalité : dernière connexion la plus récente en premier
    const timeA = a.derniereConnexion ? new Date(a.derniereConnexion).getTime() : 0;
    const timeB = b.derniereConnexion ? new Date(b.derniereConnexion).getTime() : 0;
    return timeB - timeA;
  });

  return NextResponse.json({
    utilisateurs,
    total: count ?? 0,
    page,
    parPage: PAR_PAGE,
    pages: Math.max(1, Math.ceil((count ?? 0) / PAR_PAGE)),
  });
}

/**
 * POST /api/admin/utilisateurs
 * Corps : { userId: string, action: 'valider_email' }
 * Permet à l'administrateur de confirmer manuellement l'e-mail / le compte d'un utilisateur.
 */
export async function POST(requete: Request) {
  const garde = await exigerAdmin(requete);
  if (!garde.ok) {
    return NextResponse.json({ erreur: garde.erreur }, { status: garde.statut });
  }

  let corps: { userId?: string; action?: string };
  try {
    corps = await requete.json();
  } catch {
    return NextResponse.json({ erreur: 'Requête JSON invalide.' }, { status: 400 });
  }

  const { userId, action } = corps;

  if (!userId) {
    return NextResponse.json({ erreur: 'Identifiant utilisateur requis.' }, { status: 400 });
  }

  if (action === 'valider_email' || action === 'confirmer_compte') {
    const admin = createAdminClient();

    try {
      const { data, error } = await admin.auth.admin.updateUserById(userId, {
        email_confirm: true,
      });

      if (error) {
        console.error('[admin] échec validation manuelle email', error);
        return NextResponse.json({ erreur: `Impossible de valider le compte : ${error.message}` }, { status: 500 });
      }

      return NextResponse.json({
        succes: true,
        message: 'Le compte a été validé avec succès.',
        user: {
          id: data.user.id,
          email: data.user.email,
          email_confirmed_at: data.user.email_confirmed_at,
        },
      });
    } catch (err) {
      console.error('[admin] exception validation manuelle email', err);
      return NextResponse.json({ erreur: 'Erreur inattendue lors de la validation du compte.' }, { status: 500 });
    }
  }

  return NextResponse.json({ erreur: 'Action non reconnue.' }, { status: 400 });
}
