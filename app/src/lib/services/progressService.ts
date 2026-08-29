import { createClient } from '@/lib/supabase/client';
import { ContentProgress, CourseProgress } from '@/lib/supabase/types';

// ======================= ÉCOUTE & LECTURE =======================

export async function fetchContentProgress(): Promise<Record<string, { isCompleted: boolean; isFavorite: boolean }>> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return {};

  const { data, error } = await supabase
    .from('content_progress')
    .select('content_id, is_completed, is_favorite')
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching content progress:', error);
    return {};
  }

  const map: Record<string, { isCompleted: boolean; isFavorite: boolean }> = {};
  data?.forEach((item) => {
    map[item.content_id] = {
      isCompleted: !!item.is_completed,
      isFavorite: !!item.is_favorite,
    };
  });

  return map;
}

export async function toggleContentCompletedInDb(
  contentId: string,
  contentType: string,
  currentStatus: boolean
): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  const nextStatus = !currentStatus;

  const { error } = await supabase
    .from('content_progress')
    .upsert(
      {
        user_id: user.id,
        content_id: contentId,
        content_type: contentType,
        is_completed: nextStatus,
        completed_at: nextStatus ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,content_id' }
    );

  if (error) {
    console.error('Error toggling content completed:', error);
    return false;
  }

  return nextStatus;
}

export async function toggleContentFavoriteInDb(
  contentId: string,
  contentType: string,
  currentStatus: boolean
): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  const nextStatus = !currentStatus;

  const { error } = await supabase
    .from('content_progress')
    .upsert(
      {
        user_id: user.id,
        content_id: contentId,
        content_type: contentType,
        is_favorite: nextStatus,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,content_id' }
    );

  if (error) {
    console.error('Error toggling content favorite:', error);
    return false;
  }

  return nextStatus;
}

// ======================= FORMATIONS & COURS =======================

export async function fetchCourseProgress(): Promise<Record<string, boolean>> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return {};

  const { data, error } = await supabase
    .from('course_progress')
    .select('course_id, lesson_id, is_completed')
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching course progress:', error);
    return {};
  }

  const map: Record<string, boolean> = {};
  data?.forEach((item) => {
    map[`${item.course_id}_${item.lesson_id}`] = !!item.is_completed;
  });

  return map;
}

export async function toggleLessonCompletedInDb(
  courseId: string,
  lessonId: string,
  currentStatus: boolean
): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  const nextStatus = !currentStatus;

  const { error } = await supabase
    .from('course_progress')
    .upsert(
      {
        user_id: user.id,
        course_id: courseId,
        lesson_id: lessonId,
        is_completed: nextStatus,
        completed_at: nextStatus ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,course_id,lesson_id' }
    );

  if (error) {
    console.error('Error toggling lesson completed:', error);
    return false;
  }

  return nextStatus;
}

export async function saveQuizResultInDb(
  courseId: string,
  lessonId: string,
  score: number
): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  const { error } = await supabase
    .from('course_progress')
    .upsert(
      {
        user_id: user.id,
        course_id: courseId,
        lesson_id: lessonId,
        is_completed: true,
        quiz_score: score,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,course_id,lesson_id' }
    );

  return !error;
}
