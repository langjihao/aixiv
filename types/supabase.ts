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
      arxiv: {
        Row: {
          abstract: string | null
          arxiv_id: string
          authors: Json | null
          code_url: string | null
          cover: string | null
          created_at: string
          institutions: Json | null
          paper_id: string | null
          publication_date: string | null
          tags: Json | null
          title: string | null
          topic: string | null
          translated_abstract: string | null
          url: string | null
        }
        Insert: {
          abstract?: string | null
          arxiv_id: string
          authors?: Json | null
          code_url?: string | null
          cover?: string | null
          created_at?: string
          institutions?: Json | null
          paper_id?: string | null
          publication_date?: string | null
          tags?: Json | null
          title?: string | null
          topic?: string | null
          translated_abstract?: string | null
          url?: string | null
        }
        Update: {
          abstract?: string | null
          arxiv_id?: string
          authors?: Json | null
          code_url?: string | null
          cover?: string | null
          created_at?: string
          institutions?: Json | null
          paper_id?: string | null
          publication_date?: string | null
          tags?: Json | null
          title?: string | null
          topic?: string | null
          translated_abstract?: string | null
          url?: string | null
        }
        Relationships: []
      }
      authors: {
        Row: {
          affiliations: Json | null
          author_id: string
          citation_count: number | null
          external_ids: Json | null
          h_index: number | null
          homepage: string | null
          name: string | null
          paper_count: number | null
          papers: Json | null
          url: string | null
        }
        Insert: {
          affiliations?: Json | null
          author_id: string
          citation_count?: number | null
          external_ids?: Json | null
          h_index?: number | null
          homepage?: string | null
          name?: string | null
          paper_count?: number | null
          papers?: Json | null
          url?: string | null
        }
        Update: {
          affiliations?: Json | null
          author_id?: string
          citation_count?: number | null
          external_ids?: Json | null
          h_index?: number | null
          homepage?: string | null
          name?: string | null
          paper_count?: number | null
          papers?: Json | null
          url?: string | null
        }
        Relationships: []
      }
      papers: {
        Row: {
          abstract: string | null
          arxiv_id: string | null
          authors: Json | null
          citation_count: number | null
          citation_styles: Json | null
          citations: Json | null
          code_url: string | null
          corpus_id: number | null
          cover: string | null
          doi: string | null
          external_ids: Json | null
          fields_of_study: string[] | null
          influential_citation_count: number | null
          institutions: Json | null
          is_open_access: boolean | null
          journal: Json | null
          open_access_pdf: Json | null
          paper_id: string
          publication_date: string | null
          publication_types: string[] | null
          publication_venue: Json | null
          reference_count: number | null
          references_list: Json | null
          s2_fields_of_study: Json | null
          semantic_id: string | null
          tags: Json | null
          title: string | null
          tldr: Json | null
          translated_abstract: string | null
          translated_title: string | null
          translated_tldr: string | null
          url: string | null
          venue: string | null
          year: number | null
        }
        Insert: {
          abstract?: string | null
          arxiv_id?: string | null
          authors?: Json | null
          citation_count?: number | null
          citation_styles?: Json | null
          citations?: Json | null
          code_url?: string | null
          corpus_id?: number | null
          cover?: string | null
          doi?: string | null
          external_ids?: Json | null
          fields_of_study?: string[] | null
          influential_citation_count?: number | null
          institutions?: Json | null
          is_open_access?: boolean | null
          journal?: Json | null
          open_access_pdf?: Json | null
          paper_id?: string
          publication_date?: string | null
          publication_types?: string[] | null
          publication_venue?: Json | null
          reference_count?: number | null
          references_list?: Json | null
          s2_fields_of_study?: Json | null
          semantic_id?: string | null
          tags?: Json | null
          title?: string | null
          tldr?: Json | null
          translated_abstract?: string | null
          translated_title?: string | null
          translated_tldr?: string | null
          url?: string | null
          venue?: string | null
          year?: number | null
        }
        Update: {
          abstract?: string | null
          arxiv_id?: string | null
          authors?: Json | null
          citation_count?: number | null
          citation_styles?: Json | null
          citations?: Json | null
          code_url?: string | null
          corpus_id?: number | null
          cover?: string | null
          doi?: string | null
          external_ids?: Json | null
          fields_of_study?: string[] | null
          influential_citation_count?: number | null
          institutions?: Json | null
          is_open_access?: boolean | null
          journal?: Json | null
          open_access_pdf?: Json | null
          paper_id?: string
          publication_date?: string | null
          publication_types?: string[] | null
          publication_venue?: Json | null
          reference_count?: number | null
          references_list?: Json | null
          s2_fields_of_study?: Json | null
          semantic_id?: string | null
          tags?: Json | null
          title?: string | null
          tldr?: Json | null
          translated_abstract?: string | null
          translated_title?: string | null
          translated_tldr?: string | null
          url?: string | null
          venue?: string | null
          year?: number | null
        }
        Relationships: []
      }
      user_papers: {
        Row: {
          arxiv_id: string | null
          comment: string | null
          created_at: string | null
          paper_id: string
          record_id: string
          score: number
          status: number | null
          tags: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          arxiv_id?: string | null
          comment?: string | null
          created_at?: string | null
          paper_id: string
          record_id?: string
          score: number
          status?: number | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          arxiv_id?: string | null
          comment?: string | null
          created_at?: string | null
          paper_id?: string
          record_id?: string
          score?: number
          status?: number | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_papers_paper_id_fkey"
            columns: ["paper_id"]
            isOneToOne: true
            referencedRelation: "papers"
            referencedColumns: ["paper_id"]
          },
        ]
      }
      users: {
        Row: {
          avatar: string | null
          created_at: string | null
          email: string
          name: string
          research: string | null
          team: string | null
          updated_at: string | null
          userid: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          email: string
          name: string
          research?: string | null
          team?: string | null
          updated_at?: string | null
          userid: string
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          email?: string
          name?: string
          research?: string | null
          team?: string | null
          updated_at?: string | null
          userid?: string
        }
        Relationships: []
      }
      venues: {
        Row: {
          ccf_ranking: string | null
          created_at: string | null
          e_issn: string | null
          id: string
          impact_factor: number | null
          issn: string | null
          name: string
          publisher: string | null
          sci_quartiles: Json | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          ccf_ranking?: string | null
          created_at?: string | null
          e_issn?: string | null
          id?: string
          impact_factor?: number | null
          issn?: string | null
          name: string
          publisher?: string | null
          sci_quartiles?: Json | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          ccf_ranking?: string | null
          created_at?: string | null
          e_issn?: string | null
          id?: string
          impact_factor?: number | null
          issn?: string | null
          name?: string
          publisher?: string | null
          sci_quartiles?: Json | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      requesting_user_id: {
        Args: Record<PropertyKey, never>
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
