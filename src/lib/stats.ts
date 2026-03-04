import { Trade } from '@/hooks/useTradeStore';
import { startOfDay, isSameDay, isSameMonth, parseISO } from 'date-fns';

export interface DailyStats {
  date: string;
  pnl: number;
  trades: number;
}

export function getDailyStats(trades: Trade[]): DailyStats[] {
  const dailyMap = new Map<string, DailyStats>();

  trades.forEach(trade => {
    // Assuming trade.date is YYYY-MM-DD string from input type="date"
    // We can use it directly as the key
    const dateKey = trade.date;
    
    if (!dailyMap.has(dateKey)) {
      dailyMap.set(dateKey, { date: dateKey, pnl: 0, trades: 0 });
    }
    
    const stats = dailyMap.get(dateKey)!;
    stats.pnl += trade.result;
    stats.trades += trade.trades;
  });

  return Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));
}

export function calculateStats(trades: Trade[]) {
  const dailyStats = getDailyStats(trades);
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD

  const todayStats = dailyStats.find(d => d.date === todayStr);
  const todayPnL = todayStats ? todayStats.pnl : 0;

  const currentMonthStats = dailyStats.filter(d => isSameMonth(parseISO(d.date), today));
  const monthPnL = currentMonthStats.reduce((acc, d) => acc + d.pnl, 0);

  const totalDays = dailyStats.length;
  const winningDays = dailyStats.filter(d => d.pnl > 0).length;
  const winRate = totalDays > 0 ? (winningDays / totalDays) * 100 : 0;

  const bestDay = dailyStats.length > 0 ? Math.max(...dailyStats.map(d => d.pnl)) : 0;
  const worstDay = dailyStats.length > 0 ? Math.min(...dailyStats.map(d => d.pnl)) : 0;

  return {
    todayPnL,
    monthPnL,
    winRate,
    bestDay,
    worstDay,
    dailyStats
  };
}
