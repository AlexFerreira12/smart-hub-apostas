'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Clock, MapPin } from 'lucide-react'
import { type BettingTip } from '@/lib/supabase'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface TipCardProps {
  tip: BettingTip
}

export default function TipCard({ tip }: TipCardProps) {
  const confidenceColor = 
    tip.confidence_score >= 0.8 ? 'text-emerald-400' :
    tip.confidence_score >= 0.6 ? 'text-yellow-400' :
    'text-orange-400'

  const riskColor = 
    tip.analysis.risk_level === 'low' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
    tip.analysis.risk_level === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
    'bg-red-500/20 text-red-300 border-red-500/30'

  const riskLabel = 
    tip.analysis.risk_level === 'low' ? 'Baixo Risco' :
    tip.analysis.risk_level === 'medium' ? 'Risco Médio' :
    'Alto Risco'

  // Priorizar dados da API (game_data) sobre dados da análise
  const gameData = tip.game_data
  const matchDetails = tip.analysis?.match_details

  const homeTeam = gameData?.home_team || matchDetails?.home_team || 'Time Casa'
  const awayTeam = gameData?.away_team || matchDetails?.away_team || 'Time Visitante'
  const competition = gameData?.competition || matchDetails?.competition || 'Competição'
  const venue = gameData?.venue || matchDetails?.venue || 'Estádio'
  const matchDate = gameData?.date || matchDetails?.date || new Date().toISOString()

  // Status do jogo
  const gameStatus = gameData?.status || 'scheduled'
  const homeScore = gameData?.home_score
  const awayScore = gameData?.away_score

  const statusBadge = 
    gameStatus === 'live' ? (
      <Badge className="bg-red-500/20 text-red-300 border-red-500/30 animate-pulse shrink-0">
        🔴 AO VIVO
      </Badge>
    ) : gameStatus === 'finished' ? (
      <Badge className="bg-slate-500/20 text-slate-300 border-slate-500/30 shrink-0">
        Finalizado
      </Badge>
    ) : (
      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 shrink-0">
        Agendado
      </Badge>
    )

  return (
    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10">
      <CardHeader className="pb-3">
        {/* Cabeçalho da Partida */}
        <div className="space-y-4">
          {/* Competição e Status */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-sm font-semibold text-slate-200 truncate flex-1 min-w-0">{competition}</span>
            {statusBadge}
          </div>

          {/* Times - Layout Responsivo */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl p-4 sm:p-5 border border-slate-600/50 shadow-lg">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
              {/* Time Casa */}
              <div className="flex items-center gap-3 sm:gap-4 flex-1 w-full sm:w-auto">
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <p className="font-bold text-white text-lg sm:text-xl truncate">{homeTeam}</p>
                  <p className="text-xs text-slate-400 font-medium">Casa</p>
                </div>
                {(gameStatus === 'live' || gameStatus === 'finished') && (
                  <span className="text-2xl sm:text-3xl font-bold text-white bg-slate-700/50 px-3 sm:px-4 py-2 rounded-lg min-w-[3rem] sm:min-w-[3.5rem] text-center shrink-0">
                    {homeScore || 0}
                  </span>
                )}
              </div>

              {/* VS */}
              <div className="flex items-center shrink-0">
                <div className="text-slate-400 font-bold text-xs sm:text-sm bg-slate-700/50 px-3 sm:px-4 py-1.5 rounded-full">
                  VS
                </div>
              </div>

              {/* Time Visitante */}
              <div className="flex items-center gap-3 sm:gap-4 flex-1 w-full sm:w-auto sm:flex-row-reverse">
                <div className="flex-1 min-w-0 text-center sm:text-right">
                  <p className="font-bold text-white text-lg sm:text-xl truncate">{awayTeam}</p>
                  <p className="text-xs text-slate-400 font-medium">Visitante</p>
                </div>
                {(gameStatus === 'live' || gameStatus === 'finished') && (
                  <span className="text-2xl sm:text-3xl font-bold text-white bg-slate-700/50 px-3 sm:px-4 py-2 rounded-lg min-w-[3rem] sm:min-w-[3.5rem] text-center shrink-0">
                    {awayScore || 0}
                  </span>
                )}
              </div>
            </div>

            {/* Informações da Partida */}
            <div className="mt-4 pt-4 border-t border-slate-600/50 flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-2 bg-slate-700/30 px-2 sm:px-3 py-1.5 rounded-lg flex-1 sm:flex-initial min-w-0">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium truncate">{format(parseISO(matchDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-700/30 px-2 sm:px-3 py-1.5 rounded-lg flex-1 sm:flex-initial min-w-0">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="font-medium truncate">{venue}</span>
              </div>
            </div>
          </div>

          {/* Tipo de Dica e Confiança */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="flex-1 bg-slate-800/50 rounded-lg p-3 sm:p-4 border border-slate-700/50">
              <p className="text-xs text-slate-400 mb-1.5 font-medium">Dica Recomendada</p>
              <p className="font-bold text-white text-base sm:text-lg truncate">{tip.tip_type}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 sm:p-4 border border-slate-700/50 text-center sm:min-w-[120px]">
              <p className="text-xs text-slate-400 mb-1.5 font-medium">Confiança</p>
              <p className={`font-bold text-2xl sm:text-3xl ${confidenceColor}`}>
                {Math.round(tip.confidence_score * 100)}%
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Odd */}
        {tip.odds && (
          <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-lg border border-emerald-500/30 gap-3">
            <span className="text-sm text-slate-300 font-semibold">Odd Sugerida</span>
            <span className="text-xl sm:text-2xl font-bold text-emerald-400 shrink-0">{tip.odds.toFixed(2)}</span>
          </div>
        )}

        {/* Análise */}
        <div className="space-y-3 bg-slate-800/30 rounded-lg p-3 sm:p-4 border border-slate-700/50">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-slate-200">Análise Detalhada</h4>
            <Badge className={riskColor}>
              {riskLabel}
            </Badge>
          </div>
          
          <p className="text-sm text-slate-300 leading-relaxed break-words">
            {tip.analysis.reasoning}
          </p>

          {/* Estatísticas Chave */}
          <div className="space-y-2 mt-4 pt-4 border-t border-slate-700/50">
            <h5 className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
              Estatísticas Chave
            </h5>
            <ul className="space-y-2">
              {tip.analysis.key_stats.map((stat, index) => (
                <li key={index} className="text-sm text-slate-300 flex items-start gap-2 bg-slate-700/30 p-2 rounded break-words">
                  <span className="text-emerald-400 font-bold mt-0.5 shrink-0">•</span>
                  <span className="flex-1 min-w-0">{stat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
