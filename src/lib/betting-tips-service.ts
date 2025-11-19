import { supabase, type BettingTip, type GameData } from './supabase'
import { fetchGameById, fetchFootballGames, fetchNBAGames } from './sports-api'

/**
 * Serviço para gerenciar dicas de apostas com integração completa de dados da API
 */

/**
 * Cria uma nova dica de aposta com dados completos do jogo
 */
export async function createBettingTip(
  matchId: string,
  sportType: 'football' | 'nba',
  tipType: string,
  confidenceScore: number,
  analysis: BettingTip['analysis'],
  odds?: number
): Promise<BettingTip | null> {
  try {
    // Buscar dados completos do jogo da API
    const gameData = await fetchGameById(matchId, sportType)
    
    if (!gameData) {
      console.warn(`Não foi possível buscar dados do jogo ${matchId}`)
    }

    // Criar objeto da dica com todos os dados
    const tipData = {
      match_id: matchId,
      sport_type: sportType,
      tip_type: tipType,
      confidence_score: confidenceScore,
      analysis: analysis,
      odds: odds || null,
      game_data: gameData || null, // Armazena dados completos do jogo
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Inserir no banco de dados (tabela: tips)
    const { data, error } = await supabase
      .from('tips')
      .insert(tipData)
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar dica no Supabase:', error)
      return null
    }

    return data as BettingTip
  } catch (error) {
    console.error('Erro ao criar dica de aposta:', error)
    return null
  }
}

/**
 * Atualiza dados do jogo em uma dica existente
 */
export async function updateGameDataInTip(tipId: string): Promise<boolean> {
  try {
    // Buscar a dica existente
    const { data: tip, error: fetchError } = await supabase
      .from('tips')
      .select('*')
      .eq('id', tipId)
      .single()

    if (fetchError || !tip) {
      console.error('Erro ao buscar dica:', fetchError)
      return false
    }

    // Buscar dados atualizados do jogo
    const gameData = await fetchGameById(tip.match_id, tip.sport_type)
    
    if (!gameData) {
      console.warn(`Não foi possível atualizar dados do jogo ${tip.match_id}`)
      return false
    }

    // Atualizar no banco
    const { error: updateError } = await supabase
      .from('tips')
      .update({
        game_data: gameData,
        updated_at: new Date().toISOString()
      })
      .eq('id', tipId)

    if (updateError) {
      console.error('Erro ao atualizar dica:', updateError)
      return false
    }

    return true
  } catch (error) {
    console.error('Erro ao atualizar dados do jogo:', error)
    return false
  }
}

/**
 * Busca dicas com dados completos dos jogos
 */
export async function getBettingTipsWithGameData(
  sportType: 'football' | 'nba',
  limit: number = 10
): Promise<BettingTip[]> {
  try {
    const { data, error } = await supabase
      .from('tips')
      .select('*')
      .eq('sport_type', sportType)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Erro ao buscar dicas do Supabase:', error)
      return []
    }

    // Retornar array vazio se não houver dados
    if (!data || data.length === 0) {
      console.log(`Nenhuma dica encontrada para ${sportType}`)
      return []
    }

    return data as BettingTip[]
  } catch (error) {
    console.error('Erro ao buscar dicas com dados do jogo:', error)
    return []
  }
}

/**
 * Busca todas as dicas (sem filtro de esporte)
 */
export async function getAllBettingTips(limit: number = 20): Promise<BettingTip[]> {
  try {
    const { data, error } = await supabase
      .from('tips')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Erro ao buscar todas as dicas:', error)
      return []
    }

    return data as BettingTip[]
  } catch (error) {
    console.error('Erro ao buscar todas as dicas:', error)
    return []
  }
}

/**
 * Sincroniza jogos do dia com a API e retorna lista de jogos disponíveis
 */
export async function syncTodayGames(sportType: 'football' | 'nba'): Promise<GameData[]> {
  try {
    const games = sportType === 'football' 
      ? await fetchFootballGames()
      : await fetchNBAGames()

    console.log(`${games.length} jogos de ${sportType} encontrados para hoje`)
    return games
  } catch (error) {
    console.error('Erro ao sincronizar jogos:', error)
    return []
  }
}

/**
 * Atualiza dados de todos os jogos em dicas ativas
 */
export async function refreshAllGameData(sportType: 'football' | 'nba'): Promise<number> {
  try {
    // Buscar todas as dicas do esporte
    const { data: tips, error } = await supabase
      .from('tips')
      .select('id, match_id')
      .eq('sport_type', sportType)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error || !tips) {
      console.error('Erro ao buscar dicas para atualização:', error)
      return 0
    }

    let updatedCount = 0

    // Atualizar cada dica
    for (const tip of tips) {
      const success = await updateGameDataInTip(tip.id)
      if (success) updatedCount++
    }

    console.log(`${updatedCount} dicas atualizadas com sucesso`)
    return updatedCount
  } catch (error) {
    console.error('Erro ao atualizar dados dos jogos:', error)
    return 0
  }
}

/**
 * Deleta uma dica específica
 */
export async function deleteBettingTip(tipId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('tips')
      .delete()
      .eq('id', tipId)

    if (error) {
      console.error('Erro ao deletar dica:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Erro ao deletar dica:', error)
    return false
  }
}

/**
 * Cria dica de exemplo com dados reais da API (útil para testes)
 */
export async function createSampleTip(
  gameId: string,
  sportType: 'football' | 'nba'
): Promise<BettingTip | null> {
  try {
    // Buscar dados do jogo
    const gameData = await fetchGameById(gameId, sportType)
    
    if (!gameData) {
      console.error('Jogo não encontrado')
      return null
    }

    // Criar análise de exemplo
    const analysis = {
      reasoning: sportType === 'football'
        ? `${gameData.home_team} apresenta boa forma em casa, com vantagem estatística sobre ${gameData.away_team}`
        : `${gameData.home_team} tem vantagem de mando de quadra contra ${gameData.away_team}`,
      key_stats: [
        'Histórico favorável',
        'Boa forma recente',
        'Vantagem de mando'
      ],
      risk_level: 'medium' as const,
      match_details: {
        home_team: gameData.home_team,
        away_team: gameData.away_team,
        competition: gameData.competition,
        date: gameData.date,
        venue: gameData.venue
      }
    }

    return await createBettingTip(
      gameId,
      sportType,
      sportType === 'football' ? 'Vitória do Mandante' : 'Vitória do Time da Casa',
      0.75,
      analysis,
      1.85
    )
  } catch (error) {
    console.error('Erro ao criar dica de exemplo:', error)
    return null
  }
}
