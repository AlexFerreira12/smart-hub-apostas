// API Sports Integration
const FOOTBALL_API_URL = 'https://v3.football.api-sports.io'
const BASKETBALL_API_URL = 'https://v1.basketball.api-sports.io'

export interface ApiSportsConfig {
  apiKey: string
}

// Football API
export async function fetchFootballMatches(apiKey: string, date?: string) {
  try {
    const targetDate = date || new Date().toISOString().split('T')[0]
    const response = await fetch(`${FOOTBALL_API_URL}/fixtures?date=${targetDate}`, {
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'v3.football.api-sports.io'
      }
    })
    
    if (!response.ok) throw new Error('Failed to fetch football matches')
    return await response.json()
  } catch (error) {
    console.error('Error fetching football matches:', error)
    return null
  }
}

export async function fetchFootballStatistics(apiKey: string, fixtureId: string) {
  try {
    const response = await fetch(`${FOOTBALL_API_URL}/fixtures/statistics?fixture=${fixtureId}`, {
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'v3.football.api-sports.io'
      }
    })
    
    if (!response.ok) throw new Error('Failed to fetch statistics')
    return await response.json()
  } catch (error) {
    console.error('Error fetching football statistics:', error)
    return null
  }
}

// NBA API
export async function fetchNBAMatches(apiKey: string, date?: string) {
  try {
    const targetDate = date || new Date().toISOString().split('T')[0]
    const response = await fetch(`${BASKETBALL_API_URL}/games?date=${targetDate}`, {
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'v1.basketball.api-sports.io'
      }
    })
    
    if (!response.ok) throw new Error('Failed to fetch NBA matches')
    return await response.json()
  } catch (error) {
    console.error('Error fetching NBA matches:', error)
    return null
  }
}

export async function fetchNBAStatistics(apiKey: string, gameId: string) {
  try {
    const response = await fetch(`${BASKETBALL_API_URL}/games/statistics?id=${gameId}`, {
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'v1.basketball.api-sports.io'
      }
    })
    
    if (!response.ok) throw new Error('Failed to fetch statistics')
    return await response.json()
  } catch (error) {
    console.error('Error fetching NBA statistics:', error)
    return null
  }
}

// AI Analysis for betting tips
export function analyzeMatchData(matchData: any, statistics: any, sportType: 'football' | 'nba') {
  // Simple analysis algorithm (can be enhanced with actual AI/ML)
  const analysis = {
    reasoning: '',
    key_stats: [] as string[],
    risk_level: 'medium' as 'low' | 'medium' | 'high',
    tip_type: '',
    confidence_score: 0
  }

  if (sportType === 'football') {
    // Football analysis logic
    const homeForm = statistics?.home?.form || 0
    const awayForm = statistics?.away?.form || 0
    
    if (homeForm > awayForm * 1.3) {
      analysis.tip_type = 'Home Win'
      analysis.confidence_score = 0.75
      analysis.reasoning = 'Time da casa apresenta forma superior recente'
      analysis.key_stats.push(`Forma casa: ${homeForm}`, `Forma visitante: ${awayForm}`)
      analysis.risk_level = 'low'
    } else if (awayForm > homeForm * 1.3) {
      analysis.tip_type = 'Away Win'
      analysis.confidence_score = 0.70
      analysis.reasoning = 'Time visitante com melhor desempenho recente'
      analysis.key_stats.push(`Forma visitante: ${awayForm}`, `Forma casa: ${homeForm}`)
      analysis.risk_level = 'medium'
    } else {
      analysis.tip_type = 'Over 2.5 Goals'
      analysis.confidence_score = 0.65
      analysis.reasoning = 'Times equilibrados, jogo deve ter gols'
      analysis.key_stats.push('Times com formas similares', 'Histórico de jogos com gols')
      analysis.risk_level = 'medium'
    }
  } else {
    // NBA analysis logic
    const homeAvgPoints = statistics?.home?.avg_points || 0
    const awayAvgPoints = statistics?.away?.avg_points || 0
    
    if (homeAvgPoints > awayAvgPoints + 10) {
      analysis.tip_type = 'Home Win'
      analysis.confidence_score = 0.78
      analysis.reasoning = 'Time da casa com média de pontos superior'
      analysis.key_stats.push(`Média casa: ${homeAvgPoints}pts`, `Média visitante: ${awayAvgPoints}pts`)
      analysis.risk_level = 'low'
    } else if (awayAvgPoints > homeAvgPoints + 10) {
      analysis.tip_type = 'Away Win'
      analysis.confidence_score = 0.75
      analysis.reasoning = 'Time visitante com ataque mais forte'
      analysis.key_stats.push(`Média visitante: ${awayAvgPoints}pts`, `Média casa: ${homeAvgPoints}pts`)
      analysis.risk_level = 'medium'
    } else {
      analysis.tip_type = 'Over Total Points'
      analysis.confidence_score = 0.68
      analysis.reasoning = 'Ambos times com bom ataque, espera-se jogo movimentado'
      analysis.key_stats.push('Times ofensivos', 'Média alta de pontos')
      analysis.risk_level = 'medium'
    }
  }

  return analysis
}
