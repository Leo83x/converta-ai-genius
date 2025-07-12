export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      agent_channels: {
        Row: {
          agent_id: string | null
          channel_type: string | null
          created_at: string
          id: string
          routing_number: string | null
        }
        Insert: {
          agent_id?: string | null
          channel_type?: string | null
          created_at?: string
          id?: string
          routing_number?: string | null
        }
        Update: {
          agent_id?: string | null
          channel_type?: string | null
          created_at?: string
          id?: string
          routing_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_channels_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_conversations: {
        Row: {
          agent_id: string | null
          created_at: string
          id: string
          messages: Json | null
          qualification_score: number | null
          user_session_id: string | null
        }
        Insert: {
          agent_id?: string | null
          created_at?: string
          id?: string
          messages?: Json | null
          qualification_score?: number | null
          user_session_id?: string | null
        }
        Update: {
          agent_id?: string | null
          created_at?: string
          id?: string
          messages?: Json | null
          qualification_score?: number | null
          user_session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_conversations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          active: boolean | null
          channel: string | null
          created_at: string
          id: string
          name: string | null
          system_prompt: string | null
          user_id: string | null
        }
        Insert: {
          active?: boolean | null
          channel?: string | null
          created_at?: string
          id?: string
          name?: string | null
          system_prompt?: string | null
          user_id?: string | null
        }
        Update: {
          active?: boolean | null
          channel?: string | null
          created_at?: string
          id?: string
          name?: string | null
          system_prompt?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      evolution_inbound_messages: {
        Row: {
          evolution_token_id: string | null
          id: string
          message_content: Json | null
          message_id: string | null
          processed: boolean | null
          timestamp: string
          type: string | null
          whatsapp_from: string | null
          whatsapp_to: string | null
        }
        Insert: {
          evolution_token_id?: string | null
          id?: string
          message_content?: Json | null
          message_id?: string | null
          processed?: boolean | null
          timestamp?: string
          type?: string | null
          whatsapp_from?: string | null
          whatsapp_to?: string | null
        }
        Update: {
          evolution_token_id?: string | null
          id?: string
          message_content?: Json | null
          message_id?: string | null
          processed?: boolean | null
          timestamp?: string
          type?: string | null
          whatsapp_from?: string | null
          whatsapp_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evolution_inbound_messages_evolution_token_id_fkey"
            columns: ["evolution_token_id"]
            isOneToOne: false
            referencedRelation: "evolution_tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      evolution_outbound_messages: {
        Row: {
          evolution_token_id: string | null
          id: string
          message_content: Json | null
          message_id: string | null
          response_status: string | null
          timestamp: string
          whatsapp_to: string | null
        }
        Insert: {
          evolution_token_id?: string | null
          id?: string
          message_content?: Json | null
          message_id?: string | null
          response_status?: string | null
          timestamp?: string
          whatsapp_to?: string | null
        }
        Update: {
          evolution_token_id?: string | null
          id?: string
          message_content?: Json | null
          message_id?: string | null
          response_status?: string | null
          timestamp?: string
          whatsapp_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evolution_outbound_messages_evolution_token_id_fkey"
            columns: ["evolution_token_id"]
            isOneToOne: false
            referencedRelation: "evolution_tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      evolution_tokens: {
        Row: {
          created_at: string
          id: string
          instance_id: string | null
          qr_code_url: string | null
          session_name: string | null
          status: string | null
          token: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          instance_id?: string | null
          qr_code_url?: string | null
          session_name?: string | null
          status?: string | null
          token?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          instance_id?: string | null
          qr_code_url?: string | null
          session_name?: string | null
          status?: string | null
          token?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evolution_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      genius_campaigns: {
        Row: {
          ai_suggestions: Json | null
          budget: string | null
          campaign_data: Json | null
          created_at: string
          duration: string | null
          format: string[] | null
          has_strategy: boolean | null
          id: string
          name: string
          objective: string | null
          persona: string | null
          platform: string[] | null
          segment: string | null
          status: string | null
          tone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_suggestions?: Json | null
          budget?: string | null
          campaign_data?: Json | null
          created_at?: string
          duration?: string | null
          format?: string[] | null
          has_strategy?: boolean | null
          id?: string
          name: string
          objective?: string | null
          persona?: string | null
          platform?: string[] | null
          segment?: string | null
          status?: string | null
          tone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_suggestions?: Json | null
          budget?: string | null
          campaign_data?: Json | null
          created_at?: string
          duration?: string | null
          format?: string[] | null
          has_strategy?: boolean | null
          id?: string
          name?: string
          objective?: string | null
          persona?: string | null
          platform?: string[] | null
          segment?: string | null
          status?: string | null
          tone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      genius_inputs: {
        Row: {
          analyzed: boolean | null
          content: Json | null
          created_at: string
          id: string
          input_type: string | null
          user_id: string | null
        }
        Insert: {
          analyzed?: boolean | null
          content?: Json | null
          created_at?: string
          id?: string
          input_type?: string | null
          user_id?: string | null
        }
        Update: {
          analyzed?: boolean | null
          content?: Json | null
          created_at?: string
          id?: string
          input_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "genius_inputs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      genius_logs: {
        Row: {
          created_at: string
          id: string
          insights: Json | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          insights?: Json | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          insights?: Json | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "genius_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          score: number | null
          source: string | null
          stage: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          score?: number | null
          source?: string | null
          stage?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          score?: number | null
          source?: string | null
          stage?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      meta_connections: {
        Row: {
          access_token: string | null
          channel_type: string | null
          created_at: string
          id: string
          page_id: string | null
          page_name: string | null
          token_expiration: string | null
          user_id: string | null
        }
        Insert: {
          access_token?: string | null
          channel_type?: string | null
          created_at?: string
          id?: string
          page_id?: string | null
          page_name?: string | null
          token_expiration?: string | null
          user_id?: string | null
        }
        Update: {
          access_token?: string | null
          channel_type?: string | null
          created_at?: string
          id?: string
          page_id?: string | null
          page_name?: string | null
          token_expiration?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meta_connections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      meta_webhook_events: {
        Row: {
          connection_id: string | null
          event_type: string | null
          id: string
          message: Json | null
          processed: boolean | null
          sender_id: string | null
          timestamp: string
        }
        Insert: {
          connection_id?: string | null
          event_type?: string | null
          id?: string
          message?: Json | null
          processed?: boolean | null
          sender_id?: string | null
          timestamp?: string
        }
        Update: {
          connection_id?: string | null
          event_type?: string | null
          id?: string
          message?: Json | null
          processed?: boolean | null
          sender_id?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "meta_webhook_events_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "meta_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_stages: {
        Row: {
          color: string | null
          created_at: string
          id: string
          name: string
          order_index: number
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          name: string
          order_index: number
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          name?: string
          order_index?: number
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string | null
          openai_key: string | null
          phone: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          openai_key?: string | null
          phone?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          openai_key?: string | null
          phone?: string | null
        }
        Relationships: []
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
