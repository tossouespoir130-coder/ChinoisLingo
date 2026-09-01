'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { Devise, PlanId } from './plans';
import { EtatAbonnement, lireEtatAbonnement } from './subscription';

/**
 * État d'abonnement de l'apprenant connecté, et déclenchement du paiement.
 *
 * L'état est dérivé du profil déjà porté par `AuthContext` : aucun appel réseau
 * supplémentaire n'est nécessaire pour savoir si l'accès est ouvert.
 */
export function useAbonnement() {
  const { profile, session, isLoading, refreshProfile } = useAuth();
  const [enCours, setEnCours] = useState<PlanId | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  /**
   * Rôle confirmé par le serveur.
   *
   * `profile.role` est déjà fiable — un déclencheur SQL interdit à un
   * utilisateur de modifier son propre rôle — mais on le fait revalider par
   * `/api/moi/acces`, qui relit la base avec la clé service_role après avoir
   * vérifié le jeton. C'est cette réponse qui fait autorité.
   */
  const [roleServeur, setRoleServeur] = useState<string | null>(null);

  useEffect(() => {
    const jeton = session?.access_token;
    // Pas de remise à zéro synchrone ici : elle provoquerait un rendu en
    // cascade, et elle est inutile — à la déconnexion `profile` devient null,
    // et `lireEtatAbonnement(null, …)` retourne l'état gratuit quel que soit
    // le rôle mémorisé.
    if (!jeton) return;

    let annule = false;

    fetch('/api/moi/acces', { headers: { Authorization: `Bearer ${jeton}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!annule && d?.role) setRoleServeur(d.role as string);
      })
      // Réseau indisponible : on retombe sur le rôle porté par le profil,
      // qui vient lui aussi de Supabase. Aucun accès n'est accordé à tort.
      .catch(() => {});

    return () => {
      annule = true;
    };
  }, [session]);

  const etat: EtatAbonnement = useMemo(
    () => lireEtatAbonnement(profile, new Date(), roleServeur),
    [profile, roleServeur]
  );

  /**
   * `true` tant qu'on ne peut pas encore trancher : session en cours de
   * chargement, ou profil pas encore revenu. Les composants de blocage doivent
   * patienter, faute de quoi le mur d'abonnement clignote à chaque rechargement
   * pour un abonné parfaitement en règle.
   */
  const indetermine = isLoading || (session !== null && profile === null);

  /** Ouvre la page de paiement hébergée du fournisseur correspondant à la devise. */
  const demarrerPaiement = useCallback(
    async (plan: PlanId, devise: Devise) => {
      if (!session?.access_token) {
        setErreur('Votre session a expiré. Reconnectez-vous pour continuer.');
        return;
      }

      setEnCours(plan);
      setErreur(null);

      try {
        const reponse = await fetch('/api/paiement/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ plan, devise }),
        });

        const donnees = await reponse.json();

        if (!reponse.ok || !donnees.url) {
          setErreur(donnees.erreur ?? 'Le paiement n\'a pas pu être lancé.');
          setEnCours(null);
          return;
        }

        window.location.href = donnees.url;
      } catch {
        setErreur('Connexion au service de paiement impossible. Réessayez.');
        setEnCours(null);
      }
    },
    [session]
  );

  /** Espace de facturation Stripe (carte, factures, résiliation). */
  const ouvrirPortail = useCallback(async () => {
    if (!session?.access_token) {
      setErreur('Votre session a expiré. Reconnectez-vous pour continuer.');
      return;
    }

    setErreur(null);

    try {
      const reponse = await fetch('/api/paiement/portail', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const donnees = await reponse.json();

      if (!reponse.ok || !donnees.url) {
        setErreur(donnees.erreur ?? 'Espace de facturation indisponible.');
        return;
      }

      window.location.href = donnees.url;
    } catch {
      setErreur('Connexion à l\'espace de facturation impossible.');
    }
  }, [session]);

  return {
    etat,
    indetermine,
    estConnecte: session !== null,
    enCours,
    erreur,
    effacerErreur: () => setErreur(null),
    demarrerPaiement,
    ouvrirPortail,
    rafraichir: refreshProfile,
  };
}
