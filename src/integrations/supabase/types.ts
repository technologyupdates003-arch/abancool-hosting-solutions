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
      affiliate_accounts: {
        Row: {
          affiliate_code: string | null
          commission_rate: number | null
          created_at: string | null
          id: string
          is_active: boolean | null
          total_earnings: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          affiliate_code?: string | null
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          total_earnings?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          affiliate_code?: string | null
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          total_earnings?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      automation_rules: {
        Row: {
          actions: Json
          conditions: Json | null
          created_at: string | null
          description: string | null
          execution_count: number | null
          id: string
          is_active: boolean | null
          last_executed: string | null
          name: string
          trigger_event: string
          updated_at: string | null
        }
        Insert: {
          actions: Json
          conditions?: Json | null
          created_at?: string | null
          description?: string | null
          execution_count?: number | null
          id?: string
          is_active?: boolean | null
          last_executed?: string | null
          name: string
          trigger_event: string
          updated_at?: string | null
        }
        Update: {
          actions?: Json
          conditions?: Json | null
          created_at?: string | null
          description?: string | null
          execution_count?: number | null
          id?: string
          is_active?: boolean | null
          last_executed?: string | null
          name?: string
          trigger_event?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      blocked_ips: {
        Row: {
          blocked_at: string | null
          id: string
          ip_address: unknown
          is_blocked: boolean | null
          reason: string | null
          unblocked_at: string | null
          user_id: string | null
        }
        Insert: {
          blocked_at?: string | null
          id?: string
          ip_address: unknown
          is_blocked?: boolean | null
          reason?: string | null
          unblocked_at?: string | null
          user_id?: string | null
        }
        Update: {
          blocked_at?: string | null
          id?: string
          ip_address?: unknown
          is_blocked?: boolean | null
          reason?: string | null
          unblocked_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      cart_sessions: {
        Row: {
          created_at: string | null
          discount_percentage: number | null
          expires_at: string | null
          id: string
          items: Json
          promo_code: string | null
          session_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          discount_percentage?: number | null
          expires_at?: string | null
          id?: string
          items?: Json
          promo_code?: string | null
          session_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          discount_percentage?: number | null
          expires_at?: string | null
          id?: string
          items?: Json
          promo_code?: string | null
          session_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      directadmin_accounts: {
        Row: {
          bandwidth_usage: Json | null
          created_at: string | null
          disk_usage: Json | null
          domain: string
          id: string
          last_login: string | null
          order_id: string | null
          package_name: string
          server_ip: string
          service_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string
          username: string
        }
        Insert: {
          bandwidth_usage?: Json | null
          created_at?: string | null
          disk_usage?: Json | null
          domain: string
          id?: string
          last_login?: string | null
          order_id?: string | null
          package_name: string
          server_ip: string
          service_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          username: string
        }
        Update: {
          bandwidth_usage?: Json | null
          created_at?: string | null
          disk_usage?: Json | null
          domain?: string
          id?: string
          last_login?: string | null
          order_id?: string | null
          package_name?: string
          server_ip?: string
          service_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "directadmin_accounts_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "directadmin_accounts_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      directadmin_packages: {
        Row: {
          bandwidth_quota: number | null
          cgi_enabled: boolean | null
          created_at: string | null
          disk_quota: number
          id: string
          is_active: boolean | null
          max_databases: number | null
          max_domains: number | null
          max_emails: number | null
          max_ftp_accounts: number | null
          max_subdomains: number | null
          package_name: string
          php_enabled: boolean | null
          server_id: string
          shell_access: boolean | null
          ssl_enabled: boolean | null
          updated_at: string | null
        }
        Insert: {
          bandwidth_quota?: number | null
          cgi_enabled?: boolean | null
          created_at?: string | null
          disk_quota: number
          id?: string
          is_active?: boolean | null
          max_databases?: number | null
          max_domains?: number | null
          max_emails?: number | null
          max_ftp_accounts?: number | null
          max_subdomains?: number | null
          package_name: string
          php_enabled?: boolean | null
          server_id: string
          shell_access?: boolean | null
          ssl_enabled?: boolean | null
          updated_at?: string | null
        }
        Update: {
          bandwidth_quota?: number | null
          cgi_enabled?: boolean | null
          created_at?: string | null
          disk_quota?: number
          id?: string
          is_active?: boolean | null
          max_databases?: number | null
          max_domains?: number | null
          max_emails?: number | null
          max_ftp_accounts?: number | null
          max_subdomains?: number | null
          package_name?: string
          php_enabled?: boolean | null
          server_id?: string
          shell_access?: boolean | null
          ssl_enabled?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "directadmin_packages_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "directadmin_servers"
            referencedColumns: ["id"]
          },
        ]
      }
      directadmin_servers: {
        Row: {
          api_password: string | null
          api_username: string
          created_at: string | null
          current_accounts: number | null
          hostname: string
          id: string
          ip_address: string
          location: string | null
          max_accounts: number | null
          name: string
          port: number | null
          ssl_enabled: boolean | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          api_password?: string | null
          api_username: string
          created_at?: string | null
          current_accounts?: number | null
          hostname: string
          id?: string
          ip_address: string
          location?: string | null
          max_accounts?: number | null
          name: string
          port?: number | null
          ssl_enabled?: boolean | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          api_password?: string | null
          api_username?: string
          created_at?: string | null
          current_accounts?: number | null
          hostname?: string
          id?: string
          ip_address?: string
          location?: string | null
          max_accounts?: number | null
          name?: string
          port?: number | null
          ssl_enabled?: boolean | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      domain_registrations: {
        Row: {
          auto_renew: boolean | null
          created_at: string | null
          domain_name: string
          expires_at: string
          id: string
          nameservers: string[] | null
          order_id: string | null
          registered_at: string | null
          registration_period: number | null
          status: Database["public"]["Enums"]["domain_status"] | null
          tld: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auto_renew?: boolean | null
          created_at?: string | null
          domain_name: string
          expires_at: string
          id?: string
          nameservers?: string[] | null
          order_id?: string | null
          registered_at?: string | null
          registration_period?: number | null
          status?: Database["public"]["Enums"]["domain_status"] | null
          tld: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auto_renew?: boolean | null
          created_at?: string | null
          domain_name?: string
          expires_at?: string
          id?: string
          nameservers?: string[] | null
          order_id?: string | null
          registered_at?: string | null
          registration_period?: number | null
          status?: Database["public"]["Enums"]["domain_status"] | null
          tld?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "domain_registrations_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      domains: {
        Row: {
          auto_renew: boolean | null
          created_at: string | null
          domain_name: string
          expiry_date: string
          id: string
          status: Database["public"]["Enums"]["domain_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auto_renew?: boolean | null
          created_at?: string | null
          domain_name: string
          expiry_date: string
          id?: string
          status?: Database["public"]["Enums"]["domain_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auto_renew?: boolean | null
          created_at?: string | null
          domain_name?: string
          expiry_date?: string
          id?: string
          status?: Database["public"]["Enums"]["domain_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      email_history: {
        Row: {
          created_at: string | null
          email_type: string
          id: string
          sent_at: string | null
          subject: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_type: string
          id?: string
          sent_at?: string | null
          subject: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_type?: string
          id?: string
          sent_at?: string | null
          subject?: string
          user_id?: string
        }
        Relationships: []
      }
      email_queue: {
        Row: {
          attempts: number | null
          created_at: string | null
          error_message: string | null
          from_email: string | null
          html_content: string
          id: string
          max_attempts: number | null
          scheduled_at: string | null
          sent_at: string | null
          status: string | null
          subject: string
          template_data: Json | null
          template_name: string | null
          text_content: string | null
          to_email: string
          updated_at: string | null
        }
        Insert: {
          attempts?: number | null
          created_at?: string | null
          error_message?: string | null
          from_email?: string | null
          html_content: string
          id?: string
          max_attempts?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          subject: string
          template_data?: Json | null
          template_name?: string | null
          text_content?: string | null
          to_email: string
          updated_at?: string | null
        }
        Update: {
          attempts?: number | null
          created_at?: string | null
          error_message?: string | null
          from_email?: string | null
          html_content?: string
          id?: string
          max_attempts?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string
          template_data?: Json | null
          template_name?: string | null
          text_content?: string | null
          to_email?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          created_at: string | null
          html_content: string
          id: string
          is_active: boolean | null
          subject: string
          template_name: string
          text_content: string | null
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          created_at?: string | null
          html_content: string
          id?: string
          is_active?: boolean | null
          subject: string
          template_name: string
          text_content?: string | null
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          created_at?: string | null
          html_content?: string
          id?: string
          is_active?: boolean | null
          subject?: string
          template_name?: string
          text_content?: string | null
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      hosting_plans: {
        Row: {
          annual_price: number | null
          biennial_price: number | null
          category: string
          created_at: string | null
          currency: string | null
          description: string
          features: Json
          id: string
          is_active: boolean | null
          monthly_price: number | null
          name: string
          price: number
          quarterly_price: number | null
          updated_at: string | null
        }
        Insert: {
          annual_price?: number | null
          biennial_price?: number | null
          category: string
          created_at?: string | null
          currency?: string | null
          description: string
          features?: Json
          id?: string
          is_active?: boolean | null
          monthly_price?: number | null
          name: string
          price: number
          quarterly_price?: number | null
          updated_at?: string | null
        }
        Update: {
          annual_price?: number | null
          biennial_price?: number | null
          category?: string
          created_at?: string | null
          currency?: string | null
          description?: string
          features?: Json
          id?: string
          is_active?: boolean | null
          monthly_price?: number | null
          name?: string
          price?: number
          quarterly_price?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          due_date: string
          id: string
          invoice_number: string | null
          order_id: string | null
          paid_at: string | null
          status: Database["public"]["Enums"]["invoice_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          due_date: string
          id?: string
          invoice_number?: string | null
          order_id?: string | null
          paid_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          due_date?: string
          id?: string
          invoice_number?: string | null
          order_id?: string | null
          paid_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          billing_cycle: string | null
          created_at: string | null
          description: string | null
          domain: string | null
          features: Json | null
          id: string
          name: string
          order_id: string
          plan_id: string | null
          quantity: number | null
          renewal_price: number | null
          setup_fee: number | null
          total_price: number
          type: string
          unit_price: number
        }
        Insert: {
          billing_cycle?: string | null
          created_at?: string | null
          description?: string | null
          domain?: string | null
          features?: Json | null
          id?: string
          name: string
          order_id: string
          plan_id?: string | null
          quantity?: number | null
          renewal_price?: number | null
          setup_fee?: number | null
          total_price: number
          type: string
          unit_price: number
        }
        Update: {
          billing_cycle?: string | null
          created_at?: string | null
          description?: string | null
          domain?: string | null
          features?: Json | null
          id?: string
          name?: string
          order_id?: string
          plan_id?: string | null
          quantity?: number | null
          renewal_price?: number | null
          setup_fee?: number | null
          total_price?: number
          type?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "hosting_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          currency: string | null
          discount_amount: number | null
          discount_percentage: number | null
          domain_option: Json | null
          id: string
          items: Json
          notes: string | null
          order_number: string | null
          payment_method: string
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          promo_code: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          subtotal: number
          total: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          domain_option?: Json | null
          id?: string
          items?: Json
          notes?: string | null
          order_number?: string | null
          payment_method: string
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          promo_code?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          subtotal: number
          total: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          domain_option?: Json | null
          id?: string
          items?: Json
          notes?: string | null
          order_number?: string | null
          payment_method?: string
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          promo_code?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          subtotal?: number
          total?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          gateway_response: Json | null
          id: string
          order_id: string
          payment_method: string
          processed_at: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          gateway_response?: Json | null
          id?: string
          order_id: string
          payment_method: string
          processed_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          gateway_response?: Json | null
          id?: string
          order_id?: string
          payment_method?: string
          processed_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          invoice_id: string | null
          payment_method: string
          status: Database["public"]["Enums"]["payment_status"] | null
          transaction_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          invoice_id?: string | null
          payment_method: string
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          invoice_id?: string | null
          payment_method?: string
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          city: string | null
          company: string | null
          country: string | null
          created_at: string | null
          credit_balance: number | null
          email: string
          email_preferences: Json | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          postcode: string | null
          sso_enabled: boolean | null
          state: string | null
          support_pin: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string | null
          credit_balance?: number | null
          email: string
          email_preferences?: Json | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          postcode?: string | null
          sso_enabled?: boolean | null
          state?: string | null
          support_pin?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string | null
          credit_balance?: number | null
          email?: string
          email_preferences?: Json | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          postcode?: string | null
          sso_enabled?: boolean | null
          state?: string | null
          support_pin?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          applicable_categories: string[] | null
          code: string
          created_at: string | null
          description: string | null
          discount_type: string
          discount_value: number
          id: string
          is_active: boolean | null
          max_discount_amount: number | null
          min_order_amount: number | null
          updated_at: string | null
          usage_limit: number | null
          used_count: number | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          applicable_categories?: string[] | null
          code: string
          created_at?: string | null
          description?: string | null
          discount_type?: string
          discount_value: number
          id?: string
          is_active?: boolean | null
          max_discount_amount?: number | null
          min_order_amount?: number | null
          updated_at?: string | null
          usage_limit?: number | null
          used_count?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          applicable_categories?: string[] | null
          code?: string
          created_at?: string | null
          description?: string | null
          discount_type?: string
          discount_value?: number
          id?: string
          is_active?: boolean | null
          max_discount_amount?: number | null
          min_order_amount?: number | null
          updated_at?: string | null
          usage_limit?: number | null
          used_count?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      quotes: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          quote_number: string | null
          status: Database["public"]["Enums"]["quote_status"] | null
          subject: string
          updated_at: string | null
          user_id: string
          valid_until: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          quote_number?: string | null
          status?: Database["public"]["Enums"]["quote_status"] | null
          subject: string
          updated_at?: string | null
          user_id: string
          valid_until: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          quote_number?: string | null
          status?: Database["public"]["Enums"]["quote_status"] | null
          subject?: string
          updated_at?: string | null
          user_id?: string
          valid_until?: string
        }
        Relationships: []
      }
      service_provisioning: {
        Row: {
          created_at: string | null
          domain: string | null
          id: string
          order_id: string
          plan_id: string | null
          provisioned_at: string | null
          provisioning_data: Json | null
          service_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          domain?: string | null
          id?: string
          order_id: string
          plan_id?: string | null
          provisioned_at?: string | null
          provisioning_data?: Json | null
          service_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          domain?: string | null
          id?: string
          order_id?: string
          plan_id?: string | null
          provisioned_at?: string | null
          provisioning_data?: Json | null
          service_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_provisioning_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_provisioning_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "hosting_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_provisioning_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          billing_cycle: string | null
          created_at: string | null
          domain: string | null
          id: string
          next_due_date: string
          plan_id: string
          status: Database["public"]["Enums"]["service_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          billing_cycle?: string | null
          created_at?: string | null
          domain?: string | null
          id?: string
          next_due_date: string
          plan_id: string
          status?: Database["public"]["Enums"]["service_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          billing_cycle?: string | null
          created_at?: string | null
          domain?: string | null
          id?: string
          next_due_date?: string
          plan_id?: string
          status?: Database["public"]["Enums"]["service_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "hosting_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          created_at: string | null
          id: string
          message: string
          priority: Database["public"]["Enums"]["ticket_priority"] | null
          status: Database["public"]["Enums"]["ticket_status"] | null
          subject: string
          ticket_number: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          priority?: Database["public"]["Enums"]["ticket_priority"] | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          subject: string
          ticket_number?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          priority?: Database["public"]["Enums"]["ticket_priority"] | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          subject?: string
          ticket_number?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ticket_replies: {
        Row: {
          created_at: string | null
          id: string
          is_staff_reply: boolean | null
          message: string
          ticket_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_staff_reply?: boolean | null
          message: string
          ticket_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_staff_reply?: boolean | null
          message?: string
          ticket_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_replies_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_invitations: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string | null
          id: string
          inviter_id: string
          permissions: string | null
          status: string | null
          token: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at?: string | null
          id?: string
          inviter_id: string
          permissions?: string | null
          status?: string | null
          token?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string | null
          id?: string
          inviter_id?: string
          permissions?: string | null
          status?: string | null
          token?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      process_email_queue: { Args: never; Returns: undefined }
      trigger_automation_rules: {
        Args: { event_data?: Json; event_name: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      domain_status: "active" | "expired" | "pending" | "cancelled"
      invoice_status: "paid" | "unpaid" | "cancelled" | "refunded"
      order_status: "pending" | "processing" | "completed" | "cancelled"
      payment_status: "pending" | "completed" | "failed" | "cancelled"
      quote_status: "draft" | "sent" | "accepted" | "declined" | "expired"
      service_status: "active" | "suspended" | "cancelled" | "pending"
      ticket_priority: "low" | "medium" | "high" | "urgent"
      ticket_status: "open" | "in_progress" | "resolved" | "closed"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
      domain_status: ["active", "expired", "pending", "cancelled"],
      invoice_status: ["paid", "unpaid", "cancelled", "refunded"],
      order_status: ["pending", "processing", "completed", "cancelled"],
      payment_status: ["pending", "completed", "failed", "cancelled"],
      quote_status: ["draft", "sent", "accepted", "declined", "expired"],
      service_status: ["active", "suspended", "cancelled", "pending"],
      ticket_priority: ["low", "medium", "high", "urgent"],
      ticket_status: ["open", "in_progress", "resolved", "closed"],
    },
  },
} as const
