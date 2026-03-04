import { useState, FormEvent } from 'react';
import { Plus, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Trade } from '@/hooks/useTradeStore';

interface TradeFormProps {
  addTrade: (trade: Omit<Trade, 'id'>) => void;
}

export function TradeForm({ addTrade }: TradeFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState('');
  const [tradesCount, setTradesCount] = useState('');
  const [notes, setNotes] = useState('');

  const resultValue = parseFloat(result);
  const isPositive = !isNaN(resultValue) && resultValue > 0;
  const isNegative = !isNaN(resultValue) && resultValue < 0;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!date || result === '' || tradesCount === '') return;

    addTrade({
      date,
      result: parseFloat(result),
      trades: parseInt(tradesCount),
      notes,
    });

    // Reset form
    setResult('');
    setTradesCount('');
    setNotes('');
  };

  return (
    <div className="bg-[#13141b] p-6 rounded-xl border border-white/5 shadow-sm">
      <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider flex items-center gap-2">
        <Plus size={16} /> Novo Registro
      </h3>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 uppercase">Data</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white/30"
              required
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 uppercase">Resultado (¥)</label>
            <input
              type="number"
              value={result}
              onChange={(e) => setResult(e.target.value)}
              placeholder="0"
              className={cn(
                "bg-black/30 border rounded-lg px-3 py-2 text-white focus:outline-none transition-colors",
                isPositive ? "border-[#c8f05a] text-[#c8f05a]" : 
                isNegative ? "border-[#ff5c5c] text-[#ff5c5c]" : 
                "border-white/10"
              )}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 uppercase">Nº Trades</label>
            <input
              type="number"
              value={tradesCount}
              onChange={(e) => setTradesCount(e.target.value)}
              placeholder="0"
              min="0"
              className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white/30"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 uppercase">Notas</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Estratégia usada, condições do mercado, emoções..."
            className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white/30 h-20 resize-none"
          />
        </div>

        <button
          type="submit"
          className="bg-[#c8f05a] text-black font-bold py-2 px-4 rounded-lg hover:bg-[#b0d648] transition-colors flex items-center justify-center gap-2 mt-2"
        >
          <Save size={18} /> Salvar Registro
        </button>
      </form>
    </div>
  );
}
