'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface MatchCardProps {
  homeTeam: string
  awayTeam: string
  league: string
  matchDate: string
  homeScore?: number
  awayScore?: number
  status: string
}

export default function MatchCard({
  homeTeam,
  awayTeam,
  league,
  matchDate,
  homeScore,
  awayScore,
  status
}: MatchCardProps) {
  const getStatusBadge = () => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">Agendado</Badge>
      case 'live':
        return <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20 animate-pulse">Ao Vivo</Badge>
      case 'finished':
        return <Badge variant="outline" className="bg-slate-500/10 text-slate-400 border-slate-500/20">Finalizado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all">
      <CardContent className="p-4">
        {/* League and Status */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {league}
          </p>
          {getStatusBadge()}
        </div>

        {/* Teams */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-white font-semibold">{homeTeam}</span>
            {homeScore !== undefined && (
              <span className="text-2xl font-bold text-white">{homeScore}</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white font-semibold">{awayTeam}</span>
            {awayScore !== undefined && (
              <span className="text-2xl font-bold text-white">{awayScore}</span>
            )}
          </div>
        </div>

        {/* Date and Time */}
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{format(new Date(matchDate), 'dd/MM/yyyy', { locale: ptBR })}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{format(new Date(matchDate), 'HH:mm', { locale: ptBR })}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
