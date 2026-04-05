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
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          company: string | null
          address: string | null
          city: string | null
          state: string | null
          postcode: string | null
          country: string | null
          credit_balance: number
          support_pin: string
          sso_enabled: boolean
          email_preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          company?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          postcode?: string | null
          country?: string | null
          credit_balance?: number
          support_pin?: string
          sso_enabled?: boolean
          email_preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          company?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          postcode?: string | null
          country?: string | null
          credit_balance?: number
          support_pin?: string
          sso_enabled?: boolean
          email_preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      user_invitations: {
        Row: {
          id: string
          inviter_id: string
          email: string
          permissions: string
          status: string
          token: string
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          inviter_id: string
          email: string
          permissions?: string
          status?: string
          token?: string
          expires_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          inviter_id?: string
          email?: string
          permissions?: string
          status?: string
          token?: string
          expires_at?: string
          created_at?: string
        }
      }
      hosting_plans: {
        Row: {
          id: string
          name: string
          category: string
          description: string
          price: number
          currency: string
          features: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          description: string
          price: number
          currency?: string
          features: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          description?: string
          price?: number
          currency?: string
          features?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          domain: string | null
          status: string
          billing_cycle: string
          next_due_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          domain?: string | null
          status?: string
          billing_cycle?: string
          next_due_date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string
          domain?: string | null
          status?: string
          billing_cycle?: string
          next_due_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      domains: {
        Row: {
          id: string
          user_id: string
          domain_name: string
          status: string
          expiry_date: string
          auto_renew: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          domain_name: string
          status?: string
          expiry_date: string
          auto_renew?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          domain_name?: string
          status?: string
          expiry_date?: string
          auto_renew?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      support_tickets: {
        Row: {
          id: string
          ticket_number: string
          user_id: string
          department: string
          subject: string
          message: string
          status: string
          priority: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          ticket_number?: string
          user_id: string
          department: string
          subject: string
          message: string
          status?: string
          priority?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          ticket_number?: string
          user_id?: string
          department?: string
          subject?: string
          message?: string
          status?: string
          priority?: string
          created_at?: string
          updated_at?: string
        }
      }
      ticket_replies: {
        Row: {
          id: string
          ticket_id: string
          user_id: string | null
          message: string
          is_staff_reply: boolean
          created_at: string
        }
        Insert: {
          id?: string
          ticket_id: string
          user_id?: string | null
          message: string
          is_staff_reply?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          ticket_id?: string
          user_id?: string | null
          message?: string
          is_staff_reply?: boolean
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          domain: string | null
          billing_cycle: string
          amount: number
          currency: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          domain?: string | null
          billing_cycle?: string
          amount: number
          currency?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string
          domain?: string | null
          billing_cycle?: string
          amount?: number
          currency?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          invoice_number: string
          user_id: string
          order_id: string | null
          amount: number
          currency: string
          status: string
          due_date: string
          paid_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          invoice_number?: string
          user_id: string
          order_id?: string | null
          amount: number
          currency?: string
          status?: string
          due_date: string
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          invoice_number?: string
          user_id?: string
          order_id?: string | null
          amount?: number
          currency?: string
          status?: string
          due_date?: string
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      quotes: {
        Row: {
          id: string
          quote_number: string
          user_id: string
          subject: string
          amount: number
          currency: string
          status: string
          valid_until: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          quote_number?: string
          user_id: string
          subject: string
          amount: number
          currency?: string
          status?: string
          valid_until: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          quote_number?: string
          user_id?: string
          subject?: string
          amount?: number
          currency?: string
          status?: string
          valid_until?: string
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          invoice_id: string | null
          amount: number
          currency: string
          payment_method: string
          status: string
          transaction_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          invoice_id?: string | null
          amount: number
          currency?: string
          payment_method: string
          status?: string
          transaction_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          invoice_id?: string | null
          amount?: number
          currency?: string
          payment_method?: string
          status?: string
          transaction_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      affiliate_accounts: {
        Row: {
          id: string
          user_id: string
          affiliate_code: string
          commission_rate: number
          total_earnings: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          affiliate_code?: string
          commission_rate?: number
          total_earnings?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          affiliate_code?: string
          commission_rate?: number
          total_earnings?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      email_history: {
        Row: {
          id: string
          user_id: string
          subject: string
          email_type: string
          sent_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject: string
          email_type: string
          sent_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject?: string
          email_type?: string
          sent_at?: string
          created_at?: string
        }
      }
      blocked_ips: {
        Row: {
          id: string
          ip_address: string
          user_id: string | null
          reason: string | null
          blocked_at: string
          unblocked_at: string | null
          is_blocked: boolean
        }
        Insert: {
          id?: string
          ip_address: string
          user_id?: string | null
          reason?: string | null
          blocked_at?: string
          unblocked_at?: string | null
          is_blocked?: boolean
        }
        Update: {
          id?: string
          ip_address?: string
          user_id?: string | null
          reason?: string | null
          blocked_at?: string
          unblocked_at?: string | null
          is_blocked?: boolean
        }
      }
      domain_tlds: {
        Row: {
          id: string
          tld: string
          price_usd: number
          price_kes: number
          price_zar: number
          registration_period: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tld: string
          price_usd: number
          price_kes: number
          price_zar: number
          registration_period?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tld?: string
          price_usd?: number
          price_kes?: number
          price_zar?: number
          registration_period?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      service_status: "active" | "suspended" | "cancelled" | "pending"
      domain_status: "active" | "expired" | "pending" | "cancelled"
      ticket_status: "open" | "in_progress" | "resolved" | "closed"
      ticket_priority: "low" | "medium" | "high" | "urgent"
      order_status: "pending" | "processing" | "completed" | "cancelled"
      invoice_status: "paid" | "unpaid" | "cancelled" | "refunded"
      quote_status: "draft" | "sent" | "accepted" | "declined" | "expired"
      payment_status: "pending" | "completed" | "failed" | "cancelled"
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