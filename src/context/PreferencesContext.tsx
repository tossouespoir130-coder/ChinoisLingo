'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface PreferencesState {
  showPinyin: boolean;
  setShowPinyin: (val: boolean) => void;
  showFrenchTranslation: boolean;
  setShowFrenchTranslation: (val: boolean) => void;
  toneColoring: boolean;
  setToneColoring: (val: boolean) => void;
  audioSpeed: '0.75' | '1.0' | '1.25' | '1.5';
  setAudioSpeed: (val: '0.75' | '1.0' | '1.25' | '1.5') => void;
  autoPlayAudio: boolean;
  setAutoPlayAudio: (val: boolean) => void;
  cardsPerSession: '5' | '10' | '15' | '20' | '30' | '40' | '50' | '70' | '100' | 'all';
  setCardsPerSession: (val: '5' | '10' | '15' | '20' | '30' | '40' | '50' | '70' | '100' | 'all') => void;
  reviewOrder: 'random' | 'sequential';
  setReviewOrder: (val: 'random' | 'sequential') => void;
  cardFrontFace: 'hanzi' | 'french' | 'random';
  setCardFrontFace: (val: 'hanzi' | 'french' | 'random') => void;
  showExampleSentence: boolean;
  setShowExampleSentence: (val: boolean) => void;
  dailyGoalMinutes: string;
  setDailyGoalMinutes: (val: string) => void;
  dailyReminder: boolean;
  setDailyReminder: (val: boolean) => void;
  publicLeaderboard: boolean;
  setPublicLeaderboard: (val: boolean) => void;
  userAvatar: string;
  setUserAvatar: (val: string) => void;
  userName: string;
  setUserName: (val: string) => void;
}

const PreferencesContext = createContext<PreferencesState | undefined>(undefined);

const STORAGE_KEY = 'chinoislingo_user_preferences';

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [showPinyin, setShowPinyinState] = useState(true);
  const [showFrenchTranslation, setShowFrenchTranslationState] = useState(true);
  const [toneColoring, setToneColoringState] = useState(true);
  const [audioSpeed, setAudioSpeedState] = useState<'0.75' | '1.0' | '1.25' | '1.5'>('1.0');
  const [autoPlayAudio, setAutoPlayAudioState] = useState(true);
  const [cardsPerSession, setCardsPerSessionState] = useState<'5' | '10' | '15' | '20' | '30' | '40' | '50' | '70' | '100' | 'all'>('20');
  const [reviewOrder, setReviewOrderState] = useState<'random' | 'sequential'>('random');
  const [cardFrontFace, setCardFrontFaceState] = useState<'hanzi' | 'french' | 'random'>('random');
  const [showExampleSentence, setShowExampleSentenceState] = useState(true);
  const [dailyGoalMinutes, setDailyGoalMinutesState] = useState('20');
  const [dailyReminder, setDailyReminderState] = useState(true);
  const [publicLeaderboard, setPublicLeaderboardState] = useState(true);
  const [userAvatar, setUserAvatarState] = useState<string>(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
  );
  const [userName, setUserNameState] = useState<string>('Espoir Chinois');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.showPinyin === 'boolean') setShowPinyinState(parsed.showPinyin);
        if (typeof parsed.showFrenchTranslation === 'boolean') setShowFrenchTranslationState(parsed.showFrenchTranslation);
        if (typeof parsed.toneColoring === 'boolean') setToneColoringState(parsed.toneColoring);
        if (parsed.audioSpeed) setAudioSpeedState(parsed.audioSpeed);
        if (typeof parsed.autoPlayAudio === 'boolean') setAutoPlayAudioState(parsed.autoPlayAudio);
        if (parsed.cardsPerSession) setCardsPerSessionState(parsed.cardsPerSession);
        if (parsed.reviewOrder) setReviewOrderState(parsed.reviewOrder);
        if (parsed.cardFrontFace) setCardFrontFaceState(parsed.cardFrontFace);
        if (typeof parsed.showExampleSentence === 'boolean') setShowExampleSentenceState(parsed.showExampleSentence);
        if (parsed.dailyGoalMinutes) setDailyGoalMinutesState(parsed.dailyGoalMinutes);
        if (typeof parsed.dailyReminder === 'boolean') setDailyReminderState(parsed.dailyReminder);
        if (typeof parsed.publicLeaderboard === 'boolean') setPublicLeaderboardState(parsed.publicLeaderboard);
        if (parsed.userAvatar) setUserAvatarState(parsed.userAvatar);
        if (parsed.userName) setUserNameState(parsed.userName);
      }
    } catch {
      // ignore JSON parse error
    }
  }, []);

  // Save to localStorage helper
  const savePreference = (key: string, value: any) => {
    try {
      const current = localStorage.getItem(STORAGE_KEY);
      const parsed = current ? JSON.parse(current) : {};
      parsed[key] = value;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    } catch {
      // ignore storage errors
    }
  };

  const setShowPinyin = (val: boolean) => {
    setShowPinyinState(val);
    savePreference('showPinyin', val);
  };

  const setShowFrenchTranslation = (val: boolean) => {
    setShowFrenchTranslationState(val);
    savePreference('showFrenchTranslation', val);
  };

  const setToneColoring = (val: boolean) => {
    setToneColoringState(val);
    savePreference('toneColoring', val);
  };

  const setAudioSpeed = (val: '0.75' | '1.0' | '1.25' | '1.5') => {
    setAudioSpeedState(val);
    savePreference('audioSpeed', val);
  };

  const setAutoPlayAudio = (val: boolean) => {
    setAutoPlayAudioState(val);
    savePreference('autoPlayAudio', val);
  };

  const setCardsPerSession = (val: '5' | '10' | '15' | '20' | '30' | '40' | '50' | '70' | '100' | 'all') => {
    setCardsPerSessionState(val);
    savePreference('cardsPerSession', val);
  };

  const setReviewOrder = (val: 'random' | 'sequential') => {
    setReviewOrderState(val);
    savePreference('reviewOrder', val);
  };

  const setCardFrontFace = (val: 'hanzi' | 'french' | 'random') => {
    setCardFrontFaceState(val);
    savePreference('cardFrontFace', val);
  };

  const setShowExampleSentence = (val: boolean) => {
    setShowExampleSentenceState(val);
    savePreference('showExampleSentence', val);
  };

  const setDailyGoalMinutes = (val: string) => {
    setDailyGoalMinutesState(val);
    savePreference('dailyGoalMinutes', val);
  };

  const setDailyReminder = (val: boolean) => {
    setDailyReminderState(val);
    savePreference('dailyReminder', val);
  };

  const setPublicLeaderboard = (val: boolean) => {
    setPublicLeaderboardState(val);
    savePreference('publicLeaderboard', val);
  };

  const setUserAvatar = (val: string) => {
    setUserAvatarState(val);
    savePreference('userAvatar', val);
  };

  const setUserName = (val: string) => {
    setUserNameState(val);
    savePreference('userName', val);
  };

  return (
    <PreferencesContext.Provider
      value={{
        showPinyin,
        setShowPinyin,
        showFrenchTranslation,
        setShowFrenchTranslation,
        toneColoring,
        setToneColoring,
        audioSpeed,
        setAudioSpeed,
        autoPlayAudio,
        setAutoPlayAudio,
        cardsPerSession,
        setCardsPerSession,
        reviewOrder,
        setReviewOrder,
        cardFrontFace,
        setCardFrontFace,
        showExampleSentence,
        setShowExampleSentence,
        dailyGoalMinutes,
        setDailyGoalMinutes,
        dailyReminder,
        setDailyReminder,
        publicLeaderboard,
        setPublicLeaderboard,
        userAvatar,
        setUserAvatar,
        userName,
        setUserName,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}
