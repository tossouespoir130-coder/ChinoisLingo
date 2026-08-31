'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Clock,
  X,
} from 'lucide-react';

interface ChinoisLingoVideoPlayerProps {
  youtubeId: string;
  title: string;
  thumbnailUrl?: string;
  className?: string;
  onEnded?: () => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function ChinoisLingoVideoPlayer({
  youtubeId,
  title,
  thumbnailUrl,
  className = '',
  onEnded,
}: ChinoisLingoVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const iframeContainerId = useRef<string>(`yt-player-${Math.random().toString(36).substring(2, 9)}`);

  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Charger le script YouTube IFrame API une seule fois
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // Nettoyage au démontage
  useEffect(() => {
    return () => {
      if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
        } catch {}
      }
      document.body.style.overflow = '';
    };
  }, []);

  // Écouter les changements de plein écran natifs
  useEffect(() => {
    const handleNativeFullscreenChange = () => {
      const isNativeFull = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      if (!isNativeFull && isFullscreen) {
        setIsFullscreen(false);
        document.body.style.overflow = '';
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        exitFullscreenMode();
      }
    };

    document.addEventListener('fullscreenchange', handleNativeFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleNativeFullscreenChange);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleNativeFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleNativeFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  // Initialisation du lecteur YouTube lors du premier clic
  const initPlayer = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.playVideo();
      setIsPlaying(true);
      return;
    }

    const onPlayerReady = (event: any) => {
      playerRef.current = event.target;
      setDuration(event.target.getDuration() || 0);
      event.target.playVideo();
      setIsPlaying(true);

      if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);
      timeIntervalRef.current = setInterval(() => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          const current = playerRef.current.getCurrentTime() || 0;
          const dur = playerRef.current.getDuration() || 0;
          setCurrentTime(current);
          if (dur > 0) setDuration(dur);
        }
      }, 300);
    };

    const onPlayerStateChange = (event: any) => {
      // 1 = PLAYING, 2 = PAUSED, 0 = ENDED
      if (event.data === 1) {
        setIsPlaying(true);
      } else if (event.data === 2) {
        setIsPlaying(false);
      } else if (event.data === 0) {
        setIsPlaying(false);
        setCurrentTime(0);
        onEnded?.();
      }
    };

    const createInstance = () => {
      try {
        new window.YT.Player(iframeContainerId.current, {
          videoId: youtubeId,
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            playsinline: 1,
            enablejsapi: 1,
            origin: typeof window !== 'undefined' ? window.location.origin : '',
          },
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
          },
        });
      } catch {}
    };

    if (window.YT && window.YT.Player) {
      createInstance();
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        createInstance();
      };
    }
  }, [youtubeId, onEnded]);

  const handleStartPlay = () => {
    setHasStarted(true);
    initPlayer();
  };

  const togglePlayPause = () => {
    if (!playerRef.current) return;
    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    } catch {}
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current || duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const pos = Math.max(0, Math.min(1, clickX / width));
    const seekToTime = Math.max(0, Math.min(duration, pos * duration));
    try {
      playerRef.current.seekTo(seekToTime, true);
      setCurrentTime(seekToTime);
    } catch {}
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    try {
      if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    } catch {}
  };

  const exitFullscreenMode = () => {
    setIsFullscreen(false);
    document.body.style.overflow = '';

    if (document.fullscreenElement || (document as any).webkitFullscreenElement) {
      try {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        }
      } catch {}
    }
  };

  const enterFullscreenMode = () => {
    const el = containerRef.current;
    if (!el) return;

    setIsFullscreen(true);
    document.body.style.overflow = 'hidden';

    // Tentative de passage en vrai plein écran HTML5 / Webkit
    const requestFs =
      el.requestFullscreen ||
      (el as any).webkitRequestFullscreen ||
      (el as any).mozRequestFullScreen ||
      (el as any).msRequestFullscreen;

    if (requestFs) {
      try {
        requestFs.call(el).catch(() => {
          // Si refusé (ex: iOS Safari), le fallback CSS isFullscreen=true prend le relai parfait
        });
      } catch {}
    }
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreenMode();
    } else {
      enterFullscreenMode();
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Auto-hide controls when playing (supporte mobile touch + desktop mouse)
  const triggerControlsVisibility = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3500);
    }
  };

  const coverImage = thumbnailUrl || `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

  return (
    <div
      ref={containerRef}
      onMouseMove={triggerControlsVisibility}
      onTouchStart={triggerControlsVisibility}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className={`relative select-none group transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-[99999] w-screen h-screen max-w-none max-h-none rounded-none bg-black flex flex-col justify-center items-center shadow-none border-0'
          : `w-full aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border border-[#E0E0E0] dark:border-[#2D2D2D] ${className}`
      }`}
    >
      {/* 1. ÉTAT INITIAL : MINIATURE HD + BOUTON PLAY VIOLET SIGNATURE (1-CLIC DIRECT) */}
      {!hasStarted && (
        <div
          onClick={handleStartPlay}
          className="absolute inset-0 z-20 cursor-pointer overflow-hidden flex items-center justify-center bg-black"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
          />

          {/* Voile sombre léger */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-all duration-300" />

          {/* Bouton Circulaire Play Violet Signature ChinoisLingo */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#6200EE] hover:bg-[#4A00B0] text-white flex items-center justify-center group-hover:scale-110 active:scale-95 transition-all duration-300 shadow-2xl shadow-[#6200EE]/50 border-2 border-white/40 cursor-pointer btn-press">
              <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-white text-white ml-1 transition-transform" />
            </div>
          </div>
        </div>
      )}

      {/* 2. CONTENEUR IFRAME YOUTUBE SANS CONTRÔLES NI WATERMARKS */}
      <div className={`w-full h-full ${!hasStarted ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div id={iframeContainerId.current} className="w-full h-full border-0 pointer-events-none" />
      </div>

      {/* 3. COUCHE DE CONTRÔLES 100% CHINOISLINGO (BARRE VIOLETTE #6200EE SANS BARRE ROUGE) */}
      {hasStarted && (
        <div
          className={`absolute inset-0 z-30 flex flex-col justify-between p-3 sm:p-5 bg-gradient-to-t from-black/90 via-transparent to-black/50 transition-opacity duration-300 ${
            showControls || !isPlaying ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={(e) => {
            // Clic n'importe où sur la vidéo pour Play/Pause
            if (e.target === e.currentTarget) {
              togglePlayPause();
            }
          }}
        >
          {/* Top Bar : Titre de la leçon + Bouton Quitter Plein Écran */}
          <div className="flex items-center justify-between text-white drop-shadow-md">
            <span className="text-xs sm:text-sm font-bold truncate pr-4 max-w-[75%]">
              {title}
            </span>

            {isFullscreen && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  exitFullscreenMode();
                }}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-[#6200EE] text-white text-xs font-bold transition-all cursor-pointer backdrop-blur-md"
                title="Quitter le plein écran"
              >
                <Minimize className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Quitter</span>
              </button>
            )}
          </div>

          {/* Bouton Central Play/Pause en cas de pause */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {!isPlaying && (
              <div
                onClick={togglePlayPause}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#6200EE]/90 hover:bg-[#6200EE] text-white flex items-center justify-center shadow-xl shadow-[#6200EE]/40 border-2 border-white/40 pointer-events-auto cursor-pointer btn-press transition-transform hover:scale-105"
              >
                <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white text-white ml-0.5" />
              </div>
            )}
          </div>

          {/* Bottom Controls Bar : Barre de Défilement Violette + Minuterie */}
          <div className="space-y-2 pointer-events-auto pb-1" onClick={(e) => e.stopPropagation()}>
            {/* Barre de Progression Violette Défilante */}
            <div
              onClick={handleSeek}
              className="relative w-full h-2.5 hover:h-4 bg-white/25 rounded-full cursor-pointer transition-all flex items-center group/bar"
            >
              {/* Barre pleine violette #6200EE */}
              <div
                className="h-full bg-[#6200EE] rounded-full relative transition-all duration-100 shadow-md shadow-[#6200EE]/50"
                style={{ width: `${progressPercent}%` }}
              >
                {/* Tête de lecture circulaire */}
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white ring-2 ring-[#6200EE] shadow-md scale-0 group-hover/bar:scale-100 transition-transform" />
              </div>
            </div>

            {/* Rangée de boutons : Play/Pause, Minuterie, Son, Plein Écran */}
            <div className="flex items-center justify-between text-white text-xs font-semibold pt-1">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <button
                  onClick={togglePlayPause}
                  type="button"
                  className="w-8 h-8 rounded-lg bg-white/15 hover:bg-[#6200EE] text-white flex items-center justify-center transition-colors cursor-pointer active:scale-95"
                  title={isPlaying ? 'Mettre en pause' : 'Lire la vidéo'}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                </button>

                <button
                  onClick={toggleMute}
                  type="button"
                  className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer active:scale-95"
                  title={isMuted ? 'Activer le son' : 'Couper le son'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {/* Minuterie stylisée */}
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-mono text-white/90 bg-black/40 px-2.5 py-1 rounded-lg border border-white/10">
                  <Clock className="w-3 h-3 text-[#03DAC5]" />
                  <span>{formatTime(currentTime)}</span>
                  <span className="text-white/40">/</span>
                  <span className="text-white/70">{formatTime(duration)}</span>
                </div>
              </div>

              {/* Bouton Plein Écran Universel (Mobile + PC) */}
              <button
                onClick={toggleFullscreen}
                type="button"
                className="w-8 h-8 rounded-lg bg-white/15 hover:bg-[#6200EE] text-white flex items-center justify-center transition-colors cursor-pointer active:scale-95"
                title={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
                aria-label={isFullscreen ? 'Quitter le plein écran' : 'Activer le plein écran'}
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
