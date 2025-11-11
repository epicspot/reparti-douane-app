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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      affaires: {
        Row: {
          adresse_complete: string | null
          circonstances: string | null
          commissionnaire_en_d: string | null
          composition_dossier: string | null
          created_at: string
          date_affaire: string
          date_de_la_transaction_provisoire: string | null
          date_declaration: string | null
          date_quittance: string | null
          droits_compromis_ou_eludes: number | null
          id: string
          identification_mt: string | null
          ifu: string | null
          montant_amende_ou_vente: number | null
          montant_net: number
          montant_total: number
          montant_total_des_frais: number | null
          nature_de_l_infraction: string | null
          nature_des_marchandises_de_fraude: string | null
          nature_et_moyen_de_transport: string | null
          nom_intervenants: string | null
          nom_prenom_contrevenant: string | null
          nom_saisissants: string | null
          nombre: number | null
          nombre_informateurs: number | null
          noms_des_chefs: string | null
          notes_supplementaires: string | null
          num_declaration: string | null
          num_quittance: string | null
          num_quittance_dce: string | null
          numero: string
          numero_dossier_office: string | null
          office: string | null
          origine_ou_provenance: string | null
          procede_de_detection: string | null
          region: string | null
          suite_de_l_affaire: string | null
          suite_reservee_aux_mdses: string | null
          updated_at: string
          valeur_des_marchandises_litigieuses: number | null
        }
        Insert: {
          adresse_complete?: string | null
          circonstances?: string | null
          commissionnaire_en_d?: string | null
          composition_dossier?: string | null
          created_at?: string
          date_affaire: string
          date_de_la_transaction_provisoire?: string | null
          date_declaration?: string | null
          date_quittance?: string | null
          droits_compromis_ou_eludes?: number | null
          id?: string
          identification_mt?: string | null
          ifu?: string | null
          montant_amende_ou_vente?: number | null
          montant_net: number
          montant_total?: number
          montant_total_des_frais?: number | null
          nature_de_l_infraction?: string | null
          nature_des_marchandises_de_fraude?: string | null
          nature_et_moyen_de_transport?: string | null
          nom_intervenants?: string | null
          nom_prenom_contrevenant?: string | null
          nom_saisissants?: string | null
          nombre?: number | null
          nombre_informateurs?: number | null
          noms_des_chefs?: string | null
          notes_supplementaires?: string | null
          num_declaration?: string | null
          num_quittance?: string | null
          num_quittance_dce?: string | null
          numero: string
          numero_dossier_office?: string | null
          office?: string | null
          origine_ou_provenance?: string | null
          procede_de_detection?: string | null
          region?: string | null
          suite_de_l_affaire?: string | null
          suite_reservee_aux_mdses?: string | null
          updated_at?: string
          valeur_des_marchandises_litigieuses?: number | null
        }
        Update: {
          adresse_complete?: string | null
          circonstances?: string | null
          commissionnaire_en_d?: string | null
          composition_dossier?: string | null
          created_at?: string
          date_affaire?: string
          date_de_la_transaction_provisoire?: string | null
          date_declaration?: string | null
          date_quittance?: string | null
          droits_compromis_ou_eludes?: number | null
          id?: string
          identification_mt?: string | null
          ifu?: string | null
          montant_amende_ou_vente?: number | null
          montant_net?: number
          montant_total?: number
          montant_total_des_frais?: number | null
          nature_de_l_infraction?: string | null
          nature_des_marchandises_de_fraude?: string | null
          nature_et_moyen_de_transport?: string | null
          nom_intervenants?: string | null
          nom_prenom_contrevenant?: string | null
          nom_saisissants?: string | null
          nombre?: number | null
          nombre_informateurs?: number | null
          noms_des_chefs?: string | null
          notes_supplementaires?: string | null
          num_declaration?: string | null
          num_quittance?: string | null
          num_quittance_dce?: string | null
          numero?: string
          numero_dossier_office?: string | null
          office?: string | null
          origine_ou_provenance?: string | null
          procede_de_detection?: string | null
          region?: string | null
          suite_de_l_affaire?: string | null
          suite_reservee_aux_mdses?: string | null
          updated_at?: string
          valeur_des_marchandises_litigieuses?: number | null
        }
        Relationships: []
      }
      beneficiaires: {
        Row: {
          affaire_id: string
          created_at: string
          id: string
          montant: number
          nom: string
          pourcentage: number
          type: string
        }
        Insert: {
          affaire_id: string
          created_at?: string
          id?: string
          montant?: number
          nom: string
          pourcentage?: number
          type: string
        }
        Update: {
          affaire_id?: string
          created_at?: string
          id?: string
          montant?: number
          nom?: string
          pourcentage?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "beneficiaires_affaire_id_fkey"
            columns: ["affaire_id"]
            isOneToOne: false
            referencedRelation: "affaires"
            referencedColumns: ["id"]
          },
        ]
      }
      chefs: {
        Row: {
          created_at: string
          id: string
          nom: string
          pourcentage: number
        }
        Insert: {
          created_at?: string
          id?: string
          nom: string
          pourcentage?: number
        }
        Update: {
          created_at?: string
          id?: string
          nom?: string
          pourcentage?: number
        }
        Relationships: []
      }
      fonds: {
        Row: {
          created_at: string
          id: string
          nom: string
          pourcentage: number
        }
        Insert: {
          created_at?: string
          id?: string
          nom: string
          pourcentage?: number
        }
        Update: {
          created_at?: string
          id?: string
          nom?: string
          pourcentage?: number
        }
        Relationships: []
      }
      settings: {
        Row: {
          key: string
          updated_at: string
          val: string | null
        }
        Insert: {
          key: string
          updated_at?: string
          val?: string | null
        }
        Update: {
          key?: string
          updated_at?: string
          val?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_affaire_numero: {
        Args: { p_date_affaire: string; p_office: string }
        Returns: string
      }
      generate_numero_dossier_office: {
        Args: { p_date_affaire: string; p_office: string }
        Returns: string
      }
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
