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
      alternativas: {
        Row: {
          id: string
          perfis: string[] | null
          pergunta_id: string | null
          texto: string
        }
        Insert: {
          id?: string
          perfis?: string[] | null
          pergunta_id?: string | null
          texto: string
        }
        Update: {
          id?: string
          perfis?: string[] | null
          pergunta_id?: string | null
          texto?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_alternativas_pergunta"
            columns: ["pergunta_id"]
            isOneToOne: false
            referencedRelation: "perguntas"
            referencedColumns: ["id"]
          },
        ]
      }
      perfis: {
        Row: {
          artimanha: string | null
          demonio_associado: string | null
          descricao: string | null
          destino: string | null
          dores: string[] | null
          emocao_predominante: string | null
          exaltacao: string | null
          formacao: string | null
          id: string
          influencia: string | null
          licao_espiritual: string | null
          nome: string | null
          operacao: string | null
          personagem_biblico: string | null
          refugio: string | null
          slug: string | null
        }
        Insert: {
          artimanha?: string | null
          demonio_associado?: string | null
          descricao?: string | null
          destino?: string | null
          dores?: string[] | null
          emocao_predominante?: string | null
          exaltacao?: string | null
          formacao?: string | null
          id?: string
          influencia?: string | null
          licao_espiritual?: string | null
          nome?: string | null
          operacao?: string | null
          personagem_biblico?: string | null
          refugio?: string | null
          slug?: string | null
        }
        Update: {
          artimanha?: string | null
          demonio_associado?: string | null
          descricao?: string | null
          destino?: string | null
          dores?: string[] | null
          emocao_predominante?: string | null
          exaltacao?: string | null
          formacao?: string | null
          id?: string
          influencia?: string | null
          licao_espiritual?: string | null
          nome?: string | null
          operacao?: string | null
          personagem_biblico?: string | null
          refugio?: string | null
          slug?: string | null
        }
        Relationships: []
      }
      perguntas: {
        Row: {
          id: string
          texto: string
        }
        Insert: {
          id?: string
          texto: string
        }
        Update: {
          id?: string
          texto?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          cidade: string | null
          congregacao: string | null
          created_at: string | null
          data_nascimento: string | null
          email: string
          estado: string | null
          id: string
          name: string
          sexo: string | null
          sobrenome: string
          whatsapp: string
        }
        Insert: {
          cidade?: string | null
          congregacao?: string | null
          created_at?: string | null
          data_nascimento?: string | null
          email: string
          estado?: string | null
          id: string
          name: string
          sexo?: string | null
          sobrenome: string
          whatsapp: string
        }
        Update: {
          cidade?: string | null
          congregacao?: string | null
          created_at?: string | null
          data_nascimento?: string | null
          email?: string
          estado?: string | null
          id?: string
          name?: string
          sexo?: string | null
          sobrenome?: string
          whatsapp?: string
        }
        Relationships: []
      }
      respostas: {
        Row: {
          id: string
          perfis: string[] | null
          pergunta_id: string | null
          resposta: string | null
          user_id: string
        }
        Insert: {
          id?: string
          perfis?: string[] | null
          pergunta_id?: string | null
          resposta?: string | null
          user_id: string
        }
        Update: {
          id?: string
          perfis?: string[] | null
          pergunta_id?: string | null
          resposta?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "respostas_pergunta_id_fkey"
            columns: ["pergunta_id"]
            isOneToOne: false
            referencedRelation: "perguntas"
            referencedColumns: ["id"]
          },
        ]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
