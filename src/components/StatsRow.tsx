import { Trade } from '@/hooks/useTradeStore';
import { calculateStats } from '@/lib/stats';
import { formatCurrency, cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Calendar, Percent, Award, AlertTriangle } from 'lucide-react';

interface StatsRowProps {
  trades: Trade[];
  currency: 'JPY' | 'BRL';
  exchangeRate: number;
}

export function StatsRow({ trades, currency, exchangeRate }: StatsRowProps) {
  const { todayPnL, monthPnL, winRate, bestDay, worstDay } = calculateStats(trades);

  const convert = (val: number) => currency === 'JPY' ? val : val * exchangeRate;

  const cards = [
    {
      label: "Resultado Hoje",
      value: convert(todayPnL),
      icon: Calendar,
      format: true,
      color: todayPnL > 0 ? 'text-[#c8f05a]' : todayPnL < 0 ? 'text-[#ff5c5c]' : 'text-gray-400',
    },
    {
      label: "P&L Mensal",
      value: convert(monthPnL),
      icon: todayPnL > 0 ? TrendingUp : TrendingDown, // Just an icon, logic could be better
      format: true,
      color: monthPnL > 0 ? 'text-[#c8f05a]' : monthPnL < 0 ? 'text-[#ff5c5c]' : 'text-gray-400',
    },
    {
      label: "Taxa de Acerto",
      value: winRate,
      icon: Percent,
      format: false,
      suffix: '%',
      color: winRate >= 50 ? 'text-[#c8f05a]' : 'text-[#ff5c5c]',
    },
    {
      label: "Melhor Dia",
      value: convert(bestDay),
      icon: Award,
      format: true,
      color: 'text-[#c8f05a]',
    },
    {
      label: "Pior Dia",
      value: convert(worstDay),
      icon: AlertTriangle,
      format: true,
      color: 'text-[#ff5c5c]',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {cards.map((card, i) => (
        <div key={i} className="relative overflow-hidden rounded-xl bg-[#13141b] p-4 border border-white/5 shadow-sm">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">{card.label}</span>
            <card.icon size={14} className="text-gray-600" />
          </div>
          <div className={cn("text-lg font-bold tracking-tight", card.color)}>
            {card.format ? formatCurrency(card.value, currency) : `${card.value.toFixed(1)}${card.suffix || ''}`}
          </div>
        </div>
      ))}
    </div>
  );
}
