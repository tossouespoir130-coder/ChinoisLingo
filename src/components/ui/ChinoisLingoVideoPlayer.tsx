'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Maximize, Minimize } from 'lucide-react';

/**
 * Les variantes préfixées du plein écran (Safari, anciens Firefox/IE) ne
 * figurent pas dans les types du DOM. On les déclare plutôt que de recourir
 * à `any`, pour garder le fichier vérifiable par le compilateur.
 */
interface DocumentPleinEcran extends Document {
  webkitFullscreenElement?: Element | null;
  mozFullScreenElement?: Element | null;
  msFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => void;
}

interface ElementPleinEcran extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void> | void;
  mozRequestFullScreen?: () => Promise<void> | void;
  msRequestFullscreen?: () => Promise<void> | void;
}

interface ChinoisLingoVideoPlayerProps {
  youtubeId: string;
  title: string;
  thumbnailUrl?: string;
  className?: string;
  onEnded?: () => void;
}

/**
 * Lecteur vidéo ChinoisLingo.
 *
 * L'apprenant doit rester dans la plateforme : aucun élément d'interface
 * YouTube ne doit être atteignable, faute de quoi il peut ouvrir la vidéo sur
 * YouTube et en copier le lien pour le partager hors de l'application.
 *
 * Trois barrières se cumulent :
 *   1. `controls=0` — YouTube ne dessine plus sa barre de commandes, donc ni
 *      logo, ni bouton de partage, ni « Regarder sur YouTube ». C'est la
 *      barrière principale : ce qui n'est pas dessiné n'est pas cliquable.
 *   2. Un voile transparent couvre toute la surface de l'iframe et intercepte
 *      chaque clic. Même si YouTube réaffichait un filigrane au survol, il
 *      resterait hors d'atteinte.
 *   3. Le clic droit est neutralisé sur le conteneur.
 *
 * L'ancienne approche — agrandir l'iframe pour pousser l'habillage hors du
 * cadre — a été abandonnée : elle laissait passer la barre du bas selon le
 * format, et surtout elle rognait les sous-titres incrustés dans l'image.
 *
 * Les commandes (lecture, pause, position, plein écran) sont donc les nôtres.
 * Elles pilotent la vidéo par `postMessage`, via `enablejsapi=1`.
 */
export function ChinoisLingoVideoPlayer({
  youtubeId,
  title,
  thumbnailUrl,
  className = '',
  onEnded,
}: ChinoisLingoVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [hasStarted, setHasStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [enLecture, setEnLecture] = useState(true);
  const [position, setPosition] = useState(0);
  const [duree, setDuree] = useState(0);

  // ── Pilotage de la vidéo ────────────────────────────────────────────
  const commander = useCallback((func: string, args: unknown[] = []) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func, args }),
      '*'
    );
  }, []);

  /**
   * Écoute des messages du lecteur.
   *
   * YouTube n'émet qu'après avoir reçu un message `listening` : on le lui
   * envoie régulièrement tant que la durée est inconnue. Si rien n'arrive,
   * la barre de progression reste simplement masquée — la lecture, elle,
   * fonctionne dans tous les cas.
   */
  useEffect(() => {
    if (!hasStarted) return;

    const surMessage = (e: MessageEvent) => {
      if (typeof e.data !== 'string') return;
      if (!e.origin.includes('youtube')) return;

      try {
        const donnees = JSON.parse(e.data);
        const info = donnees?.info;
        if (!info) return;

        if (typeof info.duration === 'number' && info.duration > 0) setDuree(info.duration);
        if (typeof info.currentTime === 'number') setPosition(info.currentTime);
        if (typeof info.playerState === 'number') {
          setEnLecture(info.playerState === 1);
          // 0 = terminé
          if (info.playerState === 0) onEnded?.();
        }
      } catch {
        // Message non JSON : sans conséquence, on l'ignore.
      }
    };

    window.addEventListener('message', surMessage);

    const abonner = () => {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'listening' }),
        '*'
      );
    };
    abonner();
    const battement = setInterval(abonner, 1000);

    return () => {
      window.removeEventListener('message', surMessage);
      clearInterval(battement);
    };
  }, [hasStarted, onEnded]);

  // ── Plein écran ─────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  const exitFullscreenMode = useCallback(() => {
    setIsFullscreen(false);
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';

    const doc = document as DocumentPleinEcran;
    if (doc.fullscreenElement || doc.webkitFullscreenElement) {
      try {
        if (doc.exitFullscreen) doc.exitFullscreen().catch(() => {});
        else doc.webkitExitFullscreen?.();
      } catch {}
    }
  }, []);

  useEffect(() => {
    const surTouche = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) exitFullscreenMode();
    };

    const surChangementNatif = () => {
      const doc = document as DocumentPleinEcran;
      const plein = !!(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );
      if (!plein && isFullscreen) {
        setIsFullscreen(false);
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }
    };

    document.addEventListener('keydown', surTouche);
    document.addEventListener('fullscreenchange', surChangementNatif);
    document.addEventListener('webkitfullscreenchange', surChangementNatif);

    return () => {
      document.removeEventListener('keydown', surTouche);
      document.removeEventListener('fullscreenchange', surChangementNatif);
      document.removeEventListener('webkitfullscreenchange', surChangementNatif);
    };
  }, [isFullscreen, exitFullscreenMode]);

  const enterFullscreenMode = () => {
    const el = containerRef.current as ElementPleinEcran | null;
    if (!el) return;

    setIsFullscreen(true);
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const demander =
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.mozRequestFullScreen ||
      el.msRequestFullscreen;

    // Repli iOS : `requestFullscreen` n'existe pas sur iPhone, l'affichage
    // plein écran repose alors uniquement sur le positionnement CSS fixe.
    if (demander) {
      try {
        Promise.resolve(demander.call(el)).catch(() => {});
      } catch {}
    }
  };

  const toggleFullscreen = (e?: React.SyntheticEvent) => {
    e?.stopPropagation();
    if (isFullscreen) exitFullscreenMode();
    else enterFullscreenMode();
  };

  const basculerLecture = (e?: React.SyntheticEvent) => {
    e?.stopPropagation();
    commander(enLecture ? 'pauseVideo' : 'playVideo');
    setEnLecture((v) => !v);
  };

  const deplacer = (secondes: number) => {
    commander('seekTo', [secondes, true]);
    setPosition(secondes);
  };

  /**
   * Avance locale de la tête de lecture.
   *
   * YouTube ne renseigne la position qu'environ une fois par seconde : la
   * bande avancerait par à-coups. On l'interpole donc localement, chaque
   * message reçu venant recaler la valeur exacte.
   */
  useEffect(() => {
    if (!hasStarted || !enLecture || duree <= 0) return;

    const tic = setInterval(() => {
      setPosition((p) => Math.min(p + 0.25, duree));
    }, 250);

    return () => clearInterval(tic);
  }, [hasStarted, enLecture, duree]);

  const formaterTemps = (s: number) => {
    if (!Number.isFinite(s) || s < 0) return '0:00';
    const m = Math.floor(s / 60);
    const r = Math.floor(s % 60);
    return `${m}:${r.toString().padStart(2, '0')}`;
  };

  // Part de la vidéo déjà vue, bornée pour rester dans [0, 100].
  const pourcentage = duree > 0 ? Math.min(100, Math.max(0, (position / duree) * 100)) : 0;

  const coverImage = thumbnailUrl || `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

  // controls=0 : YouTube ne dessine aucune barre, donc ni logo ni partage.
  // modestbranding, rel=0, iv_load_policy=3, disablekb=1, fs=0 complètent
  // en retirant suggestions, annotations, raccourcis clavier et plein écran natif.
  const embedUrl =
    `https://www.youtube-nocookie.com/embed/${youtubeId}` +
    `?autoplay=1&playsinline=1&controls=0&rel=0&modestbranding=1` +
    `&iv_load_policy=3&disablekb=1&fs=0&enablejsapi=1`;

  return (
    <div
      ref={containerRef}
      onContextMenu={(e) => e.preventDefault()}
      className={`relative select-none group transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-[999999] w-[100dvw] h-[100dvh] max-w-none max-h-none rounded-none bg-black flex flex-col justify-center items-center shadow-none border-0'
          : `w-full aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border border-[#E0E0E0] dark:border-[#2D2D2D] ${className}`
      }`}
    >
      {!hasStarted ? (
        /* ── Miniature + bouton de lecture, démarrage en 1 tap ────────── */
        <div
          onClick={() => setHasStarted(true)}
          className="absolute inset-0 z-20 cursor-pointer overflow-hidden flex items-center justify-center bg-black group"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-all duration-300" />
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#6200EE] hover:bg-[#4A00B0] text-white flex items-center justify-center group-hover:scale-110 active:scale-95 transition-all duration-300 shadow-2xl shadow-[#6200EE]/50 border-2 border-white/40 cursor-pointer btn-press">
              <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-white text-white ml-1 pointer-events-none" />
            </div>
          </div>
        </div>
      ) : (
        /* ── Lecture : habillage YouTube supprimé, commandes maison ───── */
        <div className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center">
          <iframe
            ref={iframeRef}
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            className="w-full h-full border-0"
          />

          {/*
            Voile d'interception. `inset-0` couvre l'iframe en entier : aucun
            clic ne l'atteint, donc aucun lien YouTube n'est ouvrable, même si
            un filigrane réapparaissait. Un clic ici met simplement en pause.
          */}
          <button
            type="button"
            onClick={basculerLecture}
            aria-label={enLecture ? 'Mettre en pause' : 'Reprendre la lecture'}
            className="absolute inset-0 z-20 w-full h-full cursor-pointer bg-transparent"
          />

          {/*
            Bandeau supérieur permanent. YouTube réaffiche le titre de la
            vidéo et le nom de la chaîne au survol, y compris en lecture, et
            ces deux libellés sont des liens vers youtube.com. On les masque
            en permanence. Le bas de l'image, lui, n'est jamais recouvert
            pendant la lecture : les sous-titres y sont incrustés.
          */}
          <div className="absolute top-0 left-0 right-0 h-16 sm:h-20 z-30 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none" />

          {/*
            À l'arrêt, YouTube dessine son propre habillage complet : grand
            bouton de lecture, titre, icône de partage et bouton « Regarder
            sur YouTube ». Un voile pleine surface le recouvre entièrement et
            n'affiche que notre bouton. La vidéo étant arrêtée, aucun
            sous-titre n'est masqué.
          */}
          {!enLecture && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/95 backdrop-blur-sm pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-[#6200EE] text-white flex items-center justify-center shadow-2xl shadow-[#6200EE]/50 border-2 border-white/40">
                <Play className="w-7 h-7 fill-white text-white ml-1" />
              </div>
            </div>
          )}

          {/* ── Barre de commandes ChinoisLingo ──────────────────────── */}
          <div
            data-arret={!enLecture}
            className="absolute bottom-0 left-0 right-0 z-40 px-3 pb-2.5 pt-8 bg-gradient-to-t from-black/85 via-black/45 to-transparent opacity-0 group-hover:opacity-100 focus-within:opacity-100 data-[arret=true]:opacity-100 transition-opacity duration-300"
          >
            {/* La barre n'apparaît que si YouTube nous a communiqué la durée. */}
            {duree > 0 && (
              <input
                type="range"
                min={0}
                max={duree}
                step={0.1}
                value={Math.min(position, duree)}
                onChange={(e) => deplacer(parseFloat(e.target.value))}
                aria-label="Position dans la vidéo"
                /*
                  Le remplissage est peint par un dégradé dont la césure suit
                  la progression : violet à gauche de la tête de lecture, gris
                  translucide à droite. `accent-color` ne colore que la
                  pastille et laissait la piste entièrement grise.
                */
                style={{
                  background: `linear-gradient(to right, #6200EE 0%, #6200EE ${pourcentage}%, rgba(255,255,255,0.28) ${pourcentage}%, rgba(255,255,255,0.28) 100%)`,
                }}
                className="w-full h-1.5 mb-2.5 appearance-none rounded-full cursor-pointer transition-all hover:h-2
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                  [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5
                  [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0
                  [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
              />
            )}

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  type="button"
                  onClick={basculerLecture}
                  aria-label={enLecture ? 'Mettre en pause' : 'Reprendre la lecture'}
                  className="w-8 h-8 rounded-full bg-white/15 hover:bg-[#6200EE] text-white flex items-center justify-center backdrop-blur-md transition-all btn-press shrink-0"
                >
                  {enLecture ? (
                    <Pause className="w-3.5 h-3.5 fill-white" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                  )}
                </button>

                {duree > 0 && (
                  <span className="text-[11px] font-semibold text-white/90 tabular-nums whitespace-nowrap">
                    {formaterTemps(position)} / {formaterTemps(duree)}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
                title={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-[#6200EE] text-white flex items-center justify-center backdrop-blur-md transition-all btn-press shrink-0"
              >
                {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
