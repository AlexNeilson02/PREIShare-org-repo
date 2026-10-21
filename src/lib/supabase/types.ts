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
      property_listings: {
        Row: {
          id: string
          owner_id: string
          title: string
          description: string | null
          address_line1: string | null
          address_line2: string | null
          address_city: string | null
          address_region: string | null
          address_postal_code: string | null
          address_country: string | null
          price: number | null
          status:
            | 'draft'
            | 'published'
            | 'under_offer'
            | 'sold'
            | 'archived'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          title: string
          description?: string | null
          address_line1?: string | null
          address_line2?: string | null
          address_city?: string | null
          address_region?: string | null
          address_postal_code?: string | null
          address_country?: string | null
          price?: number | null
          status:
            | 'draft'
            | 'published'
            | 'under_offer'
            | 'sold'
            | 'archived'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          title?: string
          description?: string | null
          address_line1?: string | null
          address_line2?: string | null
          address_city?: string | null
          address_region?: string | null
          address_postal_code?: string | null
          address_country?: string | null
          price?: number | null
          status?:
            | 'draft'
            | 'published'
            | 'under_offer'
            | 'sold'
            | 'archived'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
  }
}
