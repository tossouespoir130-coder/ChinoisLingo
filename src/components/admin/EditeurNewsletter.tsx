'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Plus, RefreshCw, RotateCcw, Sparkles, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * Éditeur de la newsletter hebdomadaire (Admin → E-mails).
 *
 * Part de la proposition automatique de la semaine (nouveautés, ou rappel de
 * contenus existants), permet de modifier les contenus, le sujet et d'ajouter
 * un message personnel, affiche l'aperçu exact mis à jour à chaque
 * modification, puis envoie la version validée. Rien n'est envoyé avant le
 * clic sur « Valider et envoyer à tout le monde ».
 */

type Appeler = <T>(url: string, init?: RequestInit) => Promise<T>;

interface Contenu {
  id: string;
  rubrique: 'vocabulaire' | 'ecoute_lecture' | 'formation' | 'livres';
  sous_categorie?: string | null;
  titre: string;
  description?: string | null;
  lien: string;
  niveau_hsk?: string | null;
}

interface Brouillon {
  mode: 'nouveautes' | 'rappel';
  contenus: Contenu[];
  sujet: string;
  messagePersonnel: string;
}

interface ReponseProposition {
  mode: 'nouveautes' | 'rappel';
  contenus: Contenu[];
  suggestions: Contenu[];
  dernierEnvoi: string | null;
  sujet: string | null;
  html: string | null;
}

const RUBRIQUES: Record<Contenu['rubrique'], string> = {
  vocabulaire: 'Vocabulaire',
  ecoute_lecture: 'Écoute & Lecture',
  formation: 'Formations',
  livres: 'Livres',
};

const SOUS_CATEGORIES: Record<string, string> = {
  chansons: 'Chansons',
  articles: 'Articles',
  histoires: 'Histoires',
  dialogues: 'Dialogues',
  podcasts: 'Podcasts',
  videos: 'Vidéos',
  packs_hsk: 'Packs vocabulaire HSK',
  combinaison: 'Méthode de la Combinaison',
  masterclass: 'Masterclass',
  ouvrages: 'Guides & lexiques',
};

const CONTENU_VIDE: Contenu = { id: '', rubrique: 'ecoute_lecture', sous_categorie: 'dialogues', titre: '', description: '', lien: '', niveau_hsk: '' };

const champ =
  'w-full px-3 py-2 rounded-xl border border-[#E0E0E0] dark:border-[#2D2D2D] bg-white dark:bg-[#121212] text-[16px] sm:text-xs text-[#212121] dark:text-[#F5F5F5] outline-none focus:border-[#6200EE]';

export function EditeurNewsletter({ appeler, pret, onApresEnvoi }: { appeler: Appeler; pret: boolean; onApresEnvoi?: () => void }) {
  const [proposition, setProposition] = useState<ReponseProposition | null>(null);
  const [brouillon, setBrouillon] = useState<Brouillon | null>(null);
  const [modifie, setModifie] = useState(false);
  const [apercu, setApercu] = useState<{ sujet: string | null; html: string | null }>({ sujet: null, html: null });
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [ajoutLibre, setAjoutLibre] = useState<Contenu | null>(null);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [resultat, setResultat] = useState<{ succes: boolean; message: string } | null>(null);

  /** Recharge la proposition automatique de la semaine (abandonne les modifications). */
  const chargerProposition = useCallback(async () => {
    if (!pret) return;
    setChargement(true);
    setErreur(null);
    try {
      const p = await appeler<ReponseProposition>('/api/admin/emails/apercu-newsletter');
      setProposition(p);
      setBrouillon({ mode: p.mode, contenus: p.contenus, sujet: '', messagePersonnel: '' });
      setApercu({ sujet: p.sujet, html: p.html });
      setModifie(false);
    } catch (err) {
      setErreur((err as Error).message || 'Aperçu indisponible.');
    } finally {
      setChargement(false);
    }
  }, [appeler, pret]);

  // Chargement initial une seule fois : `appeler` change à chaque renouvellement
  // de session, ce qui ne doit pas effacer les modifications en cours.
  const dejaCharge = useRef(false);
  useEffect(() => {
    if (!pret || dejaCharge.current) return;
    dejaCharge.current = true;
    chargerProposition();
  }, [pret, chargerProposition]);

  // Aperçu recalculé (avec un court délai) après chaque modification.
  const signature = useMemo(() => JSON.stringify(brouillon), [brouillon]);
  useEffect(() => {
    if (!modifie || !brouillon || brouillon.contenus.length === 0) return;
    const minuterie = setTimeout(async () => {
      try {
        const r = await appeler<{ sujet: string; html: string }>('/api/admin/emails/apercu-newsletter', {
          method: 'POST',
          body: JSON.stringify({ brouillon }),
        });
        setApercu(r);
        setErreur(null);
      } catch (err) {
        setErreur((err as Error).message || 'Aperçu impossible.');
      }
    }, 600);
    return () => clearTimeout(minuterie);
    // `signature` résume le brouillon : inutile de dépendre de l'objet lui-même.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, modifie, appeler]);

  const modifier = (maj: (b: Brouillon) => Brouillon) => {
    setBrouillon((b) => (b ? maj(b) : b));
    setModifie(true);
    setResultat(null);
  };

  const modifierContenu = (index: number, champs: Partial<Contenu>) =>
    modifier((b) => ({ ...b, contenus: b.contenus.map((c, i) => (i === index ? { ...c, ...champs } : c)) }));

  const deplacer = (index: number, sens: -1 | 1) =>
    modifier((b) => {
      const liste = [...b.contenus];
      const cible = index + sens;
      if (cible < 0 || cible >= liste.length) return b;
      [liste[index], liste[cible]] = [liste[cible], liste[index]];
      return { ...b, contenus: liste };
    });

  const retirer = (index: number) => modifier((b) => ({ ...b, contenus: b.contenus.filter((_, i) => i !== index) }));

  const ajouter = (contenu: Contenu) =>
    modifier((b) => ({ ...b, contenus: [...b.contenus, { ...contenu, id: contenu.id || `ajout-${Date.now()}` }] }));

  const suggestionsDisponibles = (proposition?.suggestions ?? []).filter(
    (s) => !brouillon?.contenus.some((c) => c.lien === s.lien)
  );

  const envoyer = async () => {
    if (!brouillon || !htmlAffiche) return;
    if (!confirm('Vous avez vérifié l’aperçu ? Confirmez-vous l’envoi immédiat de cette newsletter à ABSOLUMENT TOUT LE MONDE (inscrits et administrateur) ?')) return;
    setEnvoiEnCours(true);
    setResultat(null);
    try {
      const res = await appeler<{ ok: boolean; totalEnvoyes: number; destinatairesTotal: number; nouveautesCount: number; erreur?: string }>(
        '/api/admin/emails/envoyer-newsletter-hebdo',
        { method: 'POST', body: JSON.stringify({ brouillon }) }
      );
      if (!res.ok) throw new Error(res.erreur || 'Erreur lors de l’envoi de la newsletter.');
      setResultat({
        succes: true,
        message: `Newsletter envoyée à ${res.totalEnvoyes}/${res.destinatairesTotal} destinataire(s) (${res.nouveautesCount} contenu(s)).`,
      });
      onApresEnvoi?.();
      chargerProposition();
    } catch (err) {
      setResultat({ succes: false, message: (err as Error).message || 'Erreur lors de l’envoi.' });
    } finally {
      setEnvoiEnCours(false);
    }
  };

  // Sans contenu, rien ne partirait : pas d'aperçu à valider.
  const htmlAffiche = brouillon && brouillon.contenus.length > 0 ? apercu.html : null;

  if (!brouillon) {
    return (
      <div className="text-xs text-[#757575] dark:text-[#A0A0A0] flex items-center gap-2">
        <RefreshCw className={`w-3.5 h-3.5 ${chargement ? 'animate-spin' : ''}`} />
        {erreur || 'Préparation de la newsletter de la semaine…'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bandeau d'état */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-extrabold uppercase tracking-wider text-[#6200EE] dark:text-[#BB86FC]">Mail de cette semaine</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${brouillon.mode === 'nouveautes' ? 'bg-[#00897B]/10 text-[#00897B] dark:text-[#03DAC5]' : 'bg-amber-500/15 text-amber-700 dark:text-amber-400'}`}>
              {brouillon.mode === 'nouveautes' ? 'Nouveautés' : 'Rappel de contenus (aucune nouveauté)'}
            </span>
            {modifie && <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC]">Modifié</span>}
          </div>
          <p className="text-[#757575] dark:text-[#A0A0A0]">
            Dernier envoi : <strong>{proposition?.dernierEnvoi ? new Date(proposition.dernierEnvoi).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' }) : '—'}</strong>
            {' '}· Sans action de votre part, la proposition automatique part le jeudi à 16 h 30 (UTC).
          </p>
        </div>
        <button
          type="button"
          onClick={chargerProposition}
          disabled={chargement}
          className="px-3.5 py-2 rounded-full border border-[#E0E0E0] dark:border-[#2D2D2D] text-xs font-bold text-[#212121] dark:text-[#F5F5F5] flex items-center gap-1.5 self-start cursor-pointer disabled:opacity-50"
          title="Abandonne vos modifications et recharge la proposition automatique"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${chargement ? 'animate-spin' : ''}`} />
          Revenir à la proposition automatique
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* ── Éditeur ── */}
        <div className="space-y-4">
          <label className="block space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#616161] dark:text-[#BDBDBD]">Sujet (facultatif)</span>
            <input
              className={champ}
              value={brouillon.sujet}
              maxLength={150}
              placeholder={proposition?.sujet || 'Sujet par défaut'}
              onChange={(e) => modifier((b) => ({ ...b, sujet: e.target.value }))}
            />
          </label>

          <label className="block space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#616161] dark:text-[#BDBDBD]">Message personnel (facultatif, sous l’introduction)</span>
            <textarea
              className={`${champ} min-h-[72px]`}
              value={brouillon.messagePersonnel}
              maxLength={1500}
              placeholder="Ex. : Cette semaine, concentre-toi sur les tons…"
              onChange={(e) => modifier((b) => ({ ...b, messagePersonnel: e.target.value }))}
            />
          </label>

          <div className="space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#616161] dark:text-[#BDBDBD]">
              Contenus ({brouillon.contenus.length})
            </span>
            {brouillon.contenus.map((c, i) => (
              <div key={c.id + i} className="p-3 rounded-2xl border border-[#E0E0E0] dark:border-[#2D2D2D] bg-[#FAFAFA] dark:bg-[#151515] space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-extrabold uppercase text-[#6200EE] dark:text-[#BB86FC]">
                    {RUBRIQUES[c.rubrique]}{c.sous_categorie ? ` · ${SOUS_CATEGORIES[c.sous_categorie] ?? c.sous_categorie}` : ''}
                  </span>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => deplacer(i, -1)} disabled={i === 0} className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 cursor-pointer" title="Monter"><ArrowUp className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => deplacer(i, 1)} disabled={i === brouillon.contenus.length - 1} className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 cursor-pointer" title="Descendre"><ArrowDown className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => retirer(i)} className="p-1.5 rounded-lg text-[#E53935] hover:bg-[#E53935]/10 cursor-pointer" title="Retirer"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <input className={champ} value={c.titre} maxLength={160} onChange={(e) => modifierContenu(i, { titre: e.target.value })} aria-label="Titre" />
                <textarea className={`${champ} min-h-[56px]`} value={c.description ?? ''} maxLength={400} onChange={(e) => modifierContenu(i, { description: e.target.value })} aria-label="Description" />
                <div className="flex items-center gap-2">
                  <input className={`${champ} max-w-[120px]`} value={c.niveau_hsk ?? ''} maxLength={20} placeholder="Niveau" onChange={(e) => modifierContenu(i, { niveau_hsk: e.target.value })} aria-label="Niveau" />
                  <span className="text-[10px] text-[#9E9E9E] truncate" title={c.lien}>{c.lien}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Ajout */}
          <div className="p-3 rounded-2xl border border-dashed border-[#6200EE]/40 space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#616161] dark:text-[#BDBDBD]">Ajouter un contenu</span>
            {suggestionsDisponibles.length > 0 && (
              <select
                className={champ}
                value=""
                onChange={(e) => {
                  const s = suggestionsDisponibles.find((x) => x.lien === e.target.value);
                  if (s) ajouter(s);
                }}
              >
                <option value="">Choisir un contenu existant…</option>
                {suggestionsDisponibles.map((s) => (
                  <option key={s.lien} value={s.lien}>{RUBRIQUES[s.rubrique]} — {s.titre}</option>
                ))}
              </select>
            )}
            {!ajoutLibre ? (
              <button type="button" onClick={() => setAjoutLibre({ ...CONTENU_VIDE })} className="text-xs font-bold text-[#6200EE] dark:text-[#BB86FC] flex items-center gap-1 cursor-pointer">
                <Plus className="w-3.5 h-3.5" /> Autre contenu (saisie libre)
              </button>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <select className={champ} value={ajoutLibre.rubrique} onChange={(e) => setAjoutLibre({ ...ajoutLibre, rubrique: e.target.value as Contenu['rubrique'] })}>
                    {Object.entries(RUBRIQUES).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                  <select className={champ} value={ajoutLibre.sous_categorie ?? ''} onChange={(e) => setAjoutLibre({ ...ajoutLibre, sous_categorie: e.target.value || null })}>
                    <option value="">(sans sous-catégorie)</option>
                    {Object.entries(SOUS_CATEGORIES).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <input className={champ} placeholder="Titre" value={ajoutLibre.titre} onChange={(e) => setAjoutLibre({ ...ajoutLibre, titre: e.target.value })} />
                <textarea className={`${champ} min-h-[56px]`} placeholder="Description" value={ajoutLibre.description ?? ''} onChange={(e) => setAjoutLibre({ ...ajoutLibre, description: e.target.value })} />
                <div className="grid grid-cols-3 gap-2">
                  <input className={champ} placeholder="Niveau (HSK 1)" value={ajoutLibre.niveau_hsk ?? ''} onChange={(e) => setAjoutLibre({ ...ajoutLibre, niveau_hsk: e.target.value })} />
                  <input className={`${champ} col-span-2`} placeholder="/ecoute-lecture?type=dialogues&id=…" value={ajoutLibre.lien} onChange={(e) => setAjoutLibre({ ...ajoutLibre, lien: e.target.value })} />
                </div>
                <p className="text-[10px] text-[#9E9E9E]">
                  Formats de lien : /ecoute-lecture?type=dialogues&amp;id=… · /formation?course=… · /vocabulaire?tab=themes. Un lien qui ne mène à aucune page réelle est refusé.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!ajoutLibre.titre.trim() || !ajoutLibre.lien.trim()}
                    onClick={() => { ajouter(ajoutLibre); setAjoutLibre(null); }}
                    className="px-3.5 py-1.5 rounded-full bg-[#6200EE] text-white text-xs font-bold disabled:opacity-40 cursor-pointer"
                  >
                    Ajouter
                  </button>
                  <button type="button" onClick={() => setAjoutLibre(null)} className="text-xs font-bold text-[#757575] cursor-pointer">Annuler</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Aperçu exact ── */}
        <div className="space-y-2">
          <div className="text-xs">
            <span className="text-[#757575] dark:text-[#A0A0A0]">Sujet : </span>
            <strong className="text-[#212121] dark:text-[#F5F5F5]">{apercu.sujet ?? '—'}</strong>
          </div>
          {erreur && (
            <p className="text-xs font-bold text-[#E53935] flex items-start gap-1.5"><AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />{erreur}</p>
          )}
          {htmlAffiche ? (
            <iframe
              title="Aperçu de la newsletter"
              srcDoc={htmlAffiche}
              sandbox=""
              className="w-full h-[760px] rounded-xl border border-[#E0E0E0] dark:border-[#2D2D2D] bg-white"
            />
          ) : (
            <p className="text-xs font-bold text-[#E53935]">Aucun contenu : rien ne serait envoyé.</p>
          )}
        </div>
      </div>

      {/* Validation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-3 pt-2 border-t border-[#E0E0E0]/60 dark:border-[#2D2D2D]">
        {resultat && (
          <p className={`text-xs font-bold flex items-center gap-1.5 mr-auto ${resultat.succes ? 'text-[#00796B] dark:text-[#03DAC5]' : 'text-[#E53935]'}`}>
            {resultat.succes ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {resultat.message}
          </p>
        )}
        <button
          type="button"
          onClick={envoyer}
          disabled={envoiEnCours || !htmlAffiche || !!erreur}
          className="px-5 py-3 rounded-full bg-gradient-to-r from-[#6200EE] to-[#00897B] hover:opacity-95 text-white font-extrabold text-xs shadow-md shadow-[#6200EE]/25 transition-all btn-press flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{envoiEnCours ? 'Diffusion en cours…' : 'Valider et envoyer à tout le monde'}</span>
        </button>
      </div>
    </div>
  );
}
