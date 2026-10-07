'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { VocabularyWord } from '@/lib/mock/vocabulary';
import { usePreferences } from '@/context/PreferencesContext';
import { tatoebaCorpusByHanzi } from '@/lib/data/tatoebaCorpus';
import { getVerifiedTripleForWord } from '@/lib/data/hskSentencesDatabase';
import { 
  Volume2, 
  RotateCw, 
  Sparkles, 
  CheckCircle2, 
  Trophy, 
  Lightbulb,
  CornerDownLeft,
  Shuffle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { noter, libelleDelai, type EtatCarte, type Note } from '@/lib/srs/planificateur';
import { construireFile, prochaineCarte, mettreAJourFile, compteurs, type FileSession } from '@/lib/srs/fileSession';
import { fetchEtatsCartes, enregistrerEtatCarte } from '@/lib/services/revisionService';

/**
 * Abréviations grammaticales normalisées et épurées
 */
function formatGrammarCategory(cat?: string): string {
  if (!cat) return '';
  const c = cat.toLowerCase().trim();
  if (c.includes('adverbe') || c === 'adv') return 'adv.';
  if (c.includes('adjectif') || c === 'adj') return 'adj.';
  if (c.includes('verbe auxiliaire')) return 'v. aux.';
  if (c.includes('verbe') || c === 'v') return 'v.';
  if (c.includes('pronom') || c === 'pron') return 'pron.';
  if (c.includes('nom propre')) return 'n. pr.';
  if (c.includes('nom') || c === 'n') return 'n.';
  if (c.includes('préposition') || c.includes('preposition') || c === 'prep') return 'prép.';
  if (c.includes('conjonction') || c === 'conj') return 'conj.';
  if (c.includes('particule') || c === 'part') return 'part.';
  if (c.includes('classificateur') || c === 'cl') return 'cl.';
  if (c.includes('numéral') || c.includes('nombre') || c === 'num') return 'num.';
  if (c.includes('localisateur')) return 'loc.';
  if (c.includes('interjection')) return 'interj.';
  if (c.includes('expression')) return 'expr.';
  return cat;
}

/**
 * Récupère l'exemple vérifié et certifié pour la carte flashcard 3D.
 */
function getFlashcardVerifiedExample(word?: VocabularyWord) {
  if (!word) return null;
  const hz = word.hanzi;

  // 1. Corpus Tatoeba
  if (tatoebaCorpusByHanzi[hz] && tatoebaCorpusByHanzi[hz].length > 0) {
    const ex = tatoebaCorpusByHanzi[hz][0];
    return {
      hanzi: ex.hanzi,
      pinyin: ex.pinyin,
      french: ex.french,
    };
  }

  // 2. Base statique certifiée
  const triple = getVerifiedTripleForWord(hz);
  if (triple) {
    const ex = triple.beginner || triple.intermediate || triple.advanced;
    if (ex && ex.hanzi) {
      return {
        hanzi: ex.hanzi,
        pinyin: ex.pinyin,
        french: ex.french,
      };
    }
  }

  // 3. Si le mot contient une phrase réelle non-méta
  const rawHanzi = word.exampleHanzi || '';
  const rawFrench = word.exampleFrench || '';
  const isMetaTemplate =
    rawHanzi.includes('重点必考词汇') ||
    rawHanzi.includes('必考词汇') ||
    rawFrench.includes('exprime l\'idée de') ||
    rawFrench.includes('Le terme «') ||
    rawFrench.includes('dans le contexte du HSK');

  if (rawHanzi && rawFrench && !isMetaTemplate) {
    return {
      hanzi: word.exampleHanzi,
      pinyin: word.examplePinyin || '',
      french: word.exampleFrench,
    };
  }

  return null;
}

type FaceAvant = 'hanzi' | 'pinyin' | 'french';

const INDICE_RETOURNEMENT: Record<FaceAvant, string> = {
  hanzi: 'Touchez pour voir le pinyin et la traduction',
  pinyin: 'Touchez pour voir le caractère et la traduction',
  french: 'Touchez pour voir le caractère et le pinyin',
};

const BOUTONS_NOTES: { note: Note; libelle: string; classes: string }[] = [
  { note: 'again', libelle: '🔴 À revoir', classes: 'bg-[#DD2C00]/10 hover:bg-[#DD2C00] text-[#DD2C00] hover:text-white border border-[#DD2C00]/25' },
  { note: 'hard', libelle: '🟠 Difficile', classes: 'bg-[#FFA000]/10 hover:bg-[#FFA000] text-[#B78103] hover:text-white dark:text-[#FFD54F] border border-[#FFA000]/25' },
  { note: 'good', libelle: '🟢 Je sais', classes: 'bg-[#03DAC5]/15 hover:bg-[#03DAC5] text-[#00897B] hover:text-[#0B0B0F] dark:text-[#03DAC5] border border-[#03DAC5]/25' },
  { note: 'easy', libelle: '⚡ Facile', classes: 'bg-[#6200EE]/15 hover:bg-[#6200EE] text-[#6200EE] hover:text-white dark:text-[#BB86FC] border border-[#6200EE]/25' },
];

interface FlashcardSessionProps {
  words: VocabularyWord[];
  themeTitle: string;
  onFinish?: () => void;
}

export function FlashcardSession({ words, themeTitle, onFinish }: FlashcardSessionProps) {
  const { 
    showPinyin, 
    showFrenchTranslation, 
    audioSpeed, 
    autoPlayAudio,
    cardsPerSession, 
    reviewOrder, 
    cardFrontFace, 
    showExampleSentence,
    userName
  } = usePreferences();

  // ── Répétition espacée (comme Anki) ──
  // L'état de chaque carte est chargé depuis Supabase, la file de la session
  // est construite une seule fois (cartes en apprentissage, révisions dues,
  // nouvelles cartes dans la limite du jour), puis chaque note est enregistrée
  // immédiatement : quitter puis revenir reprend exactement au même point.
  const [etats, setEtats] = useState<Record<string, EtatCarte> | null>(null);
  const [file, setFile] = useState<FileSession | null>(null);
  const [carteCourante, setCarteCourante] = useState<string | null>(null);
  const [faceAvant, setFaceAvant] = useState<FaceAvant>('hanzi');
  const [maintenantCarte, setMaintenantCarte] = useState<Date | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [notesSession, setNotesSession] = useState<Note[]>([]);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const motsParHanzi = useMemo(() => {
    const index: Record<string, VocabularyWord> = {};
    for (const w of words) if (!index[w.hanzi]) index[w.hanzi] = w;
    return index;
  }, [words]);

  const tirerFace = (): FaceAvant => {
    if (cardFrontFace !== 'random') return cardFrontFace;
    const sens: FaceAvant[] = ['hanzi', 'pinyin', 'french'];
    return sens[Math.floor(Math.random() * sens.length)];
  };

  /** Présente la carte suivante, ou termine la session. */
  const avancer = (fileActuelle: FileSession, etatsActuels: Record<string, EtatCarte>) => {
    const maintenant = new Date();
    const suivante = prochaineCarte(fileActuelle, etatsActuels, maintenant);
    setFile(fileActuelle);
    setIsFlipped(false);
    if (!suivante) {
      setCarteCourante(null);
      setSessionCompleted(true);
      return false;
    }
    setCarteCourante(suivante);
    setFaceAvant(tirerFace());
    setMaintenantCarte(maintenant);
    return true;
  };

  // Chargement des états puis construction de la file (une seule fois par session).
  useEffect(() => {
    let annule = false;
    fetchEtatsCartes().then((charges) => {
      if (annule) return;
      const limite = cardsPerSession === 'all' ? Infinity : parseInt(cardsPerSession, 10) || 20;
      const melanger = (liste: string[]) => {
        if (reviewOrder !== 'random') return liste;
        const copie = [...liste];
        for (let i = copie.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [copie[i], copie[j]] = [copie[j], copie[i]];
        }
        return copie;
      };
      const premiere = construireFile(words.map((w) => w.hanzi), charges, new Date(), limite, melanger);
      setEtats(charges);
      avancer(premiere, charges);
    });
    return () => {
      annule = true;
    };
    // La file est figée au lancement : changer une préférence en cours de route ne la reconstruit pas.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentWord: VocabularyWord | undefined = carteCourante ? motsParHanzi[carteCourante] : undefined;
  const nombres = file ? compteurs(file) : { nouvelles: 0, apprentissage: 0, revisions: 0 };
  const restantes = nombres.nouvelles + nombres.apprentissage + nombres.revisions;
  const progressPct = notesSession.length + restantes > 0
    ? Math.round((notesSession.length / (notesSession.length + restantes)) * 100)
    : 100;

  /** Délai qu'afficherait chaque note pour la carte courante (sous les boutons). */
  const apercus = useMemo(() => {
    if (!carteCourante || !etats || !maintenantCarte) return null;
    const etat = etats[carteCourante] ?? null;
    const notes: Note[] = ['again', 'hard', 'good', 'easy'];
    return Object.fromEntries(
      notes.map((n) => [n, libelleDelai(maintenantCarte, noter(etat, carteCourante, n, maintenantCarte).echeance)])
    ) as Record<Note, string>;
  }, [carteCourante, etats, maintenantCarte]);

  /** Prochaine échéance du paquet, pour l'écran de fin. */
  const prochaineEcheance = useMemo(() => {
    if (!etats || !sessionCompleted) return null;
    const dates = words
      .map((w) => etats[w.hanzi]?.echeance)
      .filter((d): d is string => Boolean(d))
      .map((d) => new Date(d).getTime());
    return dates.length > 0 ? new Date(Math.min(...dates)).toISOString() : null;
  }, [etats, sessionCompleted, words]);

  // Exemple certifié pour la carte en cours
  const verifiedExample = useMemo(() => {
    return getFlashcardVerifiedExample(currentWord);
  }, [currentWord]);

  const grammarAbbr = useMemo(() => {
    return formatGrammarCategory(currentWord?.category);
  }, [currentWord?.category]);

  const playAudio = (text: string, rateMultiplier: number = 1) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    const clean = text.trim();
    const vocabAudioUrl = `/audio/vocab/${encodeURIComponent(clean)}.mp3`;

    let isHandled = false;
    const playWebSpeech = () => {
      if (isHandled) return;
      isHandled = true;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        const baseRate = parseFloat(audioSpeed) || 0.85;
        utterance.rate = Math.max(0.5, Math.min(1.5, baseRate * rateMultiplier));
        setIsPlayingAudio(true);
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setIsPlayingAudio(false);
      }
    };

    const audio = new Audio(vocabAudioUrl);
    setIsPlayingAudio(true);
    const baseRate = parseFloat(audioSpeed) || 1.0;
    audio.playbackRate = Math.max(0.5, Math.min(1.5, baseRate * rateMultiplier));
    audio.onended = () => {
      if (isHandled) return;
      isHandled = true;
      setIsPlayingAudio(false);
    };
    audio.onerror = () => playWebSpeech();
    audio.play().catch(() => playWebSpeech());
  };

  // Lecture automatique à chaque nouvelle présentation d'une carte
  // (jamais quand la face avant est le français : l'audio donnerait la réponse).
  useEffect(() => {
    if (autoPlayAudio && faceAvant !== 'french' && currentWord?.hanzi) {
      const timer = setTimeout(() => {
        playAudio(currentWord.hanzi);
      }, 250);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maintenantCarte, autoPlayAudio, faceAvant, currentWord?.hanzi]);

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([30, 40, 30]);
      } catch {
        // ignore
      }
    }
  };

  const handleSrsGrade = (note: Note) => {
    if (!carteCourante || !etats || !file || !isFlipped) return;
    triggerHaptic();

    const nouvelEtat = noter(etats[carteCourante] ?? null, carteCourante, note, new Date());
    const etatsSuivants = { ...etats, [carteCourante]: nouvelEtat };
    setEtats(etatsSuivants);
    setNotesSession((prev) => [...prev, note]);
    // Enregistrement immédiat : la progression survit à une fermeture de l'onglet.
    void enregistrerEtatCarte(nouvelEtat);

    const continuer = avancer(mettreAJourFile(file, nouvelEtat), etatsSuivants);
    if (!continuer) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#6200EE', '#03DAC5', '#FFD700', '#00BFA5', '#E91E63'],
        });
      } catch {
        // ignore
      }
    }
  };

  // Raccourcis clavier comme dans Anki : Espace / Entrée retourne la carte,
  // puis 1 à 4 donnent la note.
  const noteParTouche = useRef(handleSrsGrade);
  useEffect(() => {
    noteParTouche.current = handleSrsGrade;
  });
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        setIsFlipped(true);
        return;
      }
      const notes: Record<string, Note> = { Digit1: 'again', Digit2: 'hard', Digit3: 'good', Digit4: 'easy' };
      if (notes[e.code]) {
        e.preventDefault();
        noteParTouche.current(notes[e.code]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Chargement des révisions
  if (!etats) {
    return (
      <div className="nixtio-card p-8 text-center max-w-xl mx-auto bg-white dark:bg-[#1E1E28] border border-[#6200EE]/20 animate-fadeIn">
        <RotateCw className="w-6 h-6 mx-auto animate-spin text-[#6200EE] dark:text-[#BB86FC]" />
        <p className="text-xs font-bold text-[#757575] dark:text-[#A0A0A0] mt-3">Chargement de vos révisions…</p>
      </div>
    );
  }

  if (sessionCompleted || !currentWord) {
    const nbEtudiees = notesSession.length;
    const nbOubliees = notesSession.filter((n) => n === 'again').length;
    const apprentissageEnAttente = file ? file.apprentissage.length : 0;

    return (
      <div className="nixtio-card p-6 sm:p-10 text-center max-w-xl mx-auto space-y-6 bg-white dark:bg-[#1E1E28] border border-[#6200EE]/30 dark:border-[#6200EE]/40 shadow-xl animate-fadeIn">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#6200EE] to-[#3700B3] text-white flex items-center justify-center mx-auto shadow-md shadow-[#6200EE]/30">
          <Trophy className="w-8 h-8 text-[#FFC107] animate-bounce" />
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6200EE] dark:text-[#BB86FC]">
            {nbEtudiees > 0 ? 'Session terminée !' : 'Rien à réviser pour le moment'}
          </span>
          <h3 className="font-display font-black text-2xl sm:text-3xl text-[#212121] dark:text-[#F5F5F5] mt-1">
            {nbEtudiees > 0 ? `Félicitations${userName ? `, ${userName}` : ''} 🎉` : 'Vous êtes à jour 👏'}
          </h3>
          <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] mt-1">
            {nbEtudiees > 0
              ? `Vous avez terminé les cartes prévues aujourd'hui dans « ${themeTitle} ».`
              : words.length === 0
                ? `Le paquet « ${themeTitle} » ne contient encore aucune carte.`
                : `Aucune carte n'est due dans « ${themeTitle} » et la limite de nouvelles cartes du jour est atteinte (modifiable dans Mon Compte).`}
          </p>
          {apprentissageEnAttente > 0 && (
            <p className="text-xs font-bold text-[#E53935] dark:text-[#FF8A65] mt-2">
              {apprentissageEnAttente} carte{apprentissageEnAttente > 1 ? 's' : ''} en apprentissage à revoir dans quelques minutes.
            </p>
          )}
          {prochaineEcheance && apprentissageEnAttente === 0 && (
            <p className="text-xs font-bold text-[#00796B] dark:text-[#03DAC5] mt-2">
              Prochaine révision dans {libelleDelai(new Date(), prochaineEcheance)}.
            </p>
          )}
        </div>

        {nbEtudiees > 0 && (
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            <div className="p-3 rounded-2xl bg-[#00897B]/10 border border-[#00897B]/20 text-[#00796B] dark:text-[#03DAC5]">
              <div className="text-2xl font-black font-display">{nbEtudiees}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider">Cartes étudiées</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#E53935]/10 border border-[#E53935]/20 text-[#E53935] dark:text-[#FF8A65]">
              <div className="text-2xl font-black font-display">{nbOubliees}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider">« À revoir »</div>
            </div>
          </div>
        )}

        {onFinish && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={onFinish}
              type="button"
              className="px-6 py-2.5 rounded-full bg-[#6200EE] hover:bg-[#3700B3] text-white text-xs font-bold shadow-md shadow-[#6200EE]/25 active:scale-95 transition-all btn-press cursor-pointer"
            >
              Retour au vocabulaire
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg sm:max-w-xl mx-auto space-y-3.5 animate-fadeIn">
      {/* En-tête : paquet et compteurs Anki (nouvelles / apprentissage / à revoir) */}
      <div className="flex items-center justify-between gap-3 px-1">
        <span className="text-xs font-extrabold text-[#6200EE] dark:text-[#BB86FC] uppercase tracking-wider truncate min-w-0">
          {themeTitle}
        </span>

        <div className="flex items-center gap-2.5 shrink-0 text-xs font-black tabular-nums">
          <span className="text-[#0288D1]" title="Nouvelles cartes">{nombres.nouvelles}</span>
          <span className="text-[#E53935]" title="En apprentissage">{nombres.apprentissage}</span>
          <span className="text-[#00897B]" title="Révisions dues">{nombres.revisions}</span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full h-2 rounded-full bg-[#E0E0E0] dark:bg-[#2D2D2D] overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#6200EE] to-[#03DAC5] rounded-full transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* 3D Flip Card Container (Mobile & Desktop Cross-Browser Guaranteed) */}
      <div
        className="perspective-container relative w-full h-[350px] sm:h-[390px] cursor-pointer select-none touch-manipulation"
        onClick={() => setIsFlipped(true)}
      >
        <div
          className={`transform-3d-card w-full h-full relative ${
            isFlipped ? '[transform:rotateY(180deg)]' : '[transform:rotateY(0deg)]'
          }`}
        >
          {/* ================= RECTO (FRONT) ================= */}
          <div
            className={`flashcard-face flashcard-front absolute inset-0 w-full h-full rounded-3xl p-5 sm:p-8 flex flex-col justify-between bg-white dark:bg-[#1E1E28] border border-[#6200EE]/25 dark:border-[#6200EE]/35 shadow-xl shadow-[#6200EE]/08 ${
              isFlipped ? 'pointer-events-none opacity-0 sm:opacity-100' : 'pointer-events-auto opacity-100 z-10'
            }`}
          >
            {/* Top Bar : Abréviation grammaticale épurée & Bouton Audio */}
            <div className="flex items-center justify-between">
              {grammarAbbr ? (
                <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-[#6200EE]/10 dark:bg-[#6200EE]/25 text-[#6200EE] dark:text-[#BB86FC] border border-[#6200EE]/20 shadow-2xs">
                  {grammarAbbr}
                </span>
              ) : (
                <span />
              )}

              {faceAvant !== 'french' && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  playAudio(currentWord.hanzi);
                }}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition-all btn-press cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-[#6200EE] text-white scale-95 animate-pulse'
                    : 'bg-[#6200EE]/10 text-[#6200EE] dark:bg-[#6200EE]/20 dark:text-[#BB86FC] hover:bg-[#6200EE] hover:text-white'
                }`}
                title="Écouter la prononciation"
              >
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              )}
            </div>

            {/* Center Display (100% Perfectly Centered) */}
            <div className="text-center my-auto flex flex-col items-center justify-center">
              {faceAvant === 'hanzi' && (
                <h2 className="font-hanzi font-black text-5xl sm:text-7xl text-[#212121] dark:text-[#F5F5F5] tracking-tight leading-none drop-shadow-xs">
                  {currentWord.hanzi}
                </h2>
              )}
              {faceAvant === 'pinyin' && (
                <h2 className="font-pinyin font-black text-4xl sm:text-6xl text-[#6200EE] dark:text-[#03DAC5] tracking-wide leading-tight">
                  {currentWord.pinyin}
                </h2>
              )}
              {faceAvant === 'french' && (
                <h2 className="font-display font-black text-2xl sm:text-4xl text-[#212121] dark:text-[#F5F5F5] tracking-tight leading-tight text-center">
                  {currentWord.french}
                </h2>
              )}
              <p className="text-xs text-[#757575] dark:text-[#A0A0A0] mt-4 sm:mt-5 font-medium flex items-center justify-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 animate-spin-slow text-[#6200EE] dark:text-[#03DAC5]" />
                <span>{INDICE_RETOURNEMENT[faceAvant]}</span>
              </p>
            </div>

            {/* Bottom Subtle Flip Hint */}
            <div className="flex items-center justify-center text-[11px] font-bold text-[#6200EE] dark:text-[#03DAC5] opacity-80">
              <span>Retourner la carte ➔</span>
            </div>
          </div>

          {/* ================= VERSO (BACK) ================= */}
          <div
            className={`flashcard-face flashcard-back absolute inset-0 w-full h-full rounded-3xl p-5 sm:p-8 flex flex-col justify-between bg-white dark:bg-[#1E1E28] border border-[#03DAC5]/35 dark:border-[#03DAC5]/45 shadow-xl shadow-[#03DAC5]/08 ${
              isFlipped ? 'pointer-events-auto opacity-100 z-10' : 'pointer-events-none opacity-0 sm:opacity-100'
            }`}
          >
            {/* Top Bar with Audio */}
            <div className="flex items-center justify-between">
              {grammarAbbr ? (
                <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-[#03DAC5]/15 text-[#00796B] dark:text-[#03DAC5] border border-[#03DAC5]/25 shadow-2xs">
                  {grammarAbbr}
                </span>
              ) : (
                <span />
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (verifiedExample) {
                    playAudio(verifiedExample.hanzi, 0.82);
                  } else {
                    playAudio(currentWord.hanzi, 0.85);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#6200EE]/10 text-[#6200EE] dark:bg-[#6200EE]/20 dark:text-[#BB86FC] text-xs font-bold hover:bg-[#6200EE] hover:text-white transition-colors btn-press cursor-pointer"
                title={verifiedExample ? 'Écouter la phrase d’exemple' : 'Écouter le mot'}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{verifiedExample ? 'Audio Phrase' : 'Audio'}</span>
              </button>
            </div>

            {/* Center Content (100% Perfectly Centered) */}
            <div className="space-y-2 my-auto flex flex-col items-center justify-center text-center">
              {/* Hanzi */}
              <h3 className="font-hanzi font-black text-3xl sm:text-5xl text-[#212121] dark:text-[#F5F5F5] leading-none">
                {currentWord.hanzi}
              </h3>

              {/* Pinyin et traduction : toujours affichés, c'est la réponse de la carte */}
              <span className="font-pinyin font-bold text-lg sm:text-2xl text-[#6200EE] dark:text-[#03DAC5] tracking-wide">
                {currentWord.pinyin}
              </span>

              <p className="font-bold text-sm sm:text-lg text-[#212121] dark:text-[#F5F5F5] leading-snug">
                {currentWord.french}
              </p>

              {/* Verified Example Sentence */}
              {showExampleSentence && verifiedExample && (
                <div className="p-2.5 sm:p-3 rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/5 dark:border-white/5 space-y-0.5 max-w-md mx-auto mt-0.5">
                  <div className="font-hanzi text-xs font-bold text-[#212121] dark:text-[#F5F5F5]">
                    {verifiedExample.hanzi}
                  </div>
                  {showPinyin && verifiedExample.pinyin && (
                    <div className="font-pinyin text-[11px] text-[#6200EE] dark:text-[#03DAC5] font-medium">
                      {verifiedExample.pinyin}
                    </div>
                  )}
                  {showFrenchTranslation && verifiedExample.french && (
                    <div className="text-[10.5px] sm:text-[11px] text-[#757575] dark:text-[#A0A0A0] italic">
                      « {verifiedExample.french} »
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Flip Hint */}
            <div className="flex items-center justify-center text-[10px] font-bold text-[#757575] dark:text-[#9E9E9E] opacity-70">
              <span>Touchez pour retourner</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notation : d'abord « Afficher la réponse », puis les 4 notes avec le délai qu'elles donneraient (comme Anki) */}
      {!isFlipped ? (
        <button
          onClick={() => setIsFlipped(true)}
          type="button"
          className="w-full p-3.5 rounded-2xl bg-[#6200EE] hover:bg-[#3700B3] text-white font-bold text-sm shadow-md shadow-[#6200EE]/25 active:scale-[0.98] transition-all btn-press cursor-pointer"
        >
          Afficher la réponse
        </button>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {BOUTONS_NOTES.map((b) => (
            <button
              key={b.note}
              onClick={() => handleSrsGrade(b.note)}
              type="button"
              className={`p-3 rounded-2xl font-bold text-xs flex flex-col items-center gap-0.5 active:scale-95 transition-all shadow-2xs group btn-press cursor-pointer ${b.classes}`}
            >
              <span className="group-hover:scale-110 transition-transform">{b.libelle}</span>
              <span className="text-[10px] opacity-85 font-semibold">{apercus?.[b.note] ?? ''}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
