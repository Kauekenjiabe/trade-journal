import { useState } from 'react';
import { Trash2, ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';
import { Trade } from '@/hooks/useTradeStore';

interface HistoryPageProps {
  trades: Trade[];
  currency: 'JPY' | 'BRL';
  exchangeRate: number;
  deleteTrade: (id: number) => void;
}

export function HistoryPage({ trades, currency, exchangeRate, deleteTrade }: HistoryPageProps) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Get unique years from trades
  const years = Array.from(new Set(trades.map(t => new Date(t.date).getFullYear())))
    .sort((a, b) => b - a);
  if (!years.includes(currentYear)) years.unshift(currentYear);

  const months = [
    { value: 0, label: 'Janeiro' },
    { value: 1, label: 'Fevereiro' },
    { value: 2, label: 'Março' },
    { value: 3, label: 'Abril' },
    { value: 4, label: 'Maio' },
    { value: 5, label: 'Junho' },
    { value: 6, label: 'Julho' },
    { value: 7, label: 'Agosto' },
    { value: 8, label: 'Setembro' },
    { value: 9, label: 'Outubro' },
    { value: 10, label: 'Novembro' },
    { value: 11, label: 'Dezembro' },
  ];

  const filteredTrades = trades.filter(trade => {
    const tradeDate = new Date(trade.date);
    const yearMatch = tradeDate.getFullYear() === selectedYear;
    const monthMatch = selectedMonth === 'all' || tradeDate.getMonth() === selectedMonth;
    const dateMatch = selectedDate === '' || trade.date === selectedDate;

    return yearMatch && monthMatch && dateMatch;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const secondaryCurrency = currency === 'JPY' ? 'BRL' : 'JPY';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#13141b] p-4 rounded-xl border border-white/5">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Filter size={20} className="text-[#c8f05a]" />
          Filtros
        </h2>
        
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <label className="text-xs text-gray-500 uppercase">Ano</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#c8f05a] min-w-[100px]"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <label className="text-xs text-gray-500 uppercase">Mês</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
              className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#c8f05a] min-w-[140px]"
            >
              <option value="all">Todos</option>
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <label className="text-xs text-gray-500 uppercase">Data Específica</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#c8f05a]"
            />
          </div>
          
          {selectedDate && (
             <div className="flex flex-col justify-end">
               <button 
                 onClick={() => setSelectedDate('')}
                 className="text-xs text-[#ff5c5c] hover:text-white underline mb-3"
               >
                 Limpar Data
               </button>
             </div>
          )}
        </div>
      </div>

      <div className="bg-[#13141b] rounded-xl border border-white/5 shadow-sm overflow-hidden">
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
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500 italic">
                    Nenhum trade encontrado para os filtros selecionados.
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
                          title="Excluir Registro"
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
    </div>
  );
}
