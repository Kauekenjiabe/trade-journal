import { useMemo } from 'react';
import { useTradeStore } from '@/hooks/useTradeStore';
import { BalanceCard } from '@/components/BalanceCard';
import { StatsRow } from '@/components/StatsRow';
import { GoalCard } from '@/components/GoalCard';
import { ChartsSection } from '@/components/ChartsSection';
import { TradeForm } from '@/components/TradeForm';
import { isSameMonth, parseISO } from 'date-fns';

export function DashboardPage() {
  const {
    trades,
    initialBalance,
    monthlyGoal,
    currency,
    exchangeRate,
    addTrade,
    setInitialBalance,
    setMonthlyGoal,
  } = useTradeStore();

  // Calculate monthPnL for GoalCard
  const monthPnL = useMemo(() => {
    const now = new Date();
    return trades
      .filter(t => isSameMonth(parseISO(t.date), now))
      .reduce((acc, t) => acc + t.result, 0);
  }, [trades]);

  return (
    <div className="space-y-8">
      {/* Hero Section: Balance & Goal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <BalanceCard
            initialBalance={initialBalance}
            trades={trades}
            currency={currency}
            exchangeRate={exchangeRate}
            setInitialBalance={setInitialBalance}
          />
        </div>
        <div className="md:col-span-1">
          <GoalCard
            monthlyGoal={monthlyGoal}
            monthPnL={monthPnL}
            currency={currency}
            exchangeRate={exchangeRate}
            setMonthlyGoal={setMonthlyGoal}
          />
        </div>
      </div>

      {/* Stats Row */}
      <StatsRow
        trades={trades}
        currency={currency}
        exchangeRate={exchangeRate}
      />

      {/* Charts */}
      <ChartsSection
        trades={trades}
        currency={currency}
        exchangeRate={exchangeRate}
      />

      {/* Input */}
      <div>
        <TradeForm addTrade={addTrade} />
      </div>
    </div>
  );
}
