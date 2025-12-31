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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          created_at: string | null
          duration: number | null
          id: string
          notes: string | null
          patient_id: string
          status: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          appointment_date: string
          created_at?: string | null
          duration?: number | null
          id?: string
          notes?: string | null
          patient_id: string
          status?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          appointment_date?: string
          created_at?: string | null
          duration?: number | null
          id?: string
          notes?: string | null
          patient_id?: string
          status?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      call_logs: {
        Row: {
          call_type: string
          created_at: string | null
          duration: number | null
          emergency_level: number | null
          id: string
          intent_detected: string | null
          patient_id: string | null
          resolution: string | null
          sentiment_score: number | null
          transcript: string | null
        }
        Insert: {
          call_type: string
          created_at?: string | null
          duration?: number | null
          emergency_level?: number | null
          id?: string
          intent_detected?: string | null
          patient_id?: string | null
          resolution?: string | null
          sentiment_score?: number | null
          transcript?: string | null
        }
        Update: {
          call_type?: string
          created_at?: string | null
          duration?: number | null
          emergency_level?: number | null
          id?: string
          intent_detected?: string | null
          patient_id?: string | null
          resolution?: string | null
          sentiment_score?: number | null
          transcript?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "call_logs_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          created_at: string | null
          date_of_birth: string
          email: string
          emergency_contact: string | null
          first_name: string
          id: string
          insurance_provider: string | null
          last_name: string
          medical_notes: string | null
          phone: string
          preferred_language: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date_of_birth: string
          email: string
          emergency_contact?: string | null
          first_name: string
          id?: string
          insurance_provider?: string | null
          last_name: string
          medical_notes?: string | null
          phone: string
          preferred_language?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date_of_birth?: string
          email?: string
          emergency_contact?: string | null
          first_name?: string
          id?: string
          insurance_provider?: string | null
          last_name?: string
          medical_notes?: string | null
          phone?: string
          preferred_language?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      qrthis_notifications: {
        Row: {
          created_at: string
          email: string
          feature_requested: string
          id: string
          name: string | null
          phone_number: string | null
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          email: string
          feature_requested: string
          id?: string
          name?: string | null
          phone_number?: string | null
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          feature_requested?: string
          id?: string
          name?: string | null
          phone_number?: string | null
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      reminders: {
        Row: {
          appointment_id: string | null
          channel: string | null
          created_at: string | null
          id: string
          patient_id: string
          scheduled_at: string
          sent_at: string | null
          status: string | null
          type: string
        }
        Insert: {
          appointment_id?: string | null
          channel?: string | null
          created_at?: string | null
          id?: string
          patient_id: string
          scheduled_at: string
          sent_at?: string | null
          status?: string | null
          type: string
        }
        Update: {
          appointment_id?: string | null
          channel?: string | null
          created_at?: string | null
          id?: string
          patient_id?: string
          scheduled_at?: string
          sent_at?: string | null
          status?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminders_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      security_audit_log: {
        Row: {
          created_at: string
          id: string
          ip_address: unknown
          operation: string
          table_name: string
          user_agent: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: unknown
          operation: string
          table_name: string
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: unknown
          operation?: string
          table_name?: string
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          email: string
          id: string
          name: string
          referral_source: string | null
          signup_timestamp: string | null
          special_message: string | null
          user_timezone: string | null
        }
        Insert: {
          email: string
          id?: string
          name: string
          referral_source?: string | null
          signup_timestamp?: string | null
          special_message?: string | null
          user_timezone?: string | null
        }
        Update: {
          email?: string
          id?: string
          name?: string
          referral_source?: string | null
          signup_timestamp?: string | null
          special_message?: string | null
          user_timezone?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_personalized_recommendations: {
        Args: { limit_count?: number; user_device_id: string }
        Returns: {
          cinema_votes: number
          director: string
          id: number
          micro_genres: string[]
          not_cinema_votes: number
          poster: string
          recommendation_score: number
          title: string
          year: number
        }[]
      }
      get_random_movie: {
        Args: never
        Returns: {
          ai_rationale: string
          cinema_votes: number
          director: string
          dominant_colors: Json
          id: number
          micro_genres: string[]
          not_cinema_votes: number
          plot: string
          poster: string
          runtime_minutes: number
          title: string
          year: number
        }[]
      }
      get_user_verdict: {
        Args: { p_movie_id: number; p_user_email: string }
        Returns: string
      }
      has_user_already_judged: {
        Args: { p_movie_id: number; p_user_email: string }
        Returns: boolean
      }
      increment_movie_verdict: {
        Args: { movie_id: number; verdict_type: string }
        Returns: undefined
      }
      record_user_verdict: {
        Args: {
          p_movie_id: number
          p_user_email: string
          p_verdict_type: string
        }
        Returns: Json
      }
      refresh_top_cinema_movies: { Args: never; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
