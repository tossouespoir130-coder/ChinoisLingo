'use client';

import React from 'react';
import { 
  X, User, Mail, Calendar, Flame, Crown, Shield, 
  Briefcase, Target, Signal, Bell, Building2, 
  GraduationCap, Laptop, Telescope, TrendingUp, 
  Palmtree, Plane, Heart, Sparkles, CheckCircle2,
  CalendarPlus, Ban, Copy, Check, HardHat
} from 'lucide-react';
import { Portal } from '@/components/ui/Portal';
import { formaterDate, formaterDateHeure } from '@/lib/admin/useApiAdmin';

export interface DetailUtilisateur {
  id: string;
  nom: string;
  email: string;
  inscritLe: string | null;
  derniereConnexion: string | null;
  joursConnexion: number;
  role: string;
  profil: string | null;
  objectif: string | null;
  niveau: string | null;
  rappels: boolean | null;
  premium: boolean;
  plan: string | null;
  finPeriode: string | null;
}

interface ModaleDetailUtilisateurProps {
  utilisateur: DetailUtilisateur;
  onFermer: () => void;
  onProlonger?: () => void;
  onAnnuler?: () => void;
}

const ICONES_PROFILS: Record<string, any> = {
  'Entrepreneur': Building2,
  'Cadre d’entreprise': Briefcase,
  'Cadre d\'entreprise': Briefcase,
  'Cadre': Briefcase,
  'Professionnel': Briefcase,
  'Professionnel(le) salarié(e)': Briefcase,
  'Étudiant': GraduationCap,
  'Étudiant(e)': GraduationCap,
  'Ingénieur / Technicien': HardHat,
  'Ingénieur': HardHat,
  'Indépendant': Laptop,
  'Indépendant / Freelance': Laptop,
  'Autre': Telescope,
};

const ICONES_OBJECTIFS: Record<string, any> = {
  'Pour le travail & les affaires': TrendingUp,
  'Pour le travail': TrendingUp,
  'Pour voyager en Chine': Palmtree,
  'Voyager': Palmtree,
  'Étudier à l’étranger': Plane,
  'Pour mes études & examens HSK': Plane,
  'Intérêt personnel & culture': Heart,
  'Par passion pour la culture chinoise': Heart,
  'Autre': Sparkles,
};

export function ModaleDetailUtilisateur({
  utilisateur,
  onFermer,
  onProlonger,
  onAnnuler,
}: ModaleDetailUtilisateurProps) {
  const [copie, setCopie] = React.useState(false);

  const copierId = () => {
    navigator.clipboard.writeText(utilisateur.id);
    setCopie(true);
    setTimeout(() => setCopie(false), 2000);
  };

  const estAdmin = utilisateur.role === 'admin';
  const IconeProfil = utilisateur.profil ? ICONES_PROFILS[utilisateur.profil] || Briefcase : Briefcase;
  const IconeObjectif = utilisateur.objectif ? ICONES_OBJECTIFS[utilisateur.objectif] || Target : Target;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
        onClick={onFermer}
      >
        <div
          className="relative w-full max-w-lg bg-white dark:bg-[#1E1E1E] rounded-3xl border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-2xl overflow-hidden my-auto animate-scale-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[#E0E0E0] dark:border-[#2D2D2D] bg-[#FAFAFA] dark:bg-[#181818]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] flex items-center justify-center font-bold text-lg shadow-2xs">
                {utilisateur.nom ? utilisateur.nom.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-[#212121] dark:text-[#F5F5F5]">
                    {utilisateur.nom}
                  </h2>
                  {estAdmin && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#6200EE] text-white text-[10px] font-black tracking-wide shadow-xs">
                      <Shield className="w-2.5 h-2.5 fill-white" />
                      ADMIN
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#757575] dark:text-[#A0A0A0] flex items-center gap-1 mt-0.5">
                  <Mail className="w-3 h-3" />
                  {utilisateur.email}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onFermer}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#757575] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Section 1 : Informations d'Inscription & Onboarding */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#6200EE] dark:text-[#BB86FC]">
                📋 Informations d&apos;inscription & Onboarding
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Métier / Profil */}
                <div className="p-3.5 rounded-2xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0]/60 dark:border-[#333] space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#757575] dark:text-[#A0A0A0]">
                    <IconeProfil className="w-3.5 h-3.5 text-[#6200EE] dark:text-[#BB86FC]" />
                    <span>Profil & Métier</span>
                  </div>
                  <p className="text-sm font-bold text-[#212121] dark:text-[#F5F5F5]">
                    {utilisateur.profil || 'Non renseigné'}
                  </p>
                </div>

                {/* Objectif d'apprentissage */}
                <div className="p-3.5 rounded-2xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0]/60 dark:border-[#333] space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#757575] dark:text-[#A0A0A0]">
                    <IconeObjectif className="w-3.5 h-3.5 text-[#00796B] dark:text-[#03DAC5]" />
                    <span>Pourquoi il apprend</span>
                  </div>
                  <p className="text-sm font-bold text-[#00796B] dark:text-[#03DAC5]">
                    {utilisateur.objectif || 'Non renseigné'}
                  </p>
                </div>

                {/* Niveau de départ */}
                <div className="p-3.5 rounded-2xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0]/60 dark:border-[#333] space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#757575] dark:text-[#A0A0A0]">
                    <Signal className="w-3.5 h-3.5 text-[#FFA000]" />
                    <span>Niveau de départ</span>
                  </div>
                  <p className="text-sm font-bold text-[#E65100] dark:text-[#FFB74D]">
                    {utilisateur.niveau || 'Débutant'}
                  </p>
                </div>

                {/* Rappels d'apprentissage */}
                <div className="p-3.5 rounded-2xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0]/60 dark:border-[#333] space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#757575] dark:text-[#A0A0A0]">
                    <Bell className="w-3.5 h-3.5 text-[#0288D1]" />
                    <span>Rappels & Alertes</span>
                  </div>
                  <p className="text-sm font-bold text-[#212121] dark:text-[#F5F5F5]">
                    {utilisateur.rappels !== false ? '🔔 Rappels activés' : '🔕 Sans rappels'}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2 : Activité & Assiduité */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#757575] dark:text-[#A0A0A0]">
                ⚡ Activité & Présence
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0]/60 dark:border-[#333]">
                  <span className="text-[#757575] dark:text-[#A0A0A0] block">Date d&apos;inscription</span>
                  <span className="font-bold text-[#212121] dark:text-[#F5F5F5] mt-1 block">
                    {formaterDate(utilisateur.inscritLe)}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0]/60 dark:border-[#333]">
                  <span className="text-[#757575] dark:text-[#A0A0A0] block">Dernière connexion</span>
                  <span className="font-bold text-[#212121] dark:text-[#F5F5F5] mt-1 block">
                    {formaterDateHeure(utilisateur.derniereConnexion)}
                  </span>
                </div>

                <div className="col-span-2 p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0]/60 dark:border-[#333] flex items-center justify-between">
                  <span className="text-[#757575] dark:text-[#A0A0A0]">Jours actifs enregistrés</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-[#FF6D00]/12 text-[#E65100] dark:text-[#FF9E80]">
                    🔥 {utilisateur.joursConnexion || 1} {utilisateur.joursConnexion > 1 ? 'jours' : 'jour'}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 3 : Statut d'Abonnement */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#757575] dark:text-[#A0A0A0]">
                💎 Abonnement & Accès
              </h3>

              <div className="p-4 rounded-2xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0]/60 dark:border-[#333] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-black ${
                        utilisateur.premium
                          ? 'bg-[#1B5E20]/12 text-[#1B5E20] dark:text-[#66BB6A]'
                          : 'bg-[#757575]/12 text-[#757575] dark:text-[#A0A0A0]'
                      }`}
                    >
                      {utilisateur.premium ? 'Abonné Premium' : 'Compte Gratuit'}
                    </span>
                    {utilisateur.plan && (
                      <span className="text-xs text-[#757575] dark:text-[#A0A0A0] font-medium">
                        ({utilisateur.plan})
                      </span>
                    )}
                  </div>
                  {utilisateur.finPeriode && (
                    <p className="text-[11px] text-[#757575] dark:text-[#A0A0A0] mt-1">
                      Fin de période : {formaterDate(utilisateur.finPeriode)}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {onProlonger && (
                    <button
                      type="button"
                      onClick={onProlonger}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] text-xs font-bold hover:bg-[#6200EE]/18 transition-all btn-press"
                    >
                      <CalendarPlus className="w-3.5 h-3.5" />
                      Prolonger
                    </button>
                  )}
                  {onAnnuler && utilisateur.premium && (
                    <button
                      type="button"
                      onClick={onAnnuler}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#DD2C00]/10 text-[#DD2C00] text-xs font-bold hover:bg-[#DD2C00]/18 transition-all btn-press"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      Annuler
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ID Supabase discret */}
            <div className="pt-2 flex items-center justify-between text-[11px] text-[#757575] dark:text-[#A0A0A0]">
              <span className="truncate max-w-[280px]">ID: {utilisateur.id}</span>
              <button
                type="button"
                onClick={copierId}
                className="inline-flex items-center gap-1 text-[11px] text-[#6200EE] dark:text-[#BB86FC] hover:underline"
              >
                {copie ? <Check className="w-3 h-3 text-[#1B5E20]" /> : <Copy className="w-3 h-3" />}
                {copie ? 'Copié' : 'Copier ID'}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#E0E0E0] dark:border-[#2D2D2D] bg-[#FAFAFA] dark:bg-[#181818] flex justify-end">
            <button
              type="button"
              onClick={onFermer}
              className="px-5 py-2 rounded-xl bg-[#212121] dark:bg-[#333] text-white text-xs font-bold hover:opacity-90 transition-all btn-press cursor-pointer"
            >
              Fermer la fiche
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
