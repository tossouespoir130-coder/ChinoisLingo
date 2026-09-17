'use client';

import { useEffect, useRef } from 'react';
import { trackStudyMinutes } from '@/lib/services/activityTrackingService';

/**
 * Tracker intelligent de temps d'étude réel pour ChinoisLingo.
 *
 * Fonctionnement :
 * - Détecte si l'utilisateur est actif (interactions souris, touches, scroll)
 *   OU si un média audio/vidéo est en cours de lecture.
 * - Toutes les 60 secondes d'activité effective : appelle `trackStudyMinutes(1)`.
 * - Met à jour en temps réel les barres de performance du Tableau de Bord.
 */
export function StudyTimeTracker() {
  const isUserActiveRef = useRef<boolean>(true);
  const lastActiveTimestampRef = useRef<number>(Date.now());
  const activeSecondsRef = useRef<number>(0);

  useEffect(() => {
    // Activité utilisateur : réinitialise le délai d'inactivité
    const handleUserInteraction = () => {
      lastActiveTimestampRef.current = Date.now();
      isUserActiveRef.current = true;
    };

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach((ev) => window.addEventListener(ev, handleUserInteraction, { passive: true }));

    // Vérifie si des éléments audio ou vidéo sont en train de jouer sur la page
    const isMediaPlaying = () => {
      const audios = document.querySelectorAll('audio');
      for (const a of Array.from(audios)) {
        if (!a.paused && a.currentTime > 0 && !a.ended) return true;
      }
      const videos = document.querySelectorAll('video');
      for (const v of Array.from(videos)) {
        if (!v.paused && v.currentTime > 0 && !v.ended) return true;
      }
      return false;
    };

    // Timer d'évaluation chaque seconde
    const interval = setInterval(() => {
      // Si inactif depuis plus de 90 secondes et aucun média ne joue, pause du compteur
      const isRecentlyInteracting = Date.now() - lastActiveTimestampRef.current < 90000;
      const mediaPlaying = isMediaPlaying();

      if (isRecentlyInteracting || mediaPlaying) {
        activeSecondsRef.current += 1;

        // Toutes les 60 secondes d'étude accumulées -> enregistrer 1 minute
        if (activeSecondsRef.current >= 60) {
          activeSecondsRef.current = 0;
          trackStudyMinutes(1);
        }
      }
    }, 1000);

    // Sauvegarde au départ de la page si au moins 30s ont été accumulées
    const handleBeforeUnload = () => {
      if (activeSecondsRef.current >= 30) {
        trackStudyMinutes(1);
        activeSecondsRef.current = 0;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      events.forEach((ev) => window.removeEventListener(ev, handleUserInteraction));
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return null; // Composant logique invisible
}
