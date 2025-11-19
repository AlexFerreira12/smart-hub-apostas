import { GameData } from './supabase'

/**
 * Serviço para integração com APIs de esportes
 * Suporta múltiplas APIs: API-Football, API-Basketball, etc.
 */

// Configurações das APIs
const API_FOOTBALL_KEY = process.env.NEXT_PUBLIC_API_FOOTBALL_KEY
const API_BASKETBALL_KEY = process.env.NEXT_PUBLIC_API_BASKETBALL_KEY

/**
 * Busca jogos de futebol da API
 */
export async function fetchFootballGames(date?: string): Promise<GameData[]> {
  if (!API_FOOTBALL_KEY) {
    console.warn('API_FOOTBALL_KEY não configurada')
    return []
  }

  try {
    const targetDate = date || new Date().toISOString().split('T')[0]
    const response = await fetch(
      `https://v3.football.api-sports.io/fixtures?date=${targetDate}`,
      {
        headers: {
          'x-rapidapi-key': API_FOOTBALL_KEY,
          'x-rapidapi-host': 'v3.football.api-sports.io'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`API Football error: ${response.status}`)
    }

    const data = await response.json()
    
    return data.response.map((fixture: any) => ({
      game_id: fixture.fixture.id.toString(),
      home_team: fixture.teams.home.name,
      away_team: fixture.teams.away.name,
      home_score: fixture.goals.home,
      away_score: fixture.goals.away,
      competition: fixture.league.name,
      date: fixture.fixture.date,
      venue: fixture.fixture.venue.name,
      status: mapFootballStatus(fixture.fixture.status.short),
      sport_type: 'football' as const,
      additional_data: {
        home_team_logo: fixture.teams.home.logo,
        away_team_logo: fixture.teams.away.logo,
        league_logo: fixture.league.logo,
        season: fixture.league.season,
        round: fixture.league.round,
        referee: fixture.fixture.referee
      }
    }))
  } catch (error) {
    console.error('Erro ao buscar jogos de futebol:', error)
    return []
  }
}

/**
 * Busca jogos de NBA da API
 */
export async function fetchNBAGames(date?: string): Promise<GameData[]> {
  if (!API_BASKETBALL_KEY) {
    console.warn('API_BASKETBALL_KEY não configurada')
    return []
  }

  try {
    const targetDate = date || new Date().toISOString().split('T')[0]
    const response = await fetch(
      `https://v1.basketball.api-sports.io/games?date=${targetDate}&league=12&season=2023-2024`,
      {
        headers: {
          'x-rapidapi-key': API_BASKETBALL_KEY,
          'x-rapidapi-host': 'v1.basketball.api-sports.io'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`API Basketball error: ${response.status}`)
    }

    const data = await response.json()
    
    return data.response.map((game: any) => ({
      game_id: game.id.toString(),
      home_team: game.teams.home.name,
      away_team: game.teams.away.name,
      home_score: game.scores.home.total,
      away_score: game.scores.away.total,
      competition: game.league.name,
      date: game.date,
      venue: game.arena?.name || 'Arena não informada',
      status: mapNBAStatus(game.status.short),
      sport_type: 'nba' as const,
      additional_data: {
        home_team_logo: game.teams.home.logo,
        away_team_logo: game.teams.away.logo,
        league_logo: game.league.logo,
        season: game.league.season,
        quarter: game.scores.home.quarter_4 ? 4 : game.scores.home.quarter_3 ? 3 : game.scores.home.quarter_2 ? 2 : 1
      }
    }))
  } catch (error) {
    console.error('Erro ao buscar jogos de NBA:', error)
    return []
  }
}

/**
 * Busca um jogo específico por ID
 */
export async function fetchGameById(gameId: string, sportType: 'football' | 'nba'): Promise<GameData | null> {
  try {
    if (sportType === 'football') {
      if (!API_FOOTBALL_KEY) return null
      
      const response = await fetch(
        `https://v3.football.api-sports.io/fixtures?id=${gameId}`,
        {
          headers: {
            'x-rapidapi-key': API_FOOTBALL_KEY,
            'x-rapidapi-host': 'v3.football.api-sports.io'
          }
        }
      )

      if (!response.ok) return null
      const data = await response.json()
      
      if (data.response.length === 0) return null
      
      const fixture = data.response[0]
      return {
        game_id: fixture.fixture.id.toString(),
        home_team: fixture.teams.home.name,
        away_team: fixture.teams.away.name,
        home_score: fixture.goals.home,
        away_score: fixture.goals.away,
        competition: fixture.league.name,
        date: fixture.fixture.date,
        venue: fixture.fixture.venue.name,
        status: mapFootballStatus(fixture.fixture.status.short),
        sport_type: 'football',
        additional_data: {
          home_team_logo: fixture.teams.home.logo,
          away_team_logo: fixture.teams.away.logo,
          league_logo: fixture.league.logo,
          season: fixture.league.season,
          round: fixture.league.round,
          referee: fixture.fixture.referee
        }
      }
    } else {
      if (!API_BASKETBALL_KEY) return null
      
      const response = await fetch(
        `https://v1.basketball.api-sports.io/games?id=${gameId}`,
        {
          headers: {
            'x-rapidapi-key': API_BASKETBALL_KEY,
            'x-rapidapi-host': 'v1.basketball.api-sports.io'
          }
        }
      )

      if (!response.ok) return null
      const data = await response.json()
      
      if (data.response.length === 0) return null
      
      const game = data.response[0]
      return {
        game_id: game.id.toString(),
        home_team: game.teams.home.name,
        away_team: game.teams.away.name,
        home_score: game.scores.home.total,
        away_score: game.scores.away.total,
        competition: game.league.name,
        date: game.date,
        venue: game.arena?.name || 'Arena não informada',
        status: mapNBAStatus(game.status.short),
        sport_type: 'nba',
        additional_data: {
          home_team_logo: game.teams.home.logo,
          away_team_logo: game.teams.away.logo,
          league_logo: game.league.logo,
          season: game.league.season
        }
      }
    }
  } catch (error) {
    console.error('Erro ao buscar jogo por ID:', error)
    return null
  }
}

// Funções auxiliares para mapear status
function mapFootballStatus(status: string): 'scheduled' | 'live' | 'finished' {
  const liveStatuses = ['1H', '2H', 'HT', 'ET', 'P', 'LIVE']
  const finishedStatuses = ['FT', 'AET', 'PEN', 'PST', 'CANC', 'ABD', 'AWD', 'WO']
  
  if (liveStatuses.includes(status)) return 'live'
  if (finishedStatuses.includes(status)) return 'finished'
  return 'scheduled'
}

function mapNBAStatus(status: string): 'scheduled' | 'live' | 'finished' {
  const liveStatuses = ['Q1', 'Q2', 'Q3', 'Q4', 'OT', 'BT', 'HT', 'LIVE']
  const finishedStatuses = ['FT', 'AOT', 'CANC', 'POST']
  
  if (liveStatuses.includes(status)) return 'live'
  if (finishedStatuses.includes(status)) return 'finished'
  return 'scheduled'
}
