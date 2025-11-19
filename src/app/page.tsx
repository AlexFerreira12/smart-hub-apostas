'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trophy, TrendingUp, Calendar, RefreshCw, AlertCircle } from 'lucide-react'
import { type BettingTip } from '@/lib/supabase'
import { getBettingTipsWithGameData, refreshAllGameData } from '@/lib/betting-tips-service'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import TipCard from '@/components/custom/tip-card'

export default function SmartHubTips() {
  const [activeTab, setActiveTab] = useState<'football' | 'nba'>('football')
  const [tips, setTips] = useState<BettingTip[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setLastUpdate(new Date())
  }, [])

  useEffect(() => {
    loadTips()
  }, [activeTab])

  async function loadTips() {
    setLoading(true)
    try {
      const data = await getBettingTipsWithGameData(activeTab, 10)
      setTips(data)
    } catch (error) {
      console.error('Erro ao carregar dicas:', error)
    } finally {
      setLoading(false)
    }
  }

  async function refreshData() {
    setLastUpdate(new Date())
    setLoading(true)
    try {
      // Atualizar dados dos jogos nas dicas existentes
      await refreshAllGameData(activeTab)
      // Recarregar dicas
      await loadTips()
    } catch (error) {
      console.error('Erro ao atualizar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  // Mock data for demonstration (when no API key is configured)
  const mockTips: BettingTip[] = [
    {
      id: '1',
      match_id: 'mock-1',
      sport_type: activeTab,
      tip_type: activeTab === 'football' ? 'Vitória do Mandante' : 'Mais de 220.5 pontos',
      confidence_score: 0.85,
      analysis: {
        reasoning: activeTab === 'football' 
          ? 'Time da casa apresenta excelente forma nos últimos 5 jogos, com 4 vitórias consecutivas'
          : 'Ambas equipes com média acima de 115 pontos nos últimos jogos',
        key_stats: activeTab === 'football'
          ? ['80% de aproveitamento em casa', '15 gols marcados nos últimos 5 jogos', 'Defesa sólida']
          : ['Média de 118 pontos por jogo', 'Ataque eficiente (52% FG)', 'Ritmo acelerado'],
        risk_level: 'low',
        match_details: activeTab === 'football'
          ? {
              home_team: 'Flamengo',
              away_team: 'Corinthians',
              competition: 'Brasileirão Série A',
              date: '2024-01-20T19:00:00',
              venue: 'Maracanã'
            }
          : {
              home_team: 'Los Angeles Lakers',
              away_team: 'Golden State Warriors',
              competition: 'NBA Regular Season',
              date: '2024-01-20T22:00:00',
              venue: 'Crypto.com Arena'
            }
      },
      odds: 1.75,
      game_data: activeTab === 'football' ? {
        game_id: 'mock-1',
        home_team: 'Flamengo',
        away_team: 'Corinthians',
        competition: 'Brasileirão Série A',
        date: '2024-01-20T19:00:00',
        venue: 'Maracanã',
        status: 'scheduled',
        sport_type: 'football',
        additional_data: {
          home_team_logo: 'https://media.api-sports.io/football/teams/127.png',
          away_team_logo: 'https://media.api-sports.io/football/teams/131.png',
          league_logo: 'https://media.api-sports.io/football/leagues/71.png'
        }
      } : {
        game_id: 'mock-1',
        home_team: 'Los Angeles Lakers',
        away_team: 'Golden State Warriors',
        competition: 'NBA Regular Season',
        date: '2024-01-20T22:00:00',
        venue: 'Crypto.com Arena',
        status: 'scheduled',
        sport_type: 'nba',
        additional_data: {
          home_team_logo: 'https://media.api-sports.io/basketball/teams/145.png',
          away_team_logo: 'https://media.api-sports.io/basketball/teams/144.png',
          league_logo: 'https://media.api-sports.io/basketball/leagues/12.png'
        }
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      match_id: 'mock-2',
      sport_type: activeTab,
      tip_type: activeTab === 'football' ? 'Mais de 2.5 Gols' : 'Vitória do Mandante',
      confidence_score: 0.72,
      analysis: {
        reasoning: activeTab === 'football'
          ? 'Histórico de confrontos diretos com média de 3.5 gols por partida'
          : 'Time mandante invicto em casa há 8 jogos',
        key_stats: activeTab === 'football'
          ? ['Média de 2.8 gols por jogo', 'Ambos times marcaram em 70% dos jogos', 'Defesas vulneráveis']
          : ['85% de vitórias em casa', 'Defesa forte (98 pontos sofridos)', 'Vantagem de mando'],
        risk_level: 'medium',
        match_details: activeTab === 'football'
          ? {
              home_team: 'Palmeiras',
              away_team: 'São Paulo',
              competition: 'Brasileirão Série A',
              date: '2024-01-20T20:00:00',
              venue: 'Allianz Parque'
            }
          : {
              home_team: 'Boston Celtics',
              away_team: 'Miami Heat',
              competition: 'NBA Regular Season',
              date: '2024-01-20T19:30:00',
              venue: 'TD Garden'
            }
      },
      odds: 2.10,
      game_data: activeTab === 'football' ? {
        game_id: 'mock-2',
        home_team: 'Palmeiras',
        away_team: 'São Paulo',
        competition: 'Brasileirão Série A',
        date: '2024-01-20T20:00:00',
        venue: 'Allianz Parque',
        status: 'scheduled',
        sport_type: 'football',
        additional_data: {
          home_team_logo: 'https://media.api-sports.io/football/teams/126.png',
          away_team_logo: 'https://media.api-sports.io/football/teams/130.png',
          league_logo: 'https://media.api-sports.io/football/leagues/71.png'
        }
      } : {
        game_id: 'mock-2',
        home_team: 'Boston Celtics',
        away_team: 'Miami Heat',
        competition: 'NBA Regular Season',
        date: '2024-01-20T19:30:00',
        venue: 'TD Garden',
        status: 'scheduled',
        sport_type: 'nba',
        additional_data: {
          home_team_logo: 'https://media.api-sports.io/basketball/teams/138.png',
          away_team_logo: 'https://media.api-sports.io/basketball/teams/149.png',
          league_logo: 'https://media.api-sports.io/basketball/leagues/12.png'
        }
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      match_id: 'mock-3',
      sport_type: activeTab,
      tip_type: activeTab === 'football' ? 'Ambos Marcam' : 'Menos de 215.5 pontos',
      confidence_score: 0.68,
      analysis: {
        reasoning: activeTab === 'football'
          ? 'Ambas equipes com ataques produtivos e defesas instáveis'
          : 'Ambas equipes com defesas sólidas e ritmo controlado',
        key_stats: activeTab === 'football'
          ? ['Casa: 12 gols em 5 jogos', 'Visitante: 10 gols em 5 jogos', 'Últimos 4 jogos com gols dos dois']
          : ['Média de 102 pontos sofridos', 'Ritmo lento (95 posses)', 'Defesas top 5 da liga'],
        risk_level: 'medium',
        match_details: activeTab === 'football'
          ? {
              home_team: 'Atlético-MG',
              away_team: 'Internacional',
              competition: 'Brasileirão Série A',
              date: '2024-01-20T18:00:00',
              venue: 'Arena MRV'
            }
          : {
              home_team: 'Milwaukee Bucks',
              away_team: 'Indiana Pacers',
              competition: 'NBA Regular Season',
              date: '2024-01-20T20:00:00',
              venue: 'Fiserv Forum'
            }
      },
      odds: 1.90,
      game_data: activeTab === 'football' ? {
        game_id: 'mock-3',
        home_team: 'Atlético-MG',
        away_team: 'Internacional',
        competition: 'Brasileirão Série A',
        date: '2024-01-20T18:00:00',
        venue: 'Arena MRV',
        status: 'scheduled',
        sport_type: 'football',
        additional_data: {
          home_team_logo: 'https://media.api-sports.io/football/teams/128.png',
          away_team_logo: 'https://media.api-sports.io/football/teams/129.png',
          league_logo: 'https://media.api-sports.io/football/leagues/71.png'
        }
      } : {
        game_id: 'mock-3',
        home_team: 'Milwaukee Bucks',
        away_team: 'Indiana Pacers',
        competition: 'NBA Regular Season',
        date: '2024-01-20T20:00:00',
        venue: 'Fiserv Forum',
        status: 'scheduled',
        sport_type: 'nba',
        additional_data: {
          home_team_logo: 'https://media.api-sports.io/basketball/teams/142.png',
          away_team_logo: 'https://media.api-sports.io/basketball/teams/141.png',
          league_logo: 'https://media.api-sports.io/basketball/leagues/12.png'
        }
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  const displayTips = tips.length > 0 ? tips : mockTips

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Smart Hub Tips</h1>
                <p className="text-sm text-slate-400">Análise inteligente de apostas esportivas</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {mounted && lastUpdate && (
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-slate-400">Última atualização</p>
                  <p className="text-sm text-slate-300 font-medium">
                    {format(lastUpdate, "HH:mm", { locale: ptBR })}
                  </p>
                </div>
              )}
              <Button 
                onClick={refreshData}
                variant="outline"
                size="sm"
                className="bg-slate-800 border-slate-700 hover:bg-slate-700"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Alert Banner */}
        <Card className="mb-6 bg-amber-500/10 border-amber-500/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-amber-200 font-medium">
                  Configure suas chaves de API para dados em tempo real
                </p>
                <p className="text-xs text-amber-300/80 mt-1">
                  Conecte sua conta Supabase e adicione as chaves das APIs de esportes nas variáveis de ambiente para análises automáticas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sport Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'football' | 'nba')} className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-slate-800/50 border border-slate-700 h-14">
            <TabsTrigger 
              value="football"
              className="text-lg font-bold text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white"
            >
              ⚽ Futebol
            </TabsTrigger>
            <TabsTrigger 
              value="nba"
              className="text-lg font-bold text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:text-white"
            >
              🏀 NBA
            </TabsTrigger>
          </TabsList>

          {/* Football Content */}
          <TabsContent value="football" className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="pb-3">
                  <CardDescription className="text-slate-400">Taxa de Acerto</CardDescription>
                  <CardTitle className="text-3xl text-emerald-400">78%</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>+5% esta semana</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="pb-3">
                  <CardDescription className="text-slate-400">Dicas Hoje</CardDescription>
                  <CardTitle className="text-3xl text-blue-400">{displayTips.length}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span>{displayTips.length} jogos analisados</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="pb-3">
                  <CardDescription className="text-slate-400">ROI Médio</CardDescription>
                  <CardTitle className="text-3xl text-purple-400">+15%</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    <span>Últimos 30 dias</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tips Grid */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Dicas de Hoje</h2>
              {loading ? (
                <div className="text-center py-12">
                  <RefreshCw className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-3" />
                  <p className="text-slate-400">Carregando dicas...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {displayTips.map((tip) => (
                    <TipCard key={tip.id} tip={tip} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* NBA Content */}
          <TabsContent value="nba" className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="pb-3">
                  <CardDescription className="text-slate-400">Taxa de Acerto</CardDescription>
                  <CardTitle className="text-3xl text-orange-400">82%</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <TrendingUp className="w-4 h-4 text-orange-400" />
                    <span>+8% esta semana</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="pb-3">
                  <CardDescription className="text-slate-400">Dicas Hoje</CardDescription>
                  <CardTitle className="text-3xl text-blue-400">{displayTips.length}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span>{displayTips.length} jogos analisados</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="pb-3">
                  <CardDescription className="text-slate-400">ROI Médio</CardDescription>
                  <CardTitle className="text-3xl text-purple-400">+18%</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    <span>Últimos 30 dias</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tips Grid */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Dicas de Hoje</h2>
              {loading ? (
                <div className="text-center py-12">
                  <RefreshCw className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-3" />
                  <p className="text-slate-400">Carregando dicas...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {displayTips.map((tip) => (
                    <TipCard key={tip.id} tip={tip} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/50 mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-slate-400">
            Smart Hub Tips - Análise inteligente de apostas esportivas
          </p>
          <p className="text-center text-xs text-slate-500 mt-2">
            As dicas são baseadas em análise estatística. Aposte com responsabilidade.
          </p>
        </div>
      </footer>
    </div>
  )
}
