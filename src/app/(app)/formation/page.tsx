'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  GraduationCap,
  Play,
  Pause,
  CheckCircle,
  Lock,
  Clock,
  BookOpen,
  Sparkles,
  ArrowLeft,
  FileText,
  Award,
  ChevronRight,
  Download,
  HelpCircle,
  Check,
  Layers,
  UserCheck,
  Tv,
  RotateCcw,
  MessageSquare,
  Send,
  ThumbsUp,
  CornerDownRight,
  User
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { initialCourses, CourseModule, LessonItem } from '@/lib/mock/coursesData';
import { initialCourseComments, CourseComment } from '@/lib/mock/commentsData';
import { useAuth } from '@/lib/auth/AuthContext';
import { usePreferences } from '@/context/PreferencesContext';
import { fetchCourseProgress, toggleLessonCompletedInDb } from '@/lib/services/progressService';

function FormationContent() {
  const { user } = useAuth();
  const { userAvatar, userName } = usePreferences();
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<CourseModule[]>(initialCourses);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string>('');
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Comments state
  const [comments, setComments] = useState<CourseComment[]>(initialCourseComments);
  const [newCommentText, setNewCommentText] = useState('');
  const [activeReplyBoxId, setActiveReplyBoxId] = useState<string | null>(null);
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});

  // Load course progress from Supabase on mount
  useEffect(() => {
    async function loadProgress() {
      if (user) {
        const dbProgress = await fetchCourseProgress();
        if (Object.keys(dbProgress).length > 0) {
          setCourses((prevCourses) =>
            prevCourses.map((course) => {
              const updatedLessons = course.lessons.map((lesson) => {
                const key = `${course.id}_${lesson.id}`;
                if (dbProgress[key] !== undefined) {
                  return { ...lesson, isCompleted: dbProgress[key] };
                }
                return lesson;
              });
              const completedCount = updatedLessons.filter((l) => l.isCompleted).length;
              const newProgress = Math.round((completedCount / updatedLessons.length) * 100);

              return {
                ...course,
                lessons: updatedLessons,
                completedLessons: completedCount,
                progress: newProgress,
              };
            })
          );
        }
      }
    }

    loadProgress();
  }, [user]);

  // Restore selected course & lesson from URL params or sessionStorage on F5 / Refresh
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const courseParam = urlParams.get('course') || searchParams.get('course') || sessionStorage.getItem('chinoislingo_active_course_id');
    const lessonParam = urlParams.get('lesson') || searchParams.get('lesson') || sessionStorage.getItem('chinoislingo_active_lesson_id');

    if (courseParam) {
      const found = courses.find((c) => c.id === courseParam);
      if (found) {
        setActiveCourseId(found.id);
        if (lessonParam && found.lessons.some((l) => l.id === lessonParam)) {
          setActiveLessonId(lessonParam);
        } else {
          setActiveLessonId(found.lessons[0].id);
        }
      }
    }
  }, [searchParams, courses]);

  // Handle browser Back / Forward buttons without reloading
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const courseId = params.get('course');
      const lessonId = params.get('lesson');

      if (courseId) {
        const found = courses.find((c) => c.id === courseId);
        if (found) {
          setActiveCourseId(found.id);
          setActiveLessonId(lessonId && found.lessons.some((l) => l.id === lessonId) ? lessonId : found.lessons[0].id);
        }
      } else {
        setActiveCourseId(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [courses]);

  const activeCourse = courses.find((c) => c.id === activeCourseId) || null;
  const currentLesson = activeCourse?.lessons.find((l) => l.id === activeLessonId) || activeCourse?.lessons[0];

  const handleSelectCourse = (course: CourseModule) => {
    setActiveCourseId(course.id);
    setActiveLessonId(course.lessons[0].id);
    setIsPlayingVideo(false);
    setSelectedQuizOption(null);
    setQuizSubmitted(false);

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('course', course.id);
      url.searchParams.set('lesson', course.lessons[0].id);
      window.history.pushState({ courseId: course.id, lessonId: course.lessons[0].id }, '', url.toString());
      try {
        sessionStorage.setItem('chinoislingo_active_course_id', course.id);
        sessionStorage.setItem('chinoislingo_active_lesson_id', course.lessons[0].id);
      } catch {}
    }
  };

  const handleSelectLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setIsPlayingVideo(false);

    if (typeof window !== 'undefined' && activeCourse) {
      const url = new URL(window.location.href);
      url.searchParams.set('course', activeCourse.id);
      url.searchParams.set('lesson', lessonId);
      window.history.pushState({ courseId: activeCourse.id, lessonId }, '', url.toString());
      try {
        sessionStorage.setItem('chinoislingo_active_lesson_id', lessonId);
      } catch {}
    }
  };

  const handleBackToCatalogue = () => {
    setActiveCourseId(null);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('course');
      url.searchParams.delete('lesson');
      window.history.pushState({}, '', url.toString());
      try {
        sessionStorage.removeItem('chinoislingo_active_course_id');
        sessionStorage.removeItem('chinoislingo_active_lesson_id');
      } catch {}
    }
  };

  const handleToggleLessonComplete = async (lessonId: string) => {
    if (!activeCourse) return;

    let targetNextState = false;

    setCourses((prevCourses) =>
      prevCourses.map((c) => {
        if (c.id !== activeCourse.id) return c;

        let justCompleted = false;
        const updatedLessons = c.lessons.map((l) => {
          if (l.id === lessonId) {
            const nextState = !l.isCompleted;
            targetNextState = nextState;
            if (nextState) justCompleted = true;
            return { ...l, isCompleted: nextState };
          }
          return l;
        });

        // Global Celebration rule: confetti, haptics & glitter animation on completion
        if (justCompleted) {
          if (typeof window !== 'undefined' && 'vibrate' in navigator) {
            try {
              navigator.vibrate([40, 60, 40]);
            } catch {
              // ignore
            }
          }
          try {
            confetti({
              particleCount: 85,
              spread: 85,
              origin: { y: 0.6 },
              colors: ['#6200EE', '#03DAC5', '#FFB74D', '#E91E63', '#E53935'],
            });
          } catch {
            // ignore
          }
        }

        const completedCount = updatedLessons.filter((l) => l.isCompleted).length;
        const newProgress = Math.round((completedCount / updatedLessons.length) * 100);

        return {
          ...c,
          lessons: updatedLessons,
          completedLessons: completedCount,
          progress: newProgress,
        };
      })
    );

    if (user && activeCourse) {
      await toggleLessonCompletedInDb(activeCourse.id, lessonId, !targetNextState);
    }
  };

  // Comments Handlers
  const currentLessonComments = comments.filter(
    (c) => c.courseId === activeCourseId && c.lessonId === currentLesson?.id
  );

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeCourse || !currentLesson) return;

    const newComm: CourseComment = {
      id: `comm_${Date.now()}`,
      courseId: activeCourse.id,
      lessonId: currentLesson.id,
      authorName: userName || (user?.email ? user.email.split('@')[0] : 'Espoir Chinois'),
      authorAvatar: userAvatar || '/espoir-chinois.jpg',
      content: newCommentText.trim(),
      timestamp: 'À l’instant',
      likes: 0,
    };

    setComments((prev) => [newComm, ...prev]);
    setNewCommentText('');
  };

  const handleAddReply = (commentId: string) => {
    const text = replyTextMap[commentId];
    if (!text || !text.trim() || !activeCourse || !currentLesson) return;

    const newReply: CourseComment = {
      id: `reply_${Date.now()}`,
      courseId: activeCourse.id,
      lessonId: currentLesson.id,
      authorName: userName || (user?.email ? user.email.split('@')[0] : 'Espoir Chinois'),
      authorAvatar: userAvatar || '/espoir-chinois.jpg',
      content: text.trim(),
      timestamp: 'À l’instant',
      likes: 0,
    };

    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            replies: [...(c.replies || []), newReply],
          };
        }
        return c;
      })
    );

    setReplyTextMap((prev) => ({ ...prev, [commentId]: '' }));
    setActiveReplyBoxId(null);
  };

  const handleLikeComment = (commentId: string, isReply = false, parentId?: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (!isReply && c.id === commentId) {
          return { ...c, likes: c.likes + 1 };
        }
        if (isReply && parentId && c.id === parentId && c.replies) {
          return {
            ...c,
            replies: c.replies.map((r) => (r.id === commentId ? { ...r, likes: r.likes + 1 } : r)),
          };
        }
        return c;
      })
    );
  };

  return (
    <div className="space-y-6 w-full max-w-full min-w-0 animate-fadeIn pb-12">

      {/* ========================================================================= */}
      {/* VIEW A: FULL-SCREEN VIDEO CLASSROOM (WHEN A FORMATION IS SELECTED)        */}
      {/* ========================================================================= */}
      {activeCourse && currentLesson ? (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Bar with Back Button & Formation Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 p-4 sm:p-6 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-sm">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button
                onClick={handleBackToCatalogue}
                type="button"
                className="w-10 h-10 rounded-2xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333333] text-[#212121] dark:text-[#F5F5F5] flex items-center justify-center hover:bg-[#6200EE] hover:text-white transition-colors btn-press shrink-0 shadow-2xs cursor-pointer"
                title="Retour au catalogue des formations"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="min-w-0 flex-1">
                <h1 className="font-display font-black text-base sm:text-xl lg:text-2xl text-[#212121] dark:text-[#F5F5F5] tracking-tight leading-snug break-words">
                  {activeCourse.title}
                </h1>
              </div>
            </div>

            {/* Course Progress Indicator */}
            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E0E0E0]/60 dark:border-[#2D2D2D]">
              <div className="text-left sm:text-right">
                <span className="text-[10px] font-bold uppercase text-[#757575] dark:text-[#A0A0A0] block">Progression</span>
                <span className="text-xs font-black text-[#6200EE] dark:text-[#BB86FC] font-display">
                  {activeCourse.completedLessons} / {activeCourse.totalLessons} leçons ({activeCourse.progress}%)
                </span>
              </div>
              <div className="w-24 sm:w-20 h-2.5 sm:h-2 rounded-full bg-[#E0E0E0] dark:bg-[#2D2D2D] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#6200EE] to-[#00897B] rounded-full transition-all duration-500"
                  style={{ width: `${activeCourse.progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Main Grid: Video Player + Chapter Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left 2 Cols: Interactive Video Player */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video Player Card */}
              <div className="nixtio-card overflow-hidden bg-black text-white relative rounded-3xl border border-neutral-800 shadow-xl">
                <div className="aspect-video w-full relative flex items-center justify-center bg-black">
                  {currentLesson.youtubeId ? (
                    isPlayingVideo ? (
                      <iframe
                        key={currentLesson.youtubeId}
                        src={`https://www.youtube.com/embed/${currentLesson.youtubeId}?autoplay=1&playsinline=1&rel=0&modestbranding=1&controls=1&enablejsapi=1`}
                        title={currentLesson.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full border-0 animate-fadeIn"
                      />
                    ) : (
                      <div
                        onClick={() => setIsPlayingVideo(true)}
                        className="relative w-full h-full group cursor-pointer overflow-hidden flex items-center justify-center bg-black select-none"
                      >
                        {/* High Quality Thumbnail Cover Image */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            activeCourse.thumbnailUrl ||
                            `https://img.youtube.com/vi/${currentLesson.youtubeId}/hqdefault.jpg`
                          }
                          alt={currentLesson.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                        />

                        {/* Subtle Dark Gradient Overlay */}
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />

                        {/* Centered ChinoisLingo Brand Play Button (Signature Violet #6200EE) */}
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#6200EE] hover:bg-[#4A00B0] text-white flex items-center justify-center group-hover:scale-110 active:scale-95 transition-all duration-300 shadow-xl shadow-[#6200EE]/45 border-2 border-white/40 cursor-pointer btn-press">
                            <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-white text-white ml-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-500 text-sm">
                      Vidéo bientôt disponible
                    </div>
                  )}
                </div>

                {/* Video Info Bottom Bar */}
                <div className="p-4 bg-[#181818] border-t border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <span className="text-xs sm:text-sm font-bold text-white leading-snug break-words block">
                      {currentLesson.title}
                    </span>
                    <span className="text-[11px] text-[#A0A0A0] mt-0.5 block">
                      Durée : {currentLesson.duration}
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleLessonComplete(currentLesson.id)}
                    type="button"
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all btn-press shrink-0 self-start sm:self-auto cursor-pointer ${currentLesson.isCompleted
                        ? 'bg-[#E53935] text-white shadow-xs hover:bg-[#D32F2F]'
                        : 'bg-[#6200EE] hover:bg-[#3700B3] text-white shadow-xs'
                      }`}
                  >
                    <span>{currentLesson.isCompleted ? '✓ Terminé' : 'Marquer comme terminé'}</span>
                  </button>
                </div>
              </div>

              {/* Lesson Details Card */}
              <div className="nixtio-card p-6 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] rounded-3xl space-y-4 shadow-xs">
                {currentLesson.description && (
                  <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] leading-relaxed">
                    {currentLesson.description}
                  </p>
                )}

                {currentLesson.keyPoints && (
                  <div className="p-4 rounded-2xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333333] space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#212121] dark:text-[#F5F5F5]">
                      <FileText className="w-4 h-4 text-[#6200EE]" />
                      <span>Points clés abordés :</span>
                    </div>
                    <p className="text-xs text-[#757575] dark:text-[#A0A0A0] leading-relaxed pl-6">
                      {currentLesson.keyPoints}
                    </p>
                  </div>
                )}

                {currentLesson.tip && (
                  <div className="p-4 rounded-2xl bg-[#03DAC5]/10 dark:bg-[#03DAC5]/15 border border-[#03DAC5]/25 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#004D40] dark:text-[#03DAC5]">
                      <Sparkles className="w-4 h-4 text-[#00897B] dark:text-[#03DAC5]" />
                      <span>Conseil d’Espoir Chinois :</span>
                    </div>
                    <p className="text-xs text-[#004D40]/90 dark:text-[#E0F2F1] leading-relaxed pl-6 font-medium">
                      {currentLesson.tip}
                    </p>
                  </div>
                )}
              </div>

              {/* ================================================================= */}
              {/* MODULES DE FORMATION SUR MOBILE (VISIBLE DIRECTEMENT SOUS LA VIDÉO) */}
              {/* ================================================================= */}
              <div className="lg:hidden nixtio-card p-5 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] rounded-3xl space-y-3 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#E0E0E0]/60 dark:border-[#2D2D2D]">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#6200EE]" />
                    <span className="text-xs font-black text-[#212121] dark:text-[#F5F5F5] uppercase tracking-wider">
                      Toutes les Leçons ({activeCourse.totalLessons})
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-[#6200EE] dark:text-[#03DAC5]">
                    {activeCourse.completedLessons} / {activeCourse.totalLessons} terminées
                  </span>
                </div>

                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {activeCourse.lessons.map((lesson) => {
                    const isActive = lesson.id === currentLesson.id;

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          if (!lesson.isLocked) {
                            handleSelectLesson(lesson.id);
                          }
                        }}
                        type="button"
                        disabled={lesson.isLocked}
                        className={`w-full p-3 rounded-2xl flex items-center justify-between text-left transition-all btn-press cursor-pointer ${isActive
                            ? 'bg-[#6200EE] text-white shadow-md shadow-[#6200EE]/20'
                            : lesson.isCompleted
                              ? 'bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333333] text-[#212121] dark:text-[#F5F5F5]'
                              : 'bg-black/[0.02] dark:bg-white/[0.02] text-[#757575] hover:bg-black/[0.05] dark:hover:bg-white/[0.05]'
                          }`}
                      >
                        <div className="flex items-center gap-2.5 pr-2 min-w-0 flex-1">
                          {lesson.isCompleted ? (
                            <CheckCircle className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#00897B] dark:text-[#03DAC5]'}`} />
                          ) : lesson.isLocked ? (
                            <Lock className="w-4 h-4 shrink-0 text-[#757575]" />
                          ) : (
                            <Play className={`w-4 h-4 shrink-0 ${isActive ? 'text-white fill-white' : 'text-[#6200EE]'}`} />
                          )}
                          <span className="text-xs font-bold leading-snug break-words">
                            {lesson.title}
                          </span>
                        </div>

                        <span className={`text-[10px] font-mono shrink-0 ml-2 ${isActive ? 'text-white/90' : 'text-[#757575]'}`}>
                          {lesson.duration}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ================================================================= */}
              {/* SECTION COMMENTAIRES ÉPURÉE                                        */}
              {/* ================================================================= */}
              <div className="nixtio-card p-4 sm:p-6 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] rounded-3xl space-y-4 shadow-xs">
                {/* New Comment Input Box */}
                <form onSubmit={handleAddComment} className="space-y-3">
                  <div className="flex items-start gap-2.5 sm:gap-3">
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt="Votre profil"
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-[#6200EE]/30 shrink-0 shadow-2xs mt-0.5"
                      />
                    ) : (
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#6200EE]/15 text-[#6200EE] dark:text-[#BB86FC] flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                        {userName ? userName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                      </div>
                    )}

                    <div className="flex-1 space-y-2">
                      <textarea
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder="Commentaire..."
                        rows={2}
                        className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333333] text-[16px] sm:text-xs text-[#212121] dark:text-[#F5F5F5] placeholder-[#9E9E9E] focus:outline-none focus:border-[#6200EE] dark:focus:border-[#BB86FC] transition-all resize-none"
                      />

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={!newCommentText.trim()}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#6200EE] hover:bg-[#3700B3] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-xs btn-press cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Publier</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-4 pt-2">
                  {currentLessonComments.length === 0 ? (
                    <div className="p-6 text-center rounded-2xl bg-black/[0.01] dark:bg-white/[0.01] border border-dashed border-[#E0E0E0] dark:border-[#333333] space-y-2">
                      <MessageSquare className="w-8 h-8 text-[#9E9E9E] mx-auto opacity-50" />
                      <p className="text-xs font-bold text-[#757575] dark:text-[#A0A0A0]">
                        Aucun commentaire pour l'instant sur cette leçon.
                      </p>
                      <p className="text-[11px] text-[#9E9E9E] dark:text-[#757575]">
                        Soyez le premier à partager votre avis ou poser une question à Espoir Chinois !
                      </p>
                    </div>
                  ) : (
                    currentLessonComments.map((comment) => (
                      <div
                        key={comment.id}
                        className="p-4 rounded-2xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0]/80 dark:border-[#333333] space-y-3"
                      >
                        {/* Author Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={comment.authorAvatar}
                              alt={comment.authorName}
                              className="w-9 h-9 rounded-full object-cover border border-white/20 shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-xs text-[#212121] dark:text-[#F5F5F5]">
                                  {comment.authorName}
                                </span>
                                {comment.isInstructor && (
                                  <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#6200EE] text-white shadow-2xs">
                                    Formateur
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-[#9E9E9E] dark:text-[#757575]">
                                {comment.timestamp}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Comment Content */}
                        <p className="text-xs sm:text-sm text-[#212121] dark:text-[#E0E0E0] leading-relaxed pl-1">
                          {comment.content}
                        </p>

                        {/* Action buttons (Like & Reply) */}
                        <div className="flex items-center gap-3 pt-1 pl-1">
                          <button
                            onClick={() => handleLikeComment(comment.id)}
                            type="button"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#757575] hover:text-[#6200EE] dark:text-[#A0A0A0] dark:hover:text-[#BB86FC] transition-colors"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>{comment.likes > 0 ? comment.likes : 'J\'aime'}</span>
                          </button>

                          <button
                            onClick={() =>
                              setActiveReplyBoxId(activeReplyBoxId === comment.id ? null : comment.id)
                            }
                            type="button"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#757575] hover:text-[#6200EE] dark:text-[#A0A0A0] dark:hover:text-[#BB86FC] transition-colors"
                          >
                            <CornerDownRight className="w-3.5 h-3.5" />
                            <span>Répondre</span>
                          </button>
                        </div>

                        {/* Reply Form */}
                        {activeReplyBoxId === comment.id && (
                          <div className="pt-2 pl-4 border-l-2 border-[#6200EE]/30 space-y-2">
                            <input
                              type="text"
                              value={replyTextMap[comment.id] || ''}
                              onChange={(e) =>
                                setReplyTextMap((prev) => ({
                                  ...prev,
                                  [comment.id]: e.target.value,
                                }))
                              }
                              placeholder="Écrivez une réponse..."
                              className="w-full px-3 py-2 rounded-xl white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#333333] text-xs text-[#212121] dark:text-[#F5F5F5] focus:outline-none focus:border-[#6200EE]"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setActiveReplyBoxId(null)}
                                type="button"
                                className="px-3 py-1 rounded-full text-xs text-[#757575] hover:text-[#212121]"
                              >
                                Annuler
                              </button>
                              <button
                                onClick={() => handleAddReply(comment.id)}
                                type="button"
                                className="px-3 py-1 rounded-full bg-[#6200EE] text-white text-xs font-bold btn-press"
                              >
                                Répondre
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Replies Thread */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="space-y-2 pt-2 pl-4 border-l-2 border-[#6200EE]/20 mt-2">
                            {comment.replies.map((reply) => (
                              <div
                                key={reply.id}
                                className={`p-3 rounded-xl ${
                                  reply.isInstructor
                                    ? 'bg-[#6200EE]/5 dark:bg-[#6200EE]/15 border border-[#6200EE]/25'
                                    : 'bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0]/60 dark:border-[#333333]'
                                } space-y-1.5`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={reply.authorAvatar}
                                      alt={reply.authorName}
                                      className="w-7 h-7 rounded-full object-cover border border-[#6200EE]/30"
                                    />
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-xs text-[#212121] dark:text-[#F5F5F5]">
                                        {reply.authorName}
                                      </span>
                                      {reply.isInstructor && (
                                        <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#6200EE] text-white shadow-2xs">
                                          Formateur
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <span className="text-[10px] text-[#9E9E9E] dark:text-[#757575]">
                                    {reply.timestamp}
                                  </span>
                                </div>

                                <p className="text-xs text-[#212121] dark:text-[#E0E0E0] leading-relaxed pl-1">
                                  {reply.content}
                                </p>

                                <div className="pt-1 pl-1">
                                  <button
                                    onClick={() => handleLikeComment(reply.id, true, comment.id)}
                                    type="button"
                                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#757575] hover:text-[#6200EE] transition-colors"
                                  >
                                    <ThumbsUp className="w-3 h-3" />
                                    <span>{reply.likes > 0 ? reply.likes : 'J\'aime'}</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right 1 Col: Curriculum Chapters */}
            <div className="hidden lg:block">
              <div className="nixtio-card p-5 sm:p-6 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] rounded-3xl space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#212121] dark:text-[#F5F5F5] uppercase tracking-wider">
                    Modules de la Formation
                  </span>
                  <span className="text-[11px] font-bold text-[#757575] dark:text-[#A0A0A0]">
                    {activeCourse.completedLessons} / {activeCourse.totalLessons} terminés
                  </span>
                </div>

                <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
                  {activeCourse.lessons.map((lesson) => {
                    const isActive = lesson.id === currentLesson.id;

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          if (!lesson.isLocked) {
                            handleSelectLesson(lesson.id);
                          }
                        }}
                        type="button"
                        disabled={lesson.isLocked}
                        className={`w-full p-3.5 rounded-2xl flex items-center justify-between text-left transition-all btn-press ${isActive
                            ? 'bg-[#6200EE] text-white shadow-md shadow-[#6200EE]/20'
                            : lesson.isCompleted
                              ? 'bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333333] text-[#212121] dark:text-[#F5F5F5]'
                              : 'bg-black/[0.02] dark:bg-white/[0.02] text-[#757575] hover:bg-black/[0.05] dark:hover:bg-white/[0.05]'
                          }`}
                      >
                        <div className="flex items-center gap-3 pr-2 min-w-0">
                          {lesson.isCompleted ? (
                            <CheckCircle className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#00897B] dark:text-[#03DAC5]'}`} />
                          ) : lesson.isLocked ? (
                            <Lock className="w-4 h-4 shrink-0 text-[#757575]" />
                          ) : (
                            <Play className={`w-4 h-4 shrink-0 ${isActive ? 'text-white fill-white' : 'text-[#6200EE]'}`} />
                          )}
                          <span className="text-xs font-bold leading-snug line-clamp-2">
                            {lesson.title}
                          </span>
                        </div>

                        <span className={`text-[11px] font-mono shrink-0 ${isActive ? 'text-white/90' : 'text-[#757575]'}`}>
                          {lesson.duration}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* DÉTAILS DE LA FORMATION (POSITIONNÉS COMPLÈTEMENT EN BAS) */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-xs space-y-3">
            {/* 3 Badges on a Single Responsive Line */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-0.5">
              <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#6200EE]/10 dark:bg-[#6200EE]/20 text-[#6200EE] dark:text-[#BB86FC] border border-[#6200EE]/25 shrink-0 whitespace-nowrap">
                {activeCourse.category}
              </span>
              <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#03DAC5]/15 text-[#00897B] dark:text-[#03DAC5] shrink-0 whitespace-nowrap">
                {activeCourse.level}
              </span>
              <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#6200EE]/15 text-[#6200EE] dark:text-[#BB86FC] shrink-0 whitespace-nowrap">
                Formateur : {activeCourse.instructor}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] leading-relaxed">
              {activeCourse.description}
            </p>

            {activeCourse.id === 'course_vocabulaire_hsk1_fondamental' && (
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#6200EE]/8 dark:bg-[#6200EE]/15 border border-[#6200EE]/20 mt-3">
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-[#6200EE] dark:text-[#BB86FC]" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-[#212121] dark:text-[#F5F5F5]">
                    Programme Évolutif — Objectif 150 Mots & Expressions HSK 1
                  </p>
                  <p className="text-[#757575] dark:text-[#A0A0A0] leading-relaxed">
                    Cette formation a pour but d’englober l’intégralité des 150 termes officiels du HSK 1. De nouvelles leçons vidéo sont régulièrement ajoutées par Espoir Chinois pour compléter l’ensemble du programme mot par mot.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* VIEW B: FORMATION CATALOG GRID VIEW                                       */
        /* ========================================================================= */
        <div className="space-y-6 animate-fadeIn">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#6200EE]/15 dark:bg-[#6200EE]/25 text-[#6200EE] dark:text-[#BB86FC] flex items-center justify-center shadow-2xs">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6200EE] dark:text-[#BB86FC] px-2.5 py-1 rounded-full bg-[#6200EE]/10 dark:bg-[#6200EE]/20 border border-[#6200EE]/25">
                  Formations & Masterclasses
                </span>
              </div>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-[#212121] dark:text-[#F5F5F5] tracking-tight mt-2">
                Formations
              </h1>
              <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] mt-0.5">
                Masterclasses vidéo et podcasts immersifs animés par Espoir Chinois pour progresser en chinois et réussir ses échanges.
              </p>
            </div>
          </div>

          {/* Formations Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                onClick={() => handleSelectCourse(course)}
                className="nixtio-card overflow-hidden bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] hover:border-[#6200EE] transition-all flex flex-col justify-between group cursor-pointer shadow-xs hover:shadow-lg rounded-3xl"
              >
                <div>
                  {/* Cover Image with Bottom Metadata Bar */}
                  {course.thumbnailUrl && (
                    <div className="relative w-full aspect-video sm:h-52 overflow-hidden bg-neutral-950">
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                      {/* Bottom Overlay: Niveau + Domaine/Sujet + Compteur de leçons (Strictly single horizontal line, flex-nowrap) */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 z-10 flex-nowrap pointer-events-none">
                        <div className="flex items-center gap-1.5 flex-nowrap shrink min-w-0 overflow-hidden">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#03DAC5] text-[#004D40] font-black shadow-xs shrink-0 whitespace-nowrap">
                            {course.level}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-white/95 border border-white/20 shadow-xs truncate whitespace-nowrap">
                            {course.category}
                          </span>
                        </div>

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-white border border-white/15 flex items-center gap-1 shadow-xs shrink-0 whitespace-nowrap">
                          <Play className="w-2.5 h-2.5 fill-white text-white shrink-0" />
                          <span>{course.totalLessons} {course.totalLessons > 1 ? 'leçons' : 'cours'}</span>
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    {!course.thumbnailUrl && (
                      <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#6200EE]/10 dark:bg-[#6200EE]/20 text-[#6200EE] dark:text-[#BB86FC] border border-[#6200EE]/20">
                          {course.category}
                        </span>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#03DAC5]/15 text-[#00897B] dark:text-[#03DAC5]">
                          {course.level}
                        </span>
                      </div>
                    )}

                    <h3 className="font-display font-black text-lg text-[#212121] dark:text-[#F5F5F5] group-hover:text-[#6200EE] dark:group-hover:text-[#BB86FC] transition-colors leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-[#757575] dark:text-[#A0A0A0] mt-2 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="flex items-center gap-2 mt-4 text-xs text-[#757575] dark:text-[#A0A0A0]">
                      <UserCheck className="w-3.5 h-3.5 text-[#6200EE]" />
                      <span className="font-semibold">Formateur : {course.instructor}</span>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-[#E0E0E0]/60 dark:border-[#2D2D2D] space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span className="text-[#757575] dark:text-[#A0A0A0]">
                        {course.completedLessons} / {course.totalLessons} leçons
                      </span>
                      <span className="text-[#6200EE] dark:text-[#BB86FC] font-bold font-display">
                        {course.progress}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#E0E0E0] dark:bg-[#2D2D2D] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#6200EE] transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-full py-2.5 rounded-full bg-[#6200EE] hover:bg-[#3700B3] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm shadow-[#6200EE]/25 transition-all btn-press"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{course.progress > 0 ? 'Continuer la formation' : 'Commencer la formation'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FormationPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-[#757575]">Chargement des formations...</div>}>
      <FormationContent />
    </React.Suspense>
  );
}
