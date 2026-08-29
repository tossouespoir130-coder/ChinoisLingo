export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      content_progress: {
        Row: {
          completed_at: string | null
          content_id: string
          content_type: string
          created_at: string | null
          id: string
          is_completed: boolean | null
          is_favorite: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          content_id: string
          content_type: string
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          is_favorite?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          content_id?: string
          content_type?: string
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          is_favorite?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_progress: {
        Row: {
          completed_at: string | null
          course_id: string
          created_at: string | null
          id: string
          is_completed: boolean | null
          lesson_id: string
          quiz_score: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          lesson_id: string
          quiz_score?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          lesson_id?: string
          quiz_score?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          source: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          source?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          source?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          last_name: string | null
          full_name: string | null
          id: string
          last_active_date: string | null
          pinyin_enabled: boolean | null
          streak_days: number | null
          subscription_tier: string | null
          target_level: string | null
          total_minutes_learned: number | null
          total_words_mastered: number | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          full_name?: string | null
          id: string
          last_active_date?: string | null
          pinyin_enabled?: boolean | null
          streak_days?: number | null
          subscription_tier?: string | null
          target_level?: string | null
          total_minutes_learned?: number | null
          total_words_mastered?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          full_name?: string | null
          id?: string
          last_active_date?: string | null
          pinyin_enabled?: boolean | null
          streak_days?: number | null
          subscription_tier?: string | null
          target_level?: string | null
          total_minutes_learned?: number | null
          total_words_mastered?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      saved_words: {
        Row: {
          created_at: string | null
          example: string | null
          french: string
          hanzi: string
          id: string
          last_reviewed_at: string | null
          mastery_level: number | null
          next_review_at: string | null
          note: string | null
          pinyin: string | null
          review_count: number | null
          source_type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          example?: string | null
          french: string
          hanzi: string
          id?: string
          last_reviewed_at?: string | null
          mastery_level?: number | null
          next_review_at?: string | null
          note?: string | null
          pinyin?: string | null
          review_count?: number | null
          source_type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          example?: string | null
          french?: string
          hanzi?: string
          id?: string
          last_reviewed_at?: string | null
          mastery_level?: number | null
          next_review_at?: string | null
          note?: string | null
          pinyin?: string | null
          review_count?: number | null
          source_type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_words_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type SavedWord = Database['public']['Tables']['saved_words']['Row']
export type ContentProgress = Database['public']['Tables']['content_progress']['Row']
export type CourseProgress = Database['public']['Tables']['course_progress']['Row']
export type NotificationItem = Database['public']['Tables']['notifications']['Row']
