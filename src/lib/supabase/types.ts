export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
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
        Relationships: [
          {
            foreignKeyName: "admin_actions_log_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_actions_log_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
          user_id: string
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
      daily_activity: {
        Row: {
          created_at: string
          jour: string
          minutes: number
          mots_maitrises: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          jour: string
          minutes?: number
          mots_maitrises?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          jour?: string
          minutes?: number
          mots_maitrises?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_activity_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      emails_abonnement: {
        Row: {
          created_at: string
          destinataire: string
          echeance: string
          id: string
          payment_id: string | null
          resend_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          destinataire: string
          echeance: string
          id?: string
          payment_id?: string | null
          resend_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          destinataire?: string
          echeance?: string
          id?: string
          payment_id?: string | null
          resend_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "emails_abonnement_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emails_abonnement_user_id_fkey"
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
      personnages_voix: {
        Row: {
          category: Database["public"]["Enums"]["voice_category"]
          character_name_fr: string
          character_name_zh: string | null
          created_at: string | null
          description: string | null
          gender: Database["public"]["Enums"]["voice_gender"]
          id: string
          model_id: string | null
          similarity_boost: number | null
          stability: number | null
          updated_at: string | null
          voice_id: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["voice_category"]
          character_name_fr: string
          character_name_zh?: string | null
          created_at?: string | null
          description?: string | null
          gender: Database["public"]["Enums"]["voice_gender"]
          id: string
          model_id?: string | null
          similarity_boost?: number | null
          stability?: number | null
          updated_at?: string | null
          voice_id?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["voice_category"]
          character_name_fr?: string
          character_name_zh?: string | null
          created_at?: string | null
          description?: string | null
          gender?: Database["public"]["Enums"]["voice_gender"]
          id?: string
          model_id?: string | null
          similarity_boost?: number | null
          stability?: number | null
          updated_at?: string | null
          voice_id?: string | null
        }
        Relationships: []
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
          bonus_7j_accorde: boolean
          cancel_at_period_end: boolean
          city: string | null
          country: string | null
          created_at: string | null
          current_period_end: string | null
          email: string | null
          first_name: string | null
          full_name: string | null
          id: string
          last_active_date: string | null
          last_name: string | null
          last_sign_in_at: string | null
          pinyin_enabled: boolean | null
          onboarding_profil?: string | null
          onboarding_objectif?: string | null
          onboarding_niveau?: string | null
          onboarding_rappels?: boolean | null
          relances_desactivees?: boolean
          role: string
          streak_days: number | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_currency: string | null
          subscription_plan: string | null
          subscription_provider: string | null
          subscription_status: string
          subscription_tier: string | null
          target_level: string | null
          total_login_days: number | null
          total_minutes_learned: number | null
          total_words_mastered: number | null
          trial_ends_at: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          bonus_7j_accorde?: boolean
          cancel_at_period_end?: boolean
          city?: string | null
          country?: string | null
          created_at?: string | null
          current_period_end?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id: string
          last_active_date?: string | null
          last_name?: string | null
          last_sign_in_at?: string | null
          pinyin_enabled?: boolean | null
          onboarding_profil?: string | null
          onboarding_objectif?: string | null
          onboarding_niveau?: string | null
          onboarding_rappels?: boolean | null
          relances_desactivees?: boolean
          role?: string
          streak_days?: number | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_currency?: string | null
          subscription_plan?: string | null
          subscription_provider?: string | null
          subscription_status?: string
          subscription_tier?: string | null
          target_level?: string | null
          total_login_days?: number | null
          total_minutes_learned?: number | null
          total_words_mastered?: number | null
          trial_ends_at?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          bonus_7j_accorde?: boolean
          cancel_at_period_end?: boolean
          city?: string | null
          country?: string | null
          created_at?: string | null
          current_period_end?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_active_date?: string | null
          last_name?: string | null
          last_sign_in_at?: string | null
          pinyin_enabled?: boolean | null
          onboarding_profil?: string | null
          onboarding_objectif?: string | null
          onboarding_niveau?: string | null
          onboarding_rappels?: boolean | null
          relances_desactivees?: boolean
          role?: string
          streak_days?: number | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_currency?: string | null
          subscription_plan?: string | null
          subscription_provider?: string | null
          subscription_status?: string
          subscription_tier?: string | null
          target_level?: string | null
          total_login_days?: number | null
          total_minutes_learned?: number | null
          total_words_mastered?: number | null
          trial_ends_at?: string | null
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
          p_action: string
          p_admin_id: string
          p_mois?: number | null
          p_target_id: string
        }
        Returns: Json
      }
      est_admin: { Args: { uid: string }; Returns: boolean }
    }
    Enums: {
      voice_category: "recurrent" | "narrator" | "generic" | "founder"
      voice_gender: "female" | "male" | "neutral"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      voice_category: ["recurrent", "narrator", "generic", "founder"],
      voice_gender: ["female", "male", "neutral"],
    },
  },
} as const

export type Profile = Database['public']['Tables']['profiles']['Row']
export type SavedWord = Database['public']['Tables']['saved_words']['Row']
export type ContentProgress = Database['public']['Tables']['content_progress']['Row']
export type CourseProgress = Database['public']['Tables']['course_progress']['Row']
export type NotificationItem = Database['public']['Tables']['notifications']['Row']
export type Payment = Database['public']['Tables']['payments']['Row']
export type AdminActionLog = Database['public']['Tables']['admin_actions_log']['Row']
export type DailyActivity = Database['public']['Tables']['daily_activity']['Row']
export type EmailAbonnement = Database['public']['Tables']['emails_abonnement']['Row']
export type PersonnageVoix = Database['public']['Tables']['personnages_voix']['Row']

