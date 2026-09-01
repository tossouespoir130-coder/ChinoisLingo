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
      admin_actions_log: {
        Row: {
          action: string
          admin_email: string | null
          admin_id: string | null
          created_at: string
          details: Json | null
          id: string
          target_email: string | null
          target_user_id: string | null
        }
        Insert: {
          action: string
          admin_email?: string | null
          admin_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          target_email?: string | null
          target_user_id?: string | null
        }
        Update: {
          action?: string
          admin_email?: string | null
          admin_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          target_email?: string | null
          target_user_id?: string | null
        }
        Relationships: []
      }
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
      payments: {
        Row: {
          amount: number
          checkout_url: string | null
          created_at: string
          currency: string
          customer_email: string | null
          customer_name: string | null
          failure_reason: string | null
          id: string
          metadata: Json | null
          plan_id: string
          provider: string
          provider_transaction_id: string | null
          status: string
          updated_at: string
          user_id: string
          webhook_received_at: string | null
        }
        Insert: {
          amount: number
          checkout_url?: string | null
          created_at?: string
          currency: string
          customer_email?: string | null
          customer_name?: string | null
          failure_reason?: string | null
          id?: string
          metadata?: Json | null
          plan_id: string
          provider: string
          provider_transaction_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
          webhook_received_at?: string | null
        }
        Update: {
          amount?: number
          checkout_url?: string | null
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_name?: string | null
          failure_reason?: string | null
          id?: string
          metadata?: Json | null
          plan_id?: string
          provider?: string
          provider_transaction_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          webhook_received_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      processed_events: {
        Row: {
          event_id: string
          processed_at: string
          provider: string
        }
        Insert: {
          event_id: string
          processed_at?: string
          provider: string
        }
        Update: {
          event_id?: string
          processed_at?: string
          provider?: string
        }
        Relationships: []
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
          role: string
          streak_days: number | null
          bonus_7j_accorde: boolean
          cancel_at_period_end: boolean
          current_period_end: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_currency: string | null
          subscription_plan: string | null
          subscription_provider: string | null
          subscription_status: string
          trial_ends_at: string | null
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
          role?: string
          streak_days?: number | null
          bonus_7j_accorde?: boolean
          cancel_at_period_end?: boolean
          current_period_end?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_currency?: string | null
          subscription_plan?: string | null
          subscription_provider?: string | null
          subscription_status?: string
          trial_ends_at?: string | null
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
          role?: string
          streak_days?: number | null
          bonus_7j_accorde?: boolean
          cancel_at_period_end?: boolean
          current_period_end?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_currency?: string | null
          subscription_plan?: string | null
          subscription_provider?: string | null
          subscription_status?: string
          trial_ends_at?: string | null
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
      admin_modifier_abonnement: {
        Args: {
          p_admin_id: string
          p_target_id: string
          p_action: string
          p_mois?: number | null
        }
        Returns: Json
      }
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
export type Payment = Database['public']['Tables']['payments']['Row']
export type AdminActionLog = Database['public']['Tables']['admin_actions_log']['Row']
