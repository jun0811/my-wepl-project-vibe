/**
 * Supabase Database Types
 * TODO: Auto-generate with `supabase gen types typescript` after schema setup
 */

export type Database = {
  public: {
    Tables: {
      couples: {
        Row: {
          id: string;
          wedding_date: string | null;
          wedding_time: string | null;
          wedding_hall: string | null;
          region: string | null;
          total_budget: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wedding_date?: string | null;
          wedding_time?: string | null;
          wedding_hall?: string | null;
          region?: string | null;
          total_budget?: number;
        };
        Update: {
          wedding_date?: string | null;
          wedding_time?: string | null;
          wedding_hall?: string | null;
          region?: string | null;
          total_budget?: number;
        };
      };
      profiles: {
        Row: {
          id: string;
          couple_id: string | null;
          nickname: string | null;
          avatar_url: string | null;
          role: "bride" | "groom" | null;
          created_at: string;
        };
        Insert: {
          id: string;
          couple_id?: string | null;
          nickname?: string | null;
          avatar_url?: string | null;
          role?: "bride" | "groom" | null;
        };
        Update: {
          couple_id?: string | null;
          nickname?: string | null;
          avatar_url?: string | null;
          role?: "bride" | "groom" | null;
        };
      };
      categories: {
        Row: {
          id: string;
          couple_id: string;
          name: string;
          icon: string | null;
          budget_amount: number;
          sort_order: number;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          couple_id: string;
          name: string;
          icon?: string | null;
          budget_amount?: number;
          sort_order?: number;
          is_default?: boolean;
        };
        Update: {
          name?: string;
          icon?: string | null;
          budget_amount?: number;
          sort_order?: number;
        };
      };
      expenses: {
        Row: {
          id: string;
          couple_id: string;
          category_id: string;
          title: string;
          amount: number;
          memo: string | null;
          date: string | null;
          tags: string[];
          is_paid: boolean;
          vendor_name: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          couple_id: string;
          category_id: string;
          title: string;
          amount: number;
          memo?: string | null;
          date?: string | null;
          tags?: string[];
          is_paid?: boolean;
          vendor_name?: string | null;
          created_by: string;
        };
        Update: {
          category_id?: string;
          title?: string;
          amount?: number;
          memo?: string | null;
          date?: string | null;
          tags?: string[];
          is_paid?: boolean;
          vendor_name?: string | null;
        };
      };
      schedules: {
        Row: {
          id: string;
          couple_id: string;
          title: string;
          date: string;
          time: string | null;
          location: string | null;
          category_id: string | null;
          memo: string | null;
          is_completed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          couple_id: string;
          title: string;
          date: string;
          time?: string | null;
          location?: string | null;
          category_id?: string | null;
          memo?: string | null;
          is_completed?: boolean;
        };
        Update: {
          title?: string;
          date?: string;
          time?: string | null;
          location?: string | null;
          category_id?: string | null;
          memo?: string | null;
          is_completed?: boolean;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

// Convenience types
export type Couple = Database["public"]["Tables"]["couples"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Expense = Database["public"]["Tables"]["expenses"]["Row"];
export type Schedule = Database["public"]["Tables"]["schedules"]["Row"];

export type InsertExpense = Database["public"]["Tables"]["expenses"]["Insert"];
export type UpdateExpense = Database["public"]["Tables"]["expenses"]["Update"];
export type InsertCategory = Database["public"]["Tables"]["categories"]["Insert"];
