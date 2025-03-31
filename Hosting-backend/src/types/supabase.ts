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
      agents: {
        Row: {
          active_clients: number | null
          commission_rate: number
          created_at: string | null
          email: string
          id: string
          join_date: string
          name: string
          phone: string | null
          referral_code: string
          status: string
          total_sales: number | null
          updated_at: string | null
        }
        Insert: {
          active_clients?: number | null
          commission_rate: number
          created_at?: string | null
          email: string
          id: string
          join_date: string
          name: string
          phone?: string | null
          referral_code: string
          status: string
          total_sales?: number | null
          updated_at?: string | null
        }
        Update: {
          active_clients?: number | null
          commission_rate?: number
          created_at?: string | null
          email?: string
          id?: string
          join_date?: string
          name?: string
          phone?: string | null
          referral_code?: string
          status?: string
          total_sales?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          address: string | null
          created_at: string | null
          email: string
          id: string
          join_date: string
          name: string
          phone: string
          product: string
          referred_by: string
          status: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email: string
          id?: string
          join_date: string
          name: string
          phone: string
          product: string
          referred_by: string
          status: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string
          id?: string
          join_date?: string
          name?: string
          phone?: string
          product?: string
          referred_by?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      commission_payouts: {
        Row: {
          agent_id: string
          agent_name: string
          amount: number
          created_at: string | null
          id: string
          payment_date: string | null
          period: string
          status: string
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          agent_name: string
          amount: number
          created_at?: string | null
          id?: string
          payment_date?: string | null
          period: string
          status: string
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          agent_name?: string
          amount?: number
          created_at?: string | null
          id?: string
          payment_date?: string | null
          period?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commission_payouts_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          commission_rate: number
          created_at: string | null
          description: string
          features: string[]
          id: string
          is_active: boolean
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          category: string
          commission_rate: number
          created_at?: string | null
          description: string
          features: string[]
          id?: string
          is_active?: boolean
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          category?: string
          commission_rate?: number
          created_at?: string | null
          description?: string
          features?: string[]
          id?: string
          is_active?: boolean
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          admin_email: string
          agent_activity_notifications: boolean
          auto_approve: boolean
          commission_notifications: boolean
          company_name: string
          created_at: string | null
          dark_mode: boolean
          date_format: string
          default_commission_rate: number
          email_notifications: boolean
          id: string
          max_commission_rate: number
          min_commission_rate: number
          new_client_notifications: boolean
          notification_email: string
          payout_threshold: number
          tiered_rates: boolean
          timezone: string
          updated_at: string | null
        }
        Insert: {
          admin_email: string
          agent_activity_notifications?: boolean
          auto_approve?: boolean
          commission_notifications?: boolean
          company_name: string
          created_at?: string | null
          dark_mode?: boolean
          date_format: string
          default_commission_rate: number
          email_notifications?: boolean
          id?: string
          max_commission_rate: number
          min_commission_rate: number
          new_client_notifications?: boolean
          notification_email: string
          payout_threshold: number
          tiered_rates?: boolean
          timezone: string
          updated_at?: string | null
        }
        Update: {
          admin_email?: string
          agent_activity_notifications?: boolean
          auto_approve?: boolean
          commission_notifications?: boolean
          company_name?: string
          created_at?: string | null
          dark_mode?: boolean
          date_format?: string
          default_commission_rate?: number
          email_notifications?: boolean
          id?: string
          max_commission_rate?: number
          min_commission_rate?: number
          new_client_notifications?: boolean
          notification_email?: string
          payout_threshold?: number
          tiered_rates?: boolean
          timezone?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          agent_name: string
          amount: number
          client_name: string
          commission: number
          created_at: string | null
          date: string
          id: string
          payment_method: string
          product: string
          status: string
          updated_at: string | null
        }
        Insert: {
          agent_name: string
          amount: number
          client_name: string
          commission: number
          created_at?: string | null
          date: string
          id?: string
          payment_method: string
          product: string
          status: string
          updated_at?: string | null
        }
        Update: {
          agent_name?: string
          amount?: number
          client_name?: string
          commission?: number
          created_at?: string | null
          date?: string
          id?: string
          payment_method?: string
          product?: string
          status?: string
          updated_at?: string | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
