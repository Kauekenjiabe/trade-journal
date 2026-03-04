import { useState } from 'react';
import { Trash2, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';
import { Trade } from '@/hooks/useTradeStore';

interface TradeHistoryProps {
  trades: Trade[];
  currency: 'JPY' | 'BRL';
  exchangeRate: number;
  deleteTrade: (id: number) => void;
}

type FilterType = 'all' | 'gains' | 'losses';

export function TradeHistory({ trades, currency, exchangeRate, deleteTrade }: TradeHistoryProps) {
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredTrades = trades.filter(trade => {
    if (filter === 'gains') return trade.result > 0;
    if (filter === 'losses') return trade.result < 0;
    return true;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date desc

  const getSecondaryValue = (val: number) => {
    return currency === 'JPY' ? val * exchangeRate : val / exchangeRate;
  };

  const secondaryCurrency = currency === 'JPY' ? 'BRL' : 'JPY';

  return (
    <div className="bg-[#13141b] rounded-xl border border-white/5 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Histórico de Trades</h3>
        
        <div className="flex bg-black/30 rounded-lg p-1 border border-white/5">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-md transition-colors",
              filter === 'all' ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"
            )}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('gains')}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-md transition-colors",
              filter === 'gains' ? "bg-[#c8f05a]/20 text-[#c8f05a]" : "text-gray-500 hover:text-gray-300"
            )}
          >
            Ganhos
          </button>
          <button
            onClick={() => setFilter('losses')}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-md transition-colors",
              filter === 'losses' ? "bg-[#ff5c5c]/20 text-[#ff5c5c]" : "text-gray-500 hover:text-gray-300"
            )}
          >
            Perdas
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-black/20 text-gray-500 uppercase text-xs font-medium">
            <tr>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Resultado</th>
              <th className="px-4 py-3 text-center">Trades</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 w-1/3">Notas</th>
              <th className="px-4 py-3 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredTrades.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500 italic">
                  Nenhum trade encontrado.
                </td>
              </tr>
            ) : (
              filteredTrades.map((trade) => {
                const displayResult = currency === 'JPY' ? trade.result : trade.result * exchangeRate;
                const secondaryResult = currency === 'JPY' ? trade.result * exchangeRate : trade.result;
                const isWin = trade.result > 0;

                return (
                  <tr key={trade.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-4 py-3 text-gray-300 font-mono">
                      {trade.date}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className={cn("font-bold", isWin ? "text-[#c8f05a]" : "text-[#ff5c5c]")}>
                          {formatCurrency(displayResult, currency)}
                        </span>
                        <span className="text-xs text-gray-600 font-mono">
                          ≈ {formatCurrency(secondaryResult, secondaryCurrency)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-400">
                      {trade.trades}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide",
                        isWin ? "bg-[#c8f05a]/10 text-[#c8f05a] border border-[#c8f05a]/20" : "bg-[#ff5c5c]/10 text-[#ff5c5c] border border-[#ff5c5c]/20"
                      )}>
                        {isWin ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {isWin ? 'WIN' : 'LOSS'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs truncate max-w-[200px]" title={trade.notes}>
                      {trade.notes || '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => deleteTrade(trade.id)}
                        className="text-gray-600 hover:text-[#ff5c5c] transition-colors p-1 rounded hover:bg-[#ff5c5c]/10 opacity-0 group-hover:opacity-100"
                        title="Delete Entry"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
