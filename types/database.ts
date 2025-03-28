export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
          preferences: Json | null
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
          preferences?: Json | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
          preferences?: Json | null
        }
      }
      dreams: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          date: string
          tags: string[]
          ai_interpretation: string | null
          created_at: string
          updated_at: string
          is_private: boolean
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          date: string
          tags?: string[]
          ai_interpretation?: string | null
          created_at?: string
          updated_at?: string
          is_private?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          date?: string
          tags?: string[]
          ai_interpretation?: string | null
          created_at?: string
          updated_at?: string
          is_private?: boolean
        }
      }
      tags: {
        Row: {
          id: string
          user_id: string
          name: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          color: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          color?: string
          created_at?: string
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
      [_ in never]: never
    }
  }
} 