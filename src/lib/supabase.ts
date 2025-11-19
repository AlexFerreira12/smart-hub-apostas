import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para os dados de jogos vindos da API
export interface GameData {
  game_id: string
  home_team: string
  away_team: string
  home_score?: number | null
  away_score?: number | null
  competition: string
  date: string
  venue: string
  status: 'scheduled' | 'live' | 'finished'
  sport_type: 'football' | 'nba'
  // Dados adicionais específicos do esporte
  additional_data?: {
    home_team_logo?: string
    away_team_logo?: string
    league_logo?: string
    season?: string
    round?: string
    referee?: string
    weather?: string
    // Para NBA
    quarter?: number
    home_team_stats?: Record<string, any>
    away_team_stats?: Record<string, any>
  }
}

export interface BettingTip {
  id: string
  match_id: string
  sport_type: 'football' | 'nba'
  tip_type: string
  confidence_score: number
  analysis: {
    reasoning: string
    key_stats: string[]
    risk_level: 'low' | 'medium' | 'high'
    match_details: {
      home_team: string
      away_team: string
      competition: string
      date: string
      venue: string
    }
  }
  odds?: number | null
  game_data?: GameData | null // Dados completos da API
  created_at: string
  updated_at: string
}

// Tipo para a estrutura da tabela no Supabase
export interface Database {
  public: {
    Tables: {
      tips: {
        Row: BettingTip
        Insert: Omit<BettingTip, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<BettingTip, 'id' | 'created_at'>> & {
          updated_at?: string
        }
      }
    }
  }
}
