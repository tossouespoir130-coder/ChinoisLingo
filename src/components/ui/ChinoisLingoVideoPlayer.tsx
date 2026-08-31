'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Maximize,
  Minimize,
} from 'lucide-react';

interface ChinoisLingoVideoPlayerProps {
  youtubeId: string;
  title: string;
  thumbnailUrl?: string;
  className?: string;
  onEnded?: () => void;
}

export function ChinoisLingoVideoPlayer({
  youtubeId,
  title,
  thumbnailUrl,
  className = '',
}: ChinoisLingoVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Nettoyage au démontage
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  // Écouter la touche Échap pour quitter le plein écran
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        exitFullscreenMode();
      }
    };

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
        document.documentElement.style.overflow = '';
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleNativeFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleNativeFullscreenChange);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleNativeFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleNativeFullscreenChange);
    };
  }, [isFullscreen]);

  const handleStartPlay = (e?: React.SyntheticEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setHasStarted(true);
  };

  const exitFullscreenMode = () => {
    setIsFullscreen(false);
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';

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
    document.documentElement.style.overflow = 'hidden';

    const requestFs =
      el.requestFullscreen ||
      (el as any).webkitRequestFullscreen ||
      (el as any).mozRequestFullScreen ||
      (el as any).msRequestFullscreen;

    if (requestFs) {
      try {
        requestFs.call(el).catch(() => {});
      } catch {}
    }
  };

  const toggleFullscreen = (e?: React.SyntheticEvent) => {
    if (e) e.stopPropagation();
    if (isFullscreen) {
      exitFullscreenMode();
    } else {
      enterFullscreenMode();
    }
  };

  const coverImage = thumbnailUrl || `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&playsinline=1&rel=0&modestbranding=1`;

  return (
    <div
      ref={containerRef}
      className={`relative select-none group transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-[999999] w-[100dvw] h-[100dvh] max-w-none max-h-none rounded-none bg-black flex flex-col justify-center items-center shadow-none border-0'
          : `w-full aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border border-[#E0E0E0] dark:border-[#2D2D2D] ${className}`
      }`}
    >
      {/* 1. ÉTAT INITIAL : MINIATURE HD + BOUTON PLAY VIOLET SIGNATURE (1-CLIC DIRECT) */}
      {!hasStarted ? (
        <div
          onClick={handleStartPlay}
          className="absolute inset-0 z-20 cursor-pointer overflow-hidden flex items-center justify-center bg-black group"
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
              <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-white text-white ml-1 transition-transform pointer-events-none" />
            </div>
          </div>
        </div>
      ) : (
        /* 2. LECTEUR VIDÉO IFRAME 100% FIABLE ET INSTANTANÉ */
        <div className="relative w-full h-full">
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />

          {/* Bouton flottant pour basculer en Plein Écran */}
          <button
            onClick={toggleFullscreen}
            type="button"
            className="absolute bottom-3 right-3 z-30 p-2 rounded-xl bg-black/70 hover:bg-[#6200EE] text-white text-xs font-bold transition-all shadow-md backdrop-blur-md cursor-pointer btn-press"
            title={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
            aria-label={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
  );
}


