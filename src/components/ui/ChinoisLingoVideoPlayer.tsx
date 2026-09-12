'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Maximize, Minimize, X } from 'lucide-react';
import { Portal } from '@/components/ui/Portal';

/**
 * Les variantes préfixées du plein écran (Safari) ne figurent pas dans les
 * types du DOM. On les déclare plutôt que de recourir à `any`, pour garder le
 * fichier vérifiable par le compilateur.
 */
interface DocumentPleinEcran extends Document {
  webkitFullscreenElement?: Element | null;
  webkitFullscreenEnabled?: boolean;
  webkitExitFullscreen?: () => void;
}

interface ElementPleinEcran extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void> | void;
}

/** `lock()` n'existe que sur Android : il ne figure pas dans les types du DOM. */
interface OrientationVerrouillable {
  lock?: (orientation: string) => Promise<void>;
  unlock?: () => void;
}

/**
 * Plein écran, deux voies :
 *   • « natif » — l'API Fullscreen place le conteneur au-dessus de tout
 *     (Android, ordinateur, iPad). Sur Android, l'écran bascule en paysage.
 *   • « secours » — iPhone, où cette API ne s'applique qu'aux balises <video>.
 *     Le lecteur est alors rendu dans un <Portal>, directement sous <body>.
 *     Rendu sur place, `position: fixed` restait prisonnier de la carte de
 *     l'application (son `backdrop-filter` en fait le repère des éléments
 *     fixes) : la vidéo débordait de l'écran et la barre d'onglets recouvrait
 *     le bouton de sortie.
 */
type ModePleinEcran = 'non' | 'natif' | 'secours';

interface ChinoisLingoVideoPlayerProps {
  youtubeId: string;
  title: string;
  thumbnailUrl?: string;
  className?: string;
  onEnded?: () => void;
  /** Premier tap sur « lecture » — permet par exemple de fixer la vidéo à l'écran. */
  onStart?: () => void;
}

/** Bond d'une tape sur le côté de l'image, comme dans les lecteurs habituels. */
const SAUT_SECONDES = 10;

/** Délai avant l'effacement des commandes pendant la lecture. */
const DELAI_MASQUAGE_MS = 2000;

/** États renvoyés par YouTube : 1 = en lecture, 2 = en pause, 0 = terminé. */
const ETAT_LECTURE = 1;
const ETAT_PAUSE = 2;

function orientationEcran(): OrientationVerrouillable | undefined {
  if (typeof screen === 'undefined') return undefined;
  return screen.orientation as unknown as OrientationVerrouillable | undefined;
}

function bloquerDefilement(bloque: boolean) {
  document.body.style.overflow = bloque ? 'hidden' : '';
  document.documentElement.style.overflow = bloque ? 'hidden' : '';
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
 *   2. Des zones transparentes couvrent toute la surface de l'iframe et
 *      interceptent chaque tap. Même si YouTube réaffichait un filigrane au
 *      survol, il resterait hors d'atteinte.
 *   3. Le clic droit est neutralisé sur le conteneur.
 *
 * Ces zones ne mettent PLUS la vidéo en pause : une tape à gauche recule de
 * 10 secondes, à droite avance d'autant, au centre elle montre ou efface les
 * commandes. Seul le bouton lecture/pause interrompt la vidéo — taper l'image
 * pour « voir ce qui se passe » ne doit pas couper le film.
 */
export function ChinoisLingoVideoPlayer({
  youtubeId,
  title,
  thumbnailUrl,
  className = '',
  onEnded,
  onStart,
}: ChinoisLingoVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [hasStarted, setHasStarted] = useState(false);
  const [pleinEcran, setPleinEcran] = useState<ModePleinEcran>('non');
  const [enLecture, setEnLecture] = useState(true);
  const [position, setPosition] = useState(0);
  const [duree, setDuree] = useState(0);

  /** Commandes affichées ; elles s'effacent seules pendant la lecture. */
  const [commandesVisibles, setCommandesVisibles] = useState(true);
  /** Retour visuel bref après une tape de saut. */
  const [saut, setSaut] = useState<{ sens: -1 | 1; cle: number } | null>(null);

  /**
   * Seconde de départ de l'iframe. En mode secours, l'iframe change de parent
   * et le navigateur la recharge : on la relance là où la lecture en était.
   */
  const [depart, setDepart] = useState(0);

  const positionRef = useRef(0);
  const enLectureRef = useRef(true);
  const etatLecteurRef = useRef(-1);
  const minuteurCommandes = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);
  useEffect(() => {
    enLectureRef.current = enLecture;
  }, [enLecture]);

  // ── Pilotage de la vidéo ────────────────────────────────────────────
  const commander = useCallback((func: string, args: unknown[] = []) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func, args }),
      '*'
    );
  }, []);

  /** Demande à YouTube de commencer à publier son état. */
  const abonner = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: 'listening' }), '*');
  }, []);

  /**
   * YouTube ignore les commandes reçues avant que son lecteur ne soit prêt :
   * sur téléphone, il fallait souvent taper plusieurs fois avant que la vidéo
   * ne démarre. On répète donc la commande jusqu'à ce que le lecteur annonce
   * l'état voulu.
   */
  const commanderJusqua = useCallback(
    (func: 'playVideo' | 'pauseVideo', etatVoulu: number) => {
      abonner();
      commander(func);

      let essais = 0;
      const relance = setInterval(() => {
        essais += 1;
        if (etatLecteurRef.current === etatVoulu || essais > 8) {
          clearInterval(relance);
          return;
        }
        abonner();
        commander(func);
      }, 250);
    },
    [abonner, commander]
  );

  const montrerCommandes = useCallback(() => {
    setCommandesVisibles(true);
    if (minuteurCommandes.current) clearTimeout(minuteurCommandes.current);
    minuteurCommandes.current = setTimeout(() => {
      // À l'arrêt, les commandes restent : c'est le seul moyen de repartir.
      if (enLectureRef.current) setCommandesVisibles(false);
    }, DELAI_MASQUAGE_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (minuteurCommandes.current) clearTimeout(minuteurCommandes.current);
    };
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
          etatLecteurRef.current = info.playerState;
          setEnLecture(info.playerState === ETAT_LECTURE);
          // Mise en pause : les commandes réapparaissent pour pouvoir repartir.
          if (info.playerState !== ETAT_LECTURE) setCommandesVisibles(true);
          // 0 = terminé
          if (info.playerState === 0) onEnded?.();
        }
      } catch {
        // Message non JSON : sans conséquence, on l'ignore.
      }
    };

    window.addEventListener('message', surMessage);

    abonner();
    const battement = setInterval(abonner, 1000);

    return () => {
      window.removeEventListener('message', surMessage);
      clearInterval(battement);
    };
  }, [hasStarted, onEnded, abonner]);

  const demarrer = () => {
    setHasStarted(true);
    montrerCommandes();
    onStart?.();
  };

  // ── Plein écran ─────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      bloquerDefilement(false);
      try {
        orientationEcran()?.unlock?.();
      } catch {}
    };
  }, []);

  const quitterPleinEcran = useCallback(() => {
    const doc = document as DocumentPleinEcran;
    if (doc.fullscreenElement || doc.webkitFullscreenElement) {
      try {
        if (doc.exitFullscreen) doc.exitFullscreen().catch(() => {});
        else doc.webkitExitFullscreen?.();
      } catch {}
    }
    try {
      orientationEcran()?.unlock?.();
    } catch {}
    bloquerDefilement(false);

    // Retour du mode secours : l'iframe reprend sa place et repart d'où elle en était.
    if (pleinEcran === 'secours') setDepart(Math.floor(positionRef.current));
    setPleinEcran('non');
  }, [pleinEcran]);

  useEffect(() => {
    const surTouche = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && pleinEcran !== 'non') quitterPleinEcran();
    };

    // Sortie décidée par le système : geste retour d'Android, touche Échap.
    const surChangementNatif = () => {
      const doc = document as DocumentPleinEcran;
      const plein = Boolean(doc.fullscreenElement || doc.webkitFullscreenElement);
      if (!plein && pleinEcran === 'natif') quitterPleinEcran();
    };

    document.addEventListener('keydown', surTouche);
    document.addEventListener('fullscreenchange', surChangementNatif);
    document.addEventListener('webkitfullscreenchange', surChangementNatif);

    return () => {
      document.removeEventListener('keydown', surTouche);
      document.removeEventListener('fullscreenchange', surChangementNatif);
      document.removeEventListener('webkitfullscreenchange', surChangementNatif);
    };
  }, [pleinEcran, quitterPleinEcran]);

  const passerEnSecours = () => {
    setDepart(Math.floor(positionRef.current));
    setPleinEcran('secours');
    bloquerDefilement(true);
  };

  const entrerPleinEcran = () => {
    const el = containerRef.current as ElementPleinEcran | null;
    if (!el) return;

    const doc = document as DocumentPleinEcran;
    const demander = el.requestFullscreen ?? el.webkitRequestFullscreen;
    const natifPossible =
      Boolean(demander) && Boolean(document.fullscreenEnabled || doc.webkitFullscreenEnabled);

    if (!demander || !natifPossible) {
      passerEnSecours();
      return;
    }

    setPleinEcran('natif');
    bloquerDefilement(true);

    // Appel synchrone, dans le geste de l'utilisateur : Safari refuse le plein
    // écran demandé après coup.
    let requete: Promise<void> | void;
    try {
      requete = demander.call(el);
    } catch {
      passerEnSecours();
      return;
    }

    Promise.resolve(requete)
      .then(() => {
        // Android : la vidéo passe à l'horizontale, comme dans une application.
        // Refusé sur ordinateur et sur iPad, sans conséquence.
        orientationEcran()?.lock?.('landscape').catch(() => {});
      })
      .catch(() => passerEnSecours());
  };

  const basculerPleinEcran = (e?: React.SyntheticEvent) => {
    e?.stopPropagation();
    if (pleinEcran !== 'non') quitterPleinEcran();
    else entrerPleinEcran();
    montrerCommandes();
  };

  const basculerLecture = (e?: React.SyntheticEvent) => {
    e?.stopPropagation();
    const versLecture = !enLecture;
    setEnLecture(versLecture);
    commanderJusqua(versLecture ? 'playVideo' : 'pauseVideo', versLecture ? ETAT_LECTURE : ETAT_PAUSE);
    montrerCommandes();
  };

  const deplacer = (secondes: number) => {
    commander('seekTo', [secondes, true]);
    setPosition(secondes);
  };

  /** Tape sur le côté de l'image : 10 secondes en arrière ou en avant. */
  const sauter = (sens: -1 | 1) => {
    const brute = positionRef.current + sens * SAUT_SECONDES;
    const cible = Math.max(0, duree > 0 ? Math.min(brute, duree) : brute);
    deplacer(cible);
    setSaut({ sens, cle: Date.now() });
    montrerCommandes();
  };

  useEffect(() => {
    if (!saut) return;
    const minuteur = setTimeout(() => setSaut(null), 550);
    return () => clearTimeout(minuteur);
  }, [saut]);

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
    `&iv_load_policy=3&disablekb=1&fs=0&enablejsapi=1` +
    (depart > 0 ? `&start=${depart}` : '');

  const enPleinEcran = pleinEcran !== 'non';
  const tailleBouton = enPleinEcran ? 'w-10 h-10' : 'w-8 h-8';
  // À l'arrêt, les commandes restent affichées : sinon plus rien ne permet de repartir.
  const commandesAffichees = commandesVisibles || !enLecture;

  /* ── Lecture : habillage YouTube supprimé, commandes maison ─────────── */
  const surfaceLecture = (
    <div
      className={`absolute inset-0 overflow-hidden bg-black transition-all duration-300 ${
        !commandesAffichees ? 'cursor-none [&_*]:!cursor-none' : ''
      }`}
      onMouseMove={montrerCommandes}
      onPointerMove={montrerCommandes}
    >
      {/*
        Positionnement absolu plutôt que `flex` + `h-full`.

        Une hauteur en pourcentage dans un conteneur dimensionné par
        `aspect-ratio` ne se résout pas de façon fiable sur tous les
        navigateurs mobiles : l'iframe pouvait se retrouver alignée en bas
        du cadre au lieu de le remplir. `inset-0` supprime cette
        incertitude — l'iframe couvre exactement le conteneur, et YouTube
        centre lui-même l'image à l'intérieur.
      */}
      <iframe
        ref={iframeRef}
        src={embedUrl}
        title={title}
        onLoad={abonner}
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        className="absolute inset-0 w-full h-full border-0"
      />

      {/*
        Zones d'interception. Elles couvrent l'iframe en entier : aucun clic
        ne l'atteint, donc aucun lien YouTube n'est ouvrable. Une tape sur les
        côtés déplace la lecture de 10 secondes, au centre elle montre ou
        efface les commandes — mais ne met jamais en pause.
      */}
      <div className={`absolute inset-0 z-20 flex ${!commandesAffichees ? 'cursor-none' : ''}`}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            sauter(-1);
          }}
          aria-label={`Reculer de ${SAUT_SECONDES} secondes`}
          className={`h-full w-[30%] bg-transparent ${commandesAffichees ? 'cursor-pointer' : 'cursor-none'}`}
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (commandesVisibles) setCommandesVisibles(false);
            else montrerCommandes();
          }}
          aria-label={commandesVisibles ? 'Masquer les commandes' : 'Afficher les commandes'}
          className={`h-full flex-1 bg-transparent ${commandesAffichees ? 'cursor-pointer' : 'cursor-none'}`}
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            sauter(1);
          }}
          aria-label={`Avancer de ${SAUT_SECONDES} secondes`}
          className={`h-full w-[30%] bg-transparent ${commandesAffichees ? 'cursor-pointer' : 'cursor-none'}`}
        />
      </div>

      {/* Retour visuel du saut, le temps d'une demi-seconde. */}
      {saut && (
        <div
          className={`absolute top-1/2 -translate-y-1/2 z-30 px-3 py-1.5 rounded-full bg-black/60 text-white text-xs font-bold backdrop-blur-md pointer-events-none ${
            saut.sens === -1 ? 'left-6' : 'right-6'
          }`}
        >
          {saut.sens === -1 ? `− ${SAUT_SECONDES} s` : `+ ${SAUT_SECONDES} s`}
        </div>
      )}

      {/*
        Voile du haut : il masque le titre et le nom de la chaîne, que YouTube
        réaffiche parfois et qui sont des liens vers youtube.com. Il n'apparaît
        qu'avec les commandes — en permanence, il assombrissait l'image et
        gênait la lecture.
      */}
      <div
        className={`absolute top-0 left-0 right-0 h-14 sm:h-16 z-30 bg-gradient-to-b from-black/70 to-transparent pointer-events-none transition-opacity duration-300 ${
          commandesAffichees ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/*
        À l'arrêt, YouTube dessine son propre habillage complet : grand
        bouton de lecture, titre, icône de partage et bouton « Regarder
        sur YouTube ». Un voile pleine surface le recouvre entièrement et
        n'affiche que notre bouton. La vidéo étant arrêtée, aucun
        sous-titre n'est masqué.
      */}
      {!enLecture && (
        <div className="absolute inset-0 z-30 bg-black/95 backdrop-blur-sm pointer-events-none" />
      )}

      {/*
        Bouton central lecture/pause : la commande principale, au milieu de
        l'image. Il joue ET met en pause — auparavant il n'apparaissait qu'à
        l'arrêt, si bien qu'on ne pouvait plus interrompre la vidéo une fois
        lancée. Il s'efface avec les autres commandes pendant la lecture.
      */}
      <button
        type="button"
        onClick={basculerLecture}
        aria-label={enLecture ? 'Mettre en pause' : 'Reprendre la lecture'}
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-16 h-16 rounded-full bg-[#6200EE]/95 hover:bg-[#4A00B0] text-white flex items-center justify-center shadow-2xl shadow-[#6200EE]/50 border-2 border-white/40 active:scale-95 transition-all btn-press cursor-pointer ${
          commandesAffichees ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {enLecture ? (
          <Pause className="w-7 h-7 fill-white text-white pointer-events-none" />
        ) : (
          <Play className="w-7 h-7 fill-white text-white ml-1 pointer-events-none" />
        )}
      </button>

      {/*
        Sortie du plein écran toujours visible, en haut à droite, avec une
        cible tactile confortable : le seul bouton du bas se retrouvait
        masqué ou hors de l'écran sur téléphone.
      */}
      {enPleinEcran && (
        <button
          type="button"
          onClick={basculerPleinEcran}
          aria-label="Quitter le plein écran"
          title="Quitter le plein écran"
          className="absolute z-50 top-[max(0.75rem,env(safe-area-inset-top))] right-[max(0.75rem,env(safe-area-inset-right))] w-11 h-11 rounded-full bg-black/50 hover:bg-[#6200EE] border border-white/25 text-white flex items-center justify-center backdrop-blur-md transition-all btn-press"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/*
        Barre de commandes ChinoisLingo. Elle s'efface d'elle-même pendant la
        lecture pour laisser l'image entière, et revient à la moindre tape.
      */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-40 px-3 pt-8 bg-gradient-to-t from-black/75 via-black/25 to-transparent transition-opacity duration-300 pointer-events-none ${
          enPleinEcran ? 'pb-[max(0.75rem,env(safe-area-inset-bottom))]' : 'pb-2.5'
        } ${commandesAffichees ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        {/* La barre n'apparaît que si YouTube nous a communiqué la durée. */}
        {duree > 0 && (
          <input
            type="range"
            min={0}
            max={duree}
            step={0.1}
            value={Math.min(position, duree)}
            onChange={(e) => {
              deplacer(parseFloat(e.target.value));
              montrerCommandes();
            }}
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
            className="pointer-events-auto w-full h-1.5 mb-2.5 appearance-none rounded-full cursor-pointer transition-all hover:h-2
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
              className={`pointer-events-auto ${tailleBouton} rounded-full bg-white/15 hover:bg-[#6200EE] text-white flex items-center justify-center backdrop-blur-md transition-all btn-press shrink-0`}
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
            onClick={basculerPleinEcran}
            aria-label={enPleinEcran ? 'Quitter le plein écran' : 'Plein écran'}
            title={enPleinEcran ? 'Quitter le plein écran' : 'Plein écran'}
            className={`pointer-events-auto ${tailleBouton} rounded-full bg-white/15 hover:bg-[#6200EE] text-white flex items-center justify-center backdrop-blur-md transition-all btn-press shrink-0`}
          >
            {enPleinEcran ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      onContextMenu={(e) => e.preventDefault()}
      onMouseMove={hasStarted ? montrerCommandes : undefined}
      onPointerMove={hasStarted ? montrerCommandes : undefined}
      className={`relative select-none group transition-all duration-300 ${
        hasStarted && !commandesAffichees ? 'cursor-none [&_*]:!cursor-none' : ''
      } ${
        pleinEcran === 'natif'
          ? 'fixed inset-0 z-[999999] w-screen h-[100dvh] max-w-none max-h-none rounded-none bg-black shadow-none border-0'
          : `w-full aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border border-[#E0E0E0] dark:border-[#2D2D2D] ${className}`
      }`}
    >
      {!hasStarted ? (
        /* ── Miniature + bouton de lecture, démarrage en 1 tap ────────── */
        <div
          onClick={demarrer}
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
      ) : pleinEcran === 'secours' ? (
        <>
          {/* Place gardée pendant que la vidéo occupe tout l'écran. */}
          <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white/60">
            Lecture en plein écran…
          </div>
          <Portal>
            <div
              onContextMenu={(e) => e.preventDefault()}
              onMouseMove={montrerCommandes}
              onPointerMove={montrerCommandes}
              className={`fixed inset-0 z-[1000] bg-black select-none group ${
                !commandesAffichees ? 'cursor-none [&_*]:!cursor-none' : ''
              }`}
            >
              {surfaceLecture}
            </div>
          </Portal>
        </>
      ) : (
        surfaceLecture
      )}
    </div>
  );
}
