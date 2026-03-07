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
        Relationships: [];
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
        Relationships: [
          {
            foreignKeyName: "profiles_couple_id_fkey";
            columns: ["couple_id"];
            isOneToOne: false;
            referencedRelation: "couples";
            referencedColumns: ["id"];
          },
        ];
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
        Relationships: [
          {
            foreignKeyName: "categories_couple_id_fkey";
            columns: ["couple_id"];
            isOneToOne: false;
            referencedRelation: "couples";
            referencedColumns: ["id"];
          },
        ];
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
          vendor_rating: number | null;
          price_feeling: "cheap" | "fair" | "expensive" | null;
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
          vendor_rating?: number | null;
          price_feeling?: "cheap" | "fair" | "expensive" | null;
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
          vendor_rating?: number | null;
          price_feeling?: "cheap" | "fair" | "expensive" | null;
        };
        Relationships: [
          {
            foreignKeyName: "expenses_couple_id_fkey";
            columns: ["couple_id"];
            isOneToOne: false;
            referencedRelation: "couples";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "expenses_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
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
          is_recommended: boolean;
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
          is_recommended?: boolean;
        };
        Update: {
          title?: string;
          date?: string;
          time?: string | null;
          location?: string | null;
          category_id?: string | null;
          memo?: string | null;
          is_completed?: boolean;
          is_recommended?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "schedules_couple_id_fkey";
            columns: ["couple_id"];
            isOneToOne: false;
            referencedRelation: "couples";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "schedules_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      anonymous_stats: {
        Row: {
          id: string;
          region: string | null;
          category_name: string;
          amount: number;
          vendor_type: string | null;
          tags: string[];
          wedding_year: number | null;
          wedding_month: number | null;
          price_feeling: "cheap" | "fair" | "expensive" | null;
          collected_at: string;
        };
        Insert: {
          id?: string;
          region?: string | null;
          category_name: string;
          amount: number;
          vendor_type?: string | null;
          tags?: string[];
          wedding_year?: number | null;
          wedding_month?: number | null;
          price_feeling?: "cheap" | "fair" | "expensive" | null;
        };
        Update: {
          region?: string | null;
          category_name?: string;
          amount?: number;
          vendor_type?: string | null;
          tags?: string[];
          wedding_year?: number | null;
          wedding_month?: number | null;
          price_feeling?: "cheap" | "fair" | "expensive" | null;
        };
        Relationships: [];
      };
    };
    Views: {
      category_averages: {
        Row: {
          region: string | null;
          category_name: string;
          data_count: number;
          avg_amount: number;
          median_amount: number;
          min_amount: number;
          max_amount: number;
          p25_amount: number;
          p75_amount: number;
        };
        Relationships: [];
      };
    };
    Functions: {
      find_couple_by_code: {
        Args: { p_code: string };
        Returns: string | null;
      };
      join_partner_couple: {
        Args: { p_target_couple_id: string };
        Returns: undefined;
      };
      delete_user_account: {
        Args: Record<string, never>;
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
  };
};

// Convenience types
export type Couple = Database["public"]["Tables"]["couples"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Expense = Database["public"]["Tables"]["expenses"]["Row"];
export type Schedule = Database["public"]["Tables"]["schedules"]["Row"];
export type AnonymousStat = Database["public"]["Tables"]["anonymous_stats"]["Row"];

export type InsertExpense = Database["public"]["Tables"]["expenses"]["Insert"];
export type UpdateExpense = Database["public"]["Tables"]["expenses"]["Update"];
export type InsertCategory = Database["public"]["Tables"]["categories"]["Insert"];
export type InsertSchedule = Database["public"]["Tables"]["schedules"]["Insert"];
export type UpdateSchedule = Database["public"]["Tables"]["schedules"]["Update"];
