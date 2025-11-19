'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface StatsChartProps {
  sportType: 'football' | 'nba'
}

export default function StatsChart({ sportType }: StatsChartProps) {
  // Mock data for demonstration
  const data = [
    { day: 'Seg', accuracy: sportType === 'football' ? 75 : 80 },
    { day: 'Ter', accuracy: sportType === 'football' ? 78 : 82 },
    { day: 'Qua', accuracy: sportType === 'football' ? 72 : 79 },
    { day: 'Qui', accuracy: sportType === 'football' ? 80 : 85 },
    { day: 'Sex', accuracy: sportType === 'football' ? 76 : 81 },
    { day: 'Sáb', accuracy: sportType === 'football' ? 82 : 84 },
    { day: 'Dom', accuracy: sportType === 'football' ? 78 : 82 },
  ]

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey="day" 
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#f1f5f9'
            }}
            formatter={(value: number) => [`${value}%`, 'Taxa de Acerto']}
          />
          <Line
            type="monotone"
            dataKey="accuracy"
            stroke={sportType === 'football' ? '#10b981' : '#f97316'}
            strokeWidth={3}
            dot={{ fill: sportType === 'football' ? '#10b981' : '#f97316', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
