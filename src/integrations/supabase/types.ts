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
      admins: {
        Row: {
          created_at: string | null
          email: string
          id: number
          password_hash: string
          username: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: number
          password_hash: string
          username: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: number
          password_hash?: string
          username?: string
        }
        Relationships: []
      }
      catalogue_produits: {
        Row: {
          actif: boolean
          categorie_id: number
          code: number
          coefficient: number
          created_at: string
          designation: string
          id: number
          prix_achat: number
          prix_moyen_achat: number
          prix_vente: number
          stock_disponible: number
          stock_reel: number
          taux_tva: number
          updated_at: string
          valeur_stock: number
        }
        Insert: {
          actif?: boolean
          categorie_id: number
          code: number
          coefficient?: number
          created_at?: string
          designation: string
          id?: number
          prix_achat?: number
          prix_moyen_achat?: number
          prix_vente?: number
          stock_disponible?: number
          stock_reel?: number
          taux_tva?: number
          updated_at?: string
          valeur_stock?: number
        }
        Update: {
          actif?: boolean
          categorie_id?: number
          code?: number
          coefficient?: number
          created_at?: string
          designation?: string
          id?: number
          prix_achat?: number
          prix_moyen_achat?: number
          prix_vente?: number
          stock_disponible?: number
          stock_reel?: number
          taux_tva?: number
          updated_at?: string
          valeur_stock?: number
        }
        Relationships: [
          {
            foreignKeyName: "catalogue_produits_categorie_id_fkey"
            columns: ["categorie_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: number
          nom: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: number
          nom: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: number
          nom?: string
        }
        Relationships: []
      }
      commande_details: {
        Row: {
          commande_id: number
          id: number
          pneu_id: number
          prix_unitaire: number
          quantite: number
        }
        Insert: {
          commande_id: number
          id?: number
          pneu_id: number
          prix_unitaire: number
          quantite: number
        }
        Update: {
          commande_id?: number
          id?: number
          pneu_id?: number
          prix_unitaire?: number
          quantite?: number
        }
        Relationships: [
          {
            foreignKeyName: "commande_details_commande_id_fkey"
            columns: ["commande_id"]
            isOneToOne: false
            referencedRelation: "commandes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commande_details_pneu_id_fkey"
            columns: ["pneu_id"]
            isOneToOne: false
            referencedRelation: "pneus"
            referencedColumns: ["id"]
          },
        ]
      }
      commandes: {
        Row: {
          adresse: string | null
          created_at: string | null
          date_facture: string | null
          email: string
          facture_generee: boolean | null
          id: number
          nom: string
          numero_facture: string | null
          statut: string | null
          telephone: string | null
          total: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          adresse?: string | null
          created_at?: string | null
          date_facture?: string | null
          email: string
          facture_generee?: boolean | null
          id?: number
          nom: string
          numero_facture?: string | null
          statut?: string | null
          telephone?: string | null
          total: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          adresse?: string | null
          created_at?: string | null
          date_facture?: string | null
          email?: string
          facture_generee?: boolean | null
          id?: number
          nom?: string
          numero_facture?: string | null
          statut?: string | null
          telephone?: string | null
          total?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      marques_voitures: {
        Row: {
          created_at: string
          id: number
          logo_url: string | null
          nom: string
        }
        Insert: {
          created_at?: string
          id?: number
          logo_url?: string | null
          nom: string
        }
        Update: {
          created_at?: string
          id?: number
          logo_url?: string | null
          nom?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          created_at: string | null
          email: string
          id: number
          lu: boolean | null
          message: string
          nom: string
          sujet: string | null
          telephone: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: number
          lu?: boolean | null
          message: string
          nom: string
          sujet?: string | null
          telephone?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: number
          lu?: boolean | null
          message?: string
          nom?: string
          sujet?: string | null
          telephone?: string | null
        }
        Relationships: []
      }
      modeles_voitures: {
        Row: {
          annee_debut: number
          annee_fin: number | null
          created_at: string
          dimensions_pneus: string[]
          id: number
          marque_id: number
          nom: string
        }
        Insert: {
          annee_debut: number
          annee_fin?: number | null
          created_at?: string
          dimensions_pneus: string[]
          id?: number
          marque_id: number
          nom: string
        }
        Update: {
          annee_debut?: number
          annee_fin?: number | null
          created_at?: string
          dimensions_pneus?: string[]
          id?: number
          marque_id?: number
          nom?: string
        }
        Relationships: [
          {
            foreignKeyName: "modeles_voitures_marque_id_fkey"
            columns: ["marque_id"]
            isOneToOne: false
            referencedRelation: "marques_voitures"
            referencedColumns: ["id"]
          },
        ]
      }
      panier: {
        Row: {
          created_at: string
          id: string
          pneu_id: number
          quantite: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          pneu_id: number
          quantite: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          pneu_id?: number
          quantite?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "panier_pneu_id_fkey"
            columns: ["pneu_id"]
            isOneToOne: false
            referencedRelation: "pneus"
            referencedColumns: ["id"]
          },
        ]
      }
      pneus: {
        Row: {
          created_at: string | null
          description: string | null
          dimensions: string
          id: number
          image_url: string | null
          marque: string
          modele: string
          prix: number
          stock: number | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          dimensions: string
          id?: number
          image_url?: string | null
          marque: string
          modele: string
          prix: number
          stock?: number | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          dimensions?: string
          id?: number
          image_url?: string | null
          marque?: string
          modele?: string
          prix?: number
          stock?: number | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          adresse: string | null
          code_postal: string | null
          created_at: string
          id: string
          nom: string | null
          prenom: string | null
          telephone: string | null
          updated_at: string
          ville: string | null
        }
        Insert: {
          adresse?: string | null
          code_postal?: string | null
          created_at?: string
          id: string
          nom?: string | null
          prenom?: string | null
          telephone?: string | null
          updated_at?: string
          ville?: string | null
        }
        Update: {
          adresse?: string | null
          code_postal?: string | null
          created_at?: string
          id?: string
          nom?: string | null
          prenom?: string | null
          telephone?: string | null
          updated_at?: string
          ville?: string | null
        }
        Relationships: []
      }
      rendez_vous: {
        Row: {
          commentaire: string | null
          created_at: string
          date_rdv: string
          email: string
          heure_debut: string
          heure_fin: string
          id: string
          nom: string
          service: string
          statut: string | null
          telephone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          commentaire?: string | null
          created_at?: string
          date_rdv: string
          email: string
          heure_debut: string
          heure_fin: string
          id?: string
          nom: string
          service: string
          statut?: string | null
          telephone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          commentaire?: string | null
          created_at?: string
          date_rdv?: string
          email?: string
          heure_debut?: string
          heure_fin?: string
          id?: string
          nom?: string
          service?: string
          statut?: string | null
          telephone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          actif: boolean | null
          created_at: string
          description: string | null
          duree_minutes: number
          id: string
          nom: string
          prix: number | null
        }
        Insert: {
          actif?: boolean | null
          created_at?: string
          description?: string | null
          duree_minutes?: number
          id?: string
          nom: string
          prix?: number | null
        }
        Update: {
          actif?: boolean | null
          created_at?: string
          description?: string | null
          duree_minutes?: number
          id?: string
          nom?: string
          prix?: number | null
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
          role?: Database["public"]["Enums"]["app_role"]
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
      generer_facture_commande: {
        Args: { commande_id: number }
        Returns: boolean
      }
      generer_numero_facture: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: {
        Args: { user_id?: string }
        Returns: boolean
      }
      promote_user_to_admin: {
        Args: { user_email: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "client"
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
      app_role: ["admin", "client"],
    },
  },
} as const
