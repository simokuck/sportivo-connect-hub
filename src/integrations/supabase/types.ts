export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      calendar_events: {
        Row: {
          can_edit: boolean | null
          created_at: string | null
          description: string | null
          end_time: string
          id: string
          location: string | null
          requires_medical: boolean | null
          start_time: string
          team_id: string | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          can_edit?: boolean | null
          created_at?: string | null
          description?: string | null
          end_time: string
          id?: string
          location?: string | null
          requires_medical?: boolean | null
          start_time: string
          team_id?: string | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          can_edit?: boolean | null
          created_at?: string | null
          description?: string | null
          end_time?: string
          id?: string
          location?: string | null
          requires_medical?: boolean | null
          start_time?: string
          team_id?: string | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          category: string
          id: string
          team_id: string | null
          title: string
          type: string
          upload_date: string | null
          url: string
          user_id: string | null
        }
        Insert: {
          category: string
          id?: string
          team_id?: string | null
          title: string
          type: string
          upload_date?: string | null
          url: string
          user_id?: string | null
        }
        Update: {
          category?: string
          id?: string
          team_id?: string | null
          title?: string
          type?: string
          upload_date?: string | null
          url?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      event_attendees: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          status: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "calendar_events"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_movements: {
        Row: {
          base_item_id: string | null
          date: string | null
          id: string
          note: string | null
          operator_id: string | null
          player_id: string | null
          quantity: number
          type: string
          variant_id: string | null
        }
        Insert: {
          base_item_id?: string | null
          date?: string | null
          id?: string
          note?: string | null
          operator_id?: string | null
          player_id?: string | null
          quantity: number
          type: string
          variant_id?: string | null
        }
        Update: {
          base_item_id?: string | null
          date?: string | null
          id?: string
          note?: string | null
          operator_id?: string | null
          player_id?: string | null
          quantity?: number
          type?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_base_item_id_fkey"
            columns: ["base_item_id"]
            isOneToOne: false
            referencedRelation: "warehouse_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "item_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      item_assignments: {
        Row: {
          assign_date: string | null
          expected_return_date: string | null
          id: string
          notes: string | null
          player_id: string | null
          quantity: number
          return_date: string | null
          returned_condition: string | null
          status: string
          variant_id: string | null
        }
        Insert: {
          assign_date?: string | null
          expected_return_date?: string | null
          id?: string
          notes?: string | null
          player_id?: string | null
          quantity: number
          return_date?: string | null
          returned_condition?: string | null
          status: string
          variant_id?: string | null
        }
        Update: {
          assign_date?: string | null
          expected_return_date?: string | null
          id?: string
          notes?: string | null
          player_id?: string | null
          quantity?: number
          return_date?: string | null
          returned_condition?: string | null
          status?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "item_assignments_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_assignments_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "item_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      item_variants: {
        Row: {
          base_item_id: string | null
          color: string | null
          created_at: string | null
          id: string
          location: string | null
          minimum_threshold: number | null
          quantity: number
          size: string | null
          status: string
          unique_sku: string | null
          updated_at: string | null
        }
        Insert: {
          base_item_id?: string | null
          color?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          minimum_threshold?: number | null
          quantity?: number
          size?: string | null
          status: string
          unique_sku?: string | null
          updated_at?: string | null
        }
        Update: {
          base_item_id?: string | null
          color?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          minimum_threshold?: number | null
          quantity?: number
          size?: string | null
          status?: string
          unique_sku?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "item_variants_base_item_id_fkey"
            columns: ["base_item_id"]
            isOneToOne: false
            referencedRelation: "warehouse_items"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_info: {
        Row: {
          certificate_expiry: string | null
          conditions: string[] | null
          created_at: string | null
          doctor_id: string | null
          id: string
          notes: string | null
          player_id: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          certificate_expiry?: string | null
          conditions?: string[] | null
          created_at?: string | null
          doctor_id?: string | null
          id?: string
          notes?: string | null
          player_id?: string | null
          status: string
          updated_at?: string | null
        }
        Update: {
          certificate_expiry?: string | null
          conditions?: string[] | null
          created_at?: string | null
          doctor_id?: string | null
          id?: string
          notes?: string | null
          player_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_info_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          date: string | null
          for_roles: string[] | null
          for_teams: string[] | null
          for_users: string[] | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
        }
        Insert: {
          date?: string | null
          for_roles?: string[] | null
          for_teams?: string[] | null
          for_users?: string[] | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
        }
        Update: {
          date?: string | null
          for_roles?: string[] | null
          for_teams?: string[] | null
          for_users?: string[] | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      permissions: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      player_stats: {
        Row: {
          absences: number | null
          assists: number | null
          created_at: string | null
          games: number | null
          goals: number | null
          id: string
          minutes_played: number | null
          player_id: string | null
          red_cards: number | null
          updated_at: string | null
          yellow_cards: number | null
        }
        Insert: {
          absences?: number | null
          assists?: number | null
          created_at?: string | null
          games?: number | null
          goals?: number | null
          id?: string
          minutes_played?: number | null
          player_id?: string | null
          red_cards?: number | null
          updated_at?: string | null
          yellow_cards?: number | null
        }
        Update: {
          absences?: number | null
          assists?: number | null
          created_at?: string | null
          games?: number | null
          goals?: number | null
          id?: string
          minutes_played?: number | null
          player_id?: string | null
          red_cards?: number | null
          updated_at?: string | null
          yellow_cards?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          first_name: string
          id: string
          last_name: string
          position: string | null
          strong_foot: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          position?: string | null
          strong_foot?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          position?: string | null
          strong_foot?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string | null
          id: string
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_system_role: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_system_role?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_system_role?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      teams: {
        Row: {
          category: string
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          address: string | null
          avatar: string | null
          biometric_enabled: boolean | null
          birth_date: string | null
          city: string | null
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          role: Database["public"]["Enums"]["user_role_type"] | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          avatar?: string | null
          biometric_enabled?: boolean | null
          birth_date?: string | null
          city?: string | null
          created_at?: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          role?: Database["public"]["Enums"]["user_role_type"] | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          avatar?: string | null
          biometric_enabled?: boolean | null
          birth_date?: string | null
          city?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          role?: Database["public"]["Enums"]["user_role_type"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role_id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role_id: string
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      warehouse_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      warehouse_items: {
        Row: {
          brand: string | null
          category: string
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          notes: string[] | null
          sku: string | null
          updated_at: string | null
        }
        Insert: {
          brand?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          notes?: string[] | null
          sku?: string | null
          updated_at?: string | null
        }
        Update: {
          brand?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          notes?: string[] | null
          sku?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      warehouse_suppliers: {
        Row: {
          address: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          id: string
          name: string
          notes: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          name: string
          notes?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          name?: string
          notes?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "coach" | "manager" | "medical" | "player"
      user_role_type:
        | "player"
        | "coach"
        | "admin"
        | "medical"
        | "developer"
        | "pending"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "coach", "manager", "medical", "player"],
      user_role_type: [
        "player",
        "coach",
        "admin",
        "medical",
        "developer",
        "pending",
      ],
    },
  },
} as const
