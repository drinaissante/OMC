export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          auth_user_id: string
          email: string
          name: string
          role: "developer" | "administrator"
          status: "active" | "disabled"
          last_login_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_user_id: string
          email: string
          name: string
          role?: "developer" | "administrator"
          status?: "active" | "disabled"
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth_user_id?: string
          email?: string
          name?: string
          role?: "developer" | "administrator"
          status?: "active" | "disabled"
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      plugins: {
        Row: {
          id: string
          display_id: number
          name: string
          description: string | null
          version: string
          icon_url: string | null
          documentation_url: string | null
          licensing_enabled: boolean
          status: "active" | "inactive"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          display_id?: never
          name: string
          description?: string | null
          version?: string
          icon_url?: string | null
          documentation_url?: string | null
          licensing_enabled?: boolean
          status?: "active" | "inactive"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_id?: never
          name?: string
          description?: string | null
          version?: string
          icon_url?: string | null
          documentation_url?: string | null
          licensing_enabled?: boolean
          status?: "active" | "inactive"
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      licenses: {
        Row: {
          id: string
          display_id: number
          license_key: string
          plugin_id: string
          customer_name: string
          customer_email: string
          license_type: "lifetime" | "subscription" | "trial"
          status: "active" | "revoked" | "expired" | "pending"
          expiration_date: string | null
          max_validations: number
          current_validations: number
          allowed_deployments: number
          notes: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          display_id?: never
          license_key: string
          plugin_id: string
          customer_name: string
          customer_email: string
          license_type: "lifetime" | "subscription" | "trial"
          status?: "active" | "revoked" | "expired" | "pending"
          expiration_date?: string | null
          max_validations?: number
          current_validations?: number
          allowed_deployments?: number
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_id?: never
          license_key?: string
          plugin_id?: string
          customer_name?: string
          customer_email?: string
          license_type?: "lifetime" | "subscription" | "trial"
          status?: "active" | "revoked" | "expired" | "pending"
          expiration_date?: string | null
          max_validations?: number
          current_validations?: number
          allowed_deployments?: number
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "licenses_plugin_id_fkey"
            columns: ["plugin_id"]
            isOneToOne: false
            referencedRelation: "plugins"
            referencedColumns: ["id"]
          }
        ]
      }
      deployments: {
        Row: {
          id: string
          display_id: number
          license_id: string
          deployment_type: "standalone" | "proxy"
          status: "online" | "offline" | "suspended" | "blacklisted"
          public_ip: string | null
          port: number | null
          installation_uuid: string | null
          machine_fingerprint: string | null
          software: string | null
          minecraft_version: string | null
          java_version: string | null
          os: string | null
          country: string | null
          online_mode: boolean | null
          first_activated_at: string | null
          last_seen_at: string | null
          validation_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          display_id?: never
          license_id: string
          deployment_type: "standalone" | "proxy"
          status?: "online" | "offline" | "suspended" | "blacklisted"
          public_ip?: string | null
          port?: number | null
          installation_uuid?: string | null
          machine_fingerprint?: string | null
          software?: string | null
          minecraft_version?: string | null
          java_version?: string | null
          os?: string | null
          country?: string | null
          online_mode?: boolean | null
          first_activated_at?: string | null
          last_seen_at?: string | null
          validation_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_id?: never
          license_id?: string
          deployment_type?: "standalone" | "proxy"
          status?: "online" | "offline" | "suspended" | "blacklisted"
          public_ip?: string | null
          port?: number | null
          installation_uuid?: string | null
          machine_fingerprint?: string | null
          software?: string | null
          minecraft_version?: string | null
          java_version?: string | null
          os?: string | null
          country?: string | null
          online_mode?: boolean | null
          first_activated_at?: string | null
          last_seen_at?: string | null
          validation_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deployments_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "licenses"
            referencedColumns: ["id"]
          }
        ]
      }
      backend_servers: {
        Row: {
          id: string
          deployment_id: string
          server_name: string
          software: string | null
          minecraft_version: string | null
          plugin_version: string | null
          online_status: string
          last_seen_at: string | null
          internal_identifier: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          deployment_id: string
          server_name: string
          software?: string | null
          minecraft_version?: string | null
          plugin_version?: string | null
          online_status?: string
          last_seen_at?: string | null
          internal_identifier?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          deployment_id?: string
          server_name?: string
          software?: string | null
          minecraft_version?: string | null
          plugin_version?: string | null
          online_status?: string
          last_seen_at?: string | null
          internal_identifier?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "backend_servers_deployment_id_fkey"
            columns: ["deployment_id"]
            isOneToOne: false
            referencedRelation: "deployments"
            referencedColumns: ["id"]
          }
        ]
      }
      validations: {
        Row: {
          id: string
          deployment_id: string
          license_id: string
          status: "success" | "failure"
          failure_reason: string | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          deployment_id: string
          license_id: string
          status: "success" | "failure"
          failure_reason?: string | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          deployment_id?: string
          license_id?: string
          status?: "success" | "failure"
          failure_reason?: string | null
          ip_address?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "validations_deployment_id_fkey"
            columns: ["deployment_id"]
            isOneToOne: false
            referencedRelation: "deployments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "validations_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "licenses"
            referencedColumns: ["id"]
          }
        ]
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          resource_type: string
          resource_id: string | null
          ip_address: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          resource_type: string
          resource_id?: string | null
          ip_address?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          resource_type?: string
          resource_id?: string | null
          ip_address?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      settings: {
        Row: {
          id: string
          key: string
          value: Json
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          read: boolean
          type: "info" | "warning" | "error" | "success"
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          read?: boolean
          type?: "info" | "warning" | "error" | "success"
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          read?: boolean
          type?: "info" | "warning" | "error" | "success"
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      delete_plugin: {
        Args: { p_plugin_id: string }
        Returns: undefined
      }
      record_successful_validation: {
        Args: { p_license_id: string; p_deployment_id: string; p_ip_address?: string | null }
        Returns: undefined
      }
    }
    Enums: Record<string, never>
  }
}
