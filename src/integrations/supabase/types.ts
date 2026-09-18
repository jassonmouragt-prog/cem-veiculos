export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      financial_audit_log: {
        Row: {
          action: string;
          changed_fields: string[] | null;
          created_at: string;
          id: string;
          new_data: Json | null;
          old_data: Json | null;
          record_id: string;
          table_name: string;
          user_id: string | null;
        };
        Insert: {
          action: string;
          changed_fields?: string[] | null;
          created_at?: string;
          id?: string;
          new_data?: Json | null;
          old_data?: Json | null;
          record_id: string;
          table_name: string;
          user_id?: string | null;
        };
        Update: {
          action?: string;
          changed_fields?: string[] | null;
          created_at?: string;
          id?: string;
          new_data?: Json | null;
          old_data?: Json | null;
          record_id?: string;
          table_name?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      financial_transactions: {
        Row: {
          amount: number;
          category: Database["public"]["Enums"]["transaction_category"];
          client: string | null;
          created_at: string;
          created_by: string | null;
          description: string;
          due_date: string | null;
          id: string;
          notes: string | null;
          paid_date: string | null;
          payment_method: Database["public"]["Enums"]["payment_method"] | null;
          sale_id: string | null;
          seller_id: string | null;
          status: Database["public"]["Enums"]["payment_status"];
          supplier: string | null;
          transaction_date: string;
          type: Database["public"]["Enums"]["transaction_type"];
          updated_at: string;
          updated_by: string | null;
          vehicle_id: string | null;
        };
        Insert: {
          amount: number;
          category: Database["public"]["Enums"]["transaction_category"];
          client?: string | null;
          created_at?: string;
          created_by?: string | null;
          description: string;
          due_date?: string | null;
          id?: string;
          notes?: string | null;
          paid_date?: string | null;
          payment_method?: Database["public"]["Enums"]["payment_method"] | null;
          sale_id?: string | null;
          seller_id?: string | null;
          status?: Database["public"]["Enums"]["payment_status"];
          supplier?: string | null;
          transaction_date?: string;
          type: Database["public"]["Enums"]["transaction_type"];
          updated_at?: string;
          updated_by?: string | null;
          vehicle_id?: string | null;
        };
        Update: {
          amount?: number;
          category?: Database["public"]["Enums"]["transaction_category"];
          client?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string;
          due_date?: string | null;
          id?: string;
          notes?: string | null;
          paid_date?: string | null;
          payment_method?: Database["public"]["Enums"]["payment_method"] | null;
          sale_id?: string | null;
          seller_id?: string | null;
          status?: Database["public"]["Enums"]["payment_status"];
          supplier?: string | null;
          transaction_date?: string;
          type?: Database["public"]["Enums"]["transaction_type"];
          updated_at?: string;
          updated_by?: string | null;
          vehicle_id?: string | null;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          created_at: string;
          email: string | null;
          id: string;
          message: string | null;
          name: string;
          phone: string;
          status: Database["public"]["Enums"]["lead_status"];
          updated_at: string;
          vehicle_id: string | null;
          vehicle_name: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id?: string;
          message?: string | null;
          name: string;
          phone: string;
          status?: Database["public"]["Enums"]["lead_status"];
          updated_at?: string;
          vehicle_id?: string | null;
          vehicle_name?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          id?: string;
          message?: string | null;
          name?: string;
          phone?: string;
          status?: Database["public"]["Enums"]["lead_status"];
          updated_at?: string;
          vehicle_id?: string | null;
          vehicle_name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "leads_vehicle_id_fkey";
            columns: ["vehicle_id"];
            isOneToOne: false;
            referencedRelation: "vehicles";
            referencedColumns: ["id"];
          },
        ];
      };
      sales: {
        Row: {
          acquisition_cost: number;
          announced_price: number;
          commission_rate: number;
          commission_value: number;
          created_at: string;
          created_by: string | null;
          discount_amount: number;
          discount_percent: number;
          down_payment: number;
          financed_amount: number;
          final_price: number;
          gross_margin: number;
          had_negotiation: boolean;
          id: string;
          net_margin: number;
          notes: string | null;
          payment_method: Database["public"]["Enums"]["payment_method"];
          sale_date: string;
          seller_id: string | null;
          status: Database["public"]["Enums"]["sale_status"];
          total_expenses: number;
          total_received: number;
          total_to_receive: number;
          updated_at: string;
          updated_by: string | null;
          vehicle_id: string | null;
        };
        Insert: {
          acquisition_cost: number;
          announced_price: number;
          commission_rate?: number;
          commission_value?: number;
          created_at?: string;
          created_by?: string | null;
          discount_amount?: number;
          discount_percent?: number;
          down_payment?: number;
          financed_amount?: number;
          final_price: number;
          had_negotiation?: boolean;
          id?: string;
          notes?: string | null;
          payment_method?: Database["public"]["Enums"]["payment_method"];
          sale_date?: string;
          seller_id?: string | null;
          status?: Database["public"]["Enums"]["sale_status"];
          total_expenses?: number;
          total_received?: number;
          total_to_receive?: number;
          updated_at?: string;
          updated_by?: string | null;
          vehicle_id?: string | null;
        };
        Update: {
          acquisition_cost?: number;
          announced_price?: number;
          commission_rate?: number;
          commission_value?: number;
          created_at?: string;
          created_by?: string | null;
          discount_amount?: number;
          discount_percent?: number;
          down_payment?: number;
          financed_amount?: number;
          final_price?: number;
          had_negotiation?: boolean;
          id?: string;
          notes?: string | null;
          payment_method?: Database["public"]["Enums"]["payment_method"];
          sale_date?: string;
          seller_id?: string | null;
          status?: Database["public"]["Enums"]["sale_status"];
          total_expenses?: number;
          total_received?: number;
          total_to_receive?: number;
          updated_at?: string;
          updated_by?: string | null;
          vehicle_id?: string | null;
        };
        Relationships: [];
      };
      sellers: {
        Row: {
          can_receive_commission: boolean;
          commission_rate: number;
          created_at: string;
          email: string | null;
          id: string;
          is_active: boolean;
          name: string;
          phone: string | null;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          can_receive_commission?: boolean;
          commission_rate?: number;
          created_at?: string;
          email?: string | null;
          id?: string;
          is_active?: boolean;
          name: string;
          phone?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          can_receive_commission?: boolean;
          commission_rate?: number;
          created_at?: string;
          email?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string;
          phone?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          address: string;
          city: string;
          created_at: string;
          dealer_name: string;
          email: string;
          hours_saturday: string;
          hours_weekdays: string;
          id: string;
          updated_at: string;
          whatsapp_primary: string;
          whatsapp_secondary: string;
        };
        Insert: {
          address?: string;
          city?: string;
          created_at?: string;
          dealer_name?: string;
          email?: string;
          hours_saturday?: string;
          hours_weekdays?: string;
          id?: string;
          updated_at?: string;
          whatsapp_primary?: string;
          whatsapp_secondary?: string;
        };
        Update: {
          address?: string;
          city?: string;
          created_at?: string;
          dealer_name?: string;
          email?: string;
          hours_saturday?: string;
          hours_weekdays?: string;
          id?: string;
          updated_at?: string;
          whatsapp_primary?: string;
          whatsapp_secondary?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
      vehicle_expenses: {
        Row: {
          amount: number;
          category: Database["public"]["Enums"]["transaction_category"];
          created_at: string;
          created_by: string | null;
          description: string;
          expense_date: string;
          id: string;
          notes: string | null;
          paid_date: string | null;
          payment_method: Database["public"]["Enums"]["payment_method"] | null;
          payment_status: Database["public"]["Enums"]["payment_status"];
          supplier: string | null;
          updated_at: string;
          updated_by: string | null;
          vehicle_id: string;
        };
        Insert: {
          amount: number;
          category: Database["public"]["Enums"]["transaction_category"];
          created_at?: string;
          created_by?: string | null;
          description: string;
          expense_date?: string;
          id?: string;
          notes?: string | null;
          paid_date?: string | null;
          payment_method?: Database["public"]["Enums"]["payment_method"] | null;
          payment_status?: Database["public"]["Enums"]["payment_status"];
          supplier?: string | null;
          updated_at?: string;
          updated_by?: string | null;
          vehicle_id: string;
        };
        Update: {
          amount?: number;
          category?: Database["public"]["Enums"]["transaction_category"];
          created_at?: string;
          created_by?: string | null;
          description?: string;
          expense_date?: string;
          id?: string;
          notes?: string | null;
          paid_date?: string | null;
          payment_method?: Database["public"]["Enums"]["payment_method"] | null;
          payment_status?: Database["public"]["Enums"]["payment_status"];
          supplier?: string | null;
          updated_at?: string;
          updated_by?: string | null;
          vehicle_id?: string;
        };
        Relationships: [];
      };
      vehicles: {
        Row: {
          accepts_financing: boolean;
          accepts_trade: boolean;
          acquisition_cost: number;
          brand: string;
          category: string;
          color: string;
          created_at: string;
          dealer_maintained: boolean;
          description: string;
          doors: number;
          engine: string;
          entry_value: number | null;
          features: string[];
          fuel: string;
          id: string;
          images: string[];
          installment_value: number | null;
          installments_count: number | null;
          is_featured: boolean;
          main_image_index: number;
          manufacturing_year: number;
          mileage: number;
          model: string;
          model_year: number;
          name: string;
          power_hp: number | null;
          price: number;
          single_owner: boolean;
          slug: string;
          status: Database["public"]["Enums"]["vehicle_status"];
          stock_entry_date: string;
          transmission: string;
          updated_at: string;
          version: string;
        };
        Insert: {
          accepts_financing?: boolean;
          accepts_trade?: boolean;
          acquisition_cost?: number;
          brand?: string;
          category?: string;
          color?: string;
          created_at?: string;
          dealer_maintained?: boolean;
          description?: string;
          doors?: number;
          engine?: string;
          entry_value?: number | null;
          features?: string[];
          fuel?: string;
          id?: string;
          images?: string[];
          installment_value?: number | null;
          installments_count?: number | null;
          is_featured?: boolean;
          main_image_index?: number;
          manufacturing_year?: number;
          mileage?: number;
          model?: string;
          model_year?: number;
          name: string;
          power_hp?: number | null;
          price?: number;
          single_owner?: boolean;
          slug: string;
          status?: Database["public"]["Enums"]["vehicle_status"];
          stock_entry_date?: string;
          transmission?: string;
          updated_at?: string;
          version?: string;
        };
        Update: {
          accepts_financing?: boolean;
          accepts_trade?: boolean;
          acquisition_cost?: number;
          brand?: string;
          category?: string;
          color?: string;
          created_at?: string;
          dealer_maintained?: boolean;
          description?: string;
          doors?: number;
          engine?: string;
          entry_value?: number | null;
          features?: string[];
          fuel?: string;
          id?: string;
          images?: string[];
          installment_value?: number | null;
          installments_count?: number | null;
          is_featured?: boolean;
          main_image_index?: number;
          manufacturing_year?: number;
          mileage?: number;
          model?: string;
          model_year?: number;
          name?: string;
          power_hp?: number | null;
          price?: number;
          single_owner?: boolean;
          slug?: string;
          status?: Database["public"]["Enums"]["vehicle_status"];
          stock_entry_date?: string;
          transmission?: string;
          updated_at?: string;
          version?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "admin" | "user";
      commission_status: "pendente" | "a_pagar" | "pago";
      lead_status: "novo" | "em_atendimento" | "concluido" | "descartado";
      payment_method:
        | "a_vista"
        | "financiamento"
        | "entrada_financiamento"
        | "consorcio"
        | "pix"
        | "transferencia"
        | "cartao"
        | "outro";
      payment_status: "pendente" | "pago" | "atrasado" | "cancelado";
      sale_status: "concluida" | "cancelada";
      transaction_category:
        | "venda_veiculo"
        | "sinal_veiculo"
        | "recebimento_financiamento"
        | "recebimento_parcelado"
        | "servicos"
        | "outros_recebimentos"
        | "compra_veiculo"
        | "comissao"
        | "manutencao"
        | "documentacao"
        | "despachante"
        | "lavagem"
        | "combustivel"
        | "marketing"
        | "trafego_pago"
        | "aluguel"
        | "energia"
        | "agua"
        | "internet"
        | "contabilidade"
        | "salarios"
        | "pro_labore"
        | "impostos"
        | "seguros"
        | "fornecedores"
        | "equipamentos"
        | "escritorio"
        | "outros";
      transaction_type: "entrada" | "saida";
      vehicle_status: "disponivel" | "reservado" | "vendido";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      commission_status: ["pendente", "a_pagar", "pago"],
      lead_status: ["novo", "em_atendimento", "concluido", "descartado"],
      payment_method: [
        "a_vista",
        "financiamento",
        "entrada_financiamento",
        "consorcio",
        "pix",
        "transferencia",
        "cartao",
        "outro",
      ],
      payment_status: ["pendente", "pago", "atrasado", "cancelado"],
      sale_status: ["concluida", "cancelada"],
      transaction_category: [
        "venda_veiculo",
        "sinal_veiculo",
        "recebimento_financiamento",
        "recebimento_parcelado",
        "servicos",
        "outros_recebimentos",
        "compra_veiculo",
        "comissao",
        "manutencao",
        "documentacao",
        "despachante",
        "lavagem",
        "combustivel",
        "marketing",
        "trafego_pago",
        "aluguel",
        "energia",
        "agua",
        "internet",
        "contabilidade",
        "salarios",
        "pro_labore",
        "impostos",
        "seguros",
        "fornecedores",
        "equipamentos",
        "escritorio",
        "outros",
      ],
      transaction_type: ["entrada", "saida"],
      vehicle_status: ["disponivel", "reservado", "vendido"],
    },
  },
} as const;