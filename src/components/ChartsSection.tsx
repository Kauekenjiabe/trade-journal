import { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { getDailyStats } from '@/lib/stats';
import { Trade } from '@/hooks/useTradeStore';

interface ChartsSectionProps {
  trades: Trade[];
  currency: 'JPY' | 'BRL';
  exchangeRate: number;
}

export function ChartsSection({ trades, currency, exchangeRate }: ChartsSectionProps) {
  const data = useMemo(() => {
    const dailyStats = getDailyStats(trades);
    
    // Sort by date ascending
    const sortedStats = [...dailyStats].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let accumulated = 0;
    return sortedStats.map(stat => {
      const result = currency === 'JPY' ? stat.pnl : stat.pnl * exchangeRate;
      accumulated += result;
      return {
        date: stat.date,
        result,
        accumulated,
      };
    });
  }, [trades, currency, exchangeRate]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const val = payload[0].value;
      const formatted = currency === 'JPY' 
        ? `¥${val.toLocaleString('ja-JP')}` 
        : `R$${val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      
      return (
        <div className="bg-[#13141b] border border-white/10 p-2 rounded shadow-lg text-xs">
          <p className="text-gray-400 mb-1">{label}</p>
          <p className={val >= 0 ? "text-[#c8f05a] font-bold" : "text-[#ff5c5c] font-bold"}>
            {formatted}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Line Chart: Accumulated P&L */}
      <div className="bg-[#13141b] p-6 rounded-xl border border-white/5 shadow-sm h-[350px]">
        <h3 className="text-xs font-medium text-gray-400 mb-4 uppercase tracking-wider">P&L Acumulado</h3>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#666" 
                tick={{ fontSize: 10, fill: '#666' }} 
                tickFormatter={(val) => val.slice(5)} // MM-DD
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis 
                stroke="#666" 
                tick={{ fontSize: 10, fill: '#666' }}
                tickFormatter={(val) => currency === 'JPY' ? `¥${val}` : `R$${val}`}
                axisLine={false}
                tickLine={false}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
              <ReferenceLine y={0} stroke="#444" />
              <Line 
                type="monotone" 
                dataKey="accumulated" 
                stroke="#c8f05a" 
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 4, fill: '#c8f05a', stroke: '#fff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart: Daily Result */}
      <div className="bg-[#13141b] p-6 rounded-xl border border-white/5 shadow-sm h-[350px]">
        <h3 className="text-xs font-medium text-gray-400 mb-4 uppercase tracking-wider">Resultado Diário</h3>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#666" 
                tick={{ fontSize: 10, fill: '#666' }} 
                tickFormatter={(val) => val.slice(5)}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis 
                stroke="#666" 
                tick={{ fontSize: 10, fill: '#666' }}
                tickFormatter={(val) => currency === 'JPY' ? `¥${val}` : `R$${val}`}
                axisLine={false}
                tickLine={false}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <ReferenceLine y={0} stroke="#444" />
              <Bar dataKey="result" radius={[2, 2, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.result >= 0 ? '#c8f05a' : '#ff5c5c'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
