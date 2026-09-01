'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Megaphone,
  ScrollText,
  ArrowLeft,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { Logo } from '@/components/ui/Logo';

/**
 * Habillage de l'espace d'administration.
 *
 * Volontairement HORS du groupe de routes `(app)` : pas de TopNav, pas de
 * MobileTabBar, pas de carte conteneur arrondie. L'administrateur doit voir
 * au premier coup d'œil qu'il a changé d'univers.
 *
 * Structure : une bande sombre PLEINE HAUTEUR à gauche, qui porte l'identité
 * de marque en haut, et une zone de contenu sans barre supérieure. Le retour
 * vers l'application est un bouton flottant en bas à droite, présent sur les
 * quatre pages.
 *
 * Le contrôle du rôle est fait côté serveur par `src/proxy.ts` avant même que
 * ce composant ne soit rendu — il n'y a donc pas de garde ici.
 */

const LIENS = [
  { href: '/admin', libelle: "Vue d'ensemble", icone: LayoutDashboard },
  { href: '/admin/utilisateurs', libelle: 'Utilisateurs', icone: Users },
  { href: '/admin/message-fondateur', libelle: 'Message du Fondateur', icone: Megaphone },
  { href: '/admin/historique', libelle: 'Historique des actions', icone: ScrollText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile, user } = useAuth();
  const [menuOuvert, setMenuOuvert] = useState(false);

  /**
   * Identité de marque, en tête de la bande sombre.
   *
   * Le logo est posé sans aucun fond : c'est la version transparente. Sa
   * lisibilité ne repose pas sur le violet — dont le contraste est faible sur
   * fond sombre — mais sur le turquoise du tracé et sur le libellé en blanc
   * juste à côté.
   */
  const marque = (
    <div className="flex items-center gap-2.5 pb-5 border-b border-[#6200EE]/20">
      <Logo variant="icon" size="md" href="/admin" />
      <div className="min-w-0">
        <p className="text-white font-display font-black text-sm leading-none truncate">
          ChinoisLingo
        </p>
        <p className="text-[10px] uppercase font-extrabold tracking-[0.14em] text-[#03DAC5] mt-1.5">
          Administration
        </p>
      </div>
    </div>
  );

  const navigation = (
    <nav className="space-y-1">
      {LIENS.map(({ href, libelle, icone: Icone }) => {
        // `/admin` est un préfixe de toutes les autres routes : on l'exclut
        // du test de préfixe pour qu'il ne reste pas actif en permanence.
        const actif = href === '/admin' ? pathname === '/admin' : pathname?.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            onClick={() => setMenuOuvert(false)}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[13px] font-semibold btn-press transition-colors ${
              actif
                ? 'bg-[#6200EE] text-white shadow-lg shadow-[#6200EE]/40'
                : 'text-[#A79FB5] hover:bg-[#6200EE]/15 hover:text-white'
            }`}
          >
            <Icone className="w-4 h-4 shrink-0" />
            <span className="truncate">{libelle}</span>
          </Link>
        );
      })}
    </nav>
  );

  /** Bloc identité du compte, en pied de la bande sombre. */
  const blocConnecte = (
    <div className="px-3 py-2.5 rounded-2xl bg-[#6200EE]/12 border border-[#6200EE]/25">
      <p className="text-[10px] uppercase font-extrabold tracking-wider text-[#03DAC5]">
        Connecté
      </p>
      <p className="text-[11px] text-white/90 font-semibold truncate mt-0.5">
        {profile?.full_name || profile?.email || user?.email || '—'}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#121212] flex">
      {/* ── Bande sombre pleine hauteur, du haut de la page jusqu'en bas ── */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-[#17131F] border-r border-[#6200EE]/20 flex-col justify-between p-5">
        <div>
          {marque}
          <div className="mt-5">{navigation}</div>
        </div>
        {blocConnecte}
      </aside>

      {/* ── Volet mobile ───────────────────────────────────────────────── */}
      {menuOuvert && (
        <div className="lg:hidden fixed inset-0 z-[9999] flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMenuOuvert(false)}
          />
          <aside className="relative w-64 bg-[#17131F] p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">{marque}</div>
                <button
                  type="button"
                  onClick={() => setMenuOuvert(false)}
                  aria-label="Fermer le menu"
                  className="w-7 h-7 rounded-lg text-[#A79FB5] hover:text-white flex items-center justify-center shrink-0 btn-press"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-5">{navigation}</div>
            </div>
            {blocConnecte}
          </aside>
        </div>
      )}

      {/* ── Contenu, sans barre supérieure ─────────────────────────────── */}
      {/* pb : réserve la place du bouton flottant pour qu'il ne masque
          jamais la dernière ligne d'un tableau. */}
      <main className="flex-1 min-w-0 p-5 sm:p-8 pt-16 lg:pt-8 pb-24 max-w-6xl w-full">
        {children}
      </main>

      {/* ── Ouverture du menu sur mobile ───────────────────────────────── */}
      {/* Sans barre supérieure, ce bouton flottant est le seul accès à la
          navigation quand la bande latérale est masquée. */}
      <button
        type="button"
        onClick={() => setMenuOuvert(true)}
        aria-label="Ouvrir le menu"
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-2xl bg-[#17131F] text-white flex items-center justify-center shadow-lg shadow-black/20 btn-press"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* ── Retour vers l'application, épinglé en bas à droite ─────────── */}
      <Link
        href="/tableau-de-bord"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#6200EE]/10 dark:bg-[#6200EE]/20 border border-[#6200EE]/25 dark:border-[#6200EE]/40 backdrop-blur-md text-xs font-bold text-[#6200EE] dark:text-[#BB86FC] shadow-lg shadow-[#6200EE]/15 hover:bg-[#6200EE] hover:text-white hover:border-[#6200EE] transition-all btn-press"
      >
        <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
        <span className="hidden sm:inline">Retour à l&apos;application</span>
        <span className="sm:hidden">Retour</span>
      </Link>
    </div>
  );
}
