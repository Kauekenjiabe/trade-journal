import { useState, useEffect } from 'react';
import { formatCurrency, cn } from '@/lib/utils';
import { Target, Pencil, Check, X } from 'lucide-react';

interface GoalCardProps {
  monthlyGoal: number; // In JPY
  monthPnL: number; // In JPY
  currency: 'JPY' | 'BRL';
  exchangeRate: number;
  setMonthlyGoal: (amount: number) => void;
}

export function GoalCard({
  monthlyGoal,
  monthPnL,
  currency,
  exchangeRate,
  setMonthlyGoal,
}: GoalCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(monthlyGoal.toString());

  const displayGoal = currency === 'JPY' ? monthlyGoal : monthlyGoal * exchangeRate;
  const displayPnL = currency === 'JPY' ? monthPnL : monthPnL * exchangeRate;

  const progress = monthlyGoal > 0 ? Math.min(Math.max((monthPnL / monthlyGoal) * 100, 0), 100) : 0;

  useEffect(() => {
    setEditValue(monthlyGoal.toString());
  }, [monthlyGoal]);

  const handleSave = () => {
    const val = parseFloat(editValue);
    if (!isNaN(val)) {
      setMonthlyGoal(val);
    }
    setIsEditing(false);
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-[#13141b] p-6 shadow-lg border border-white/5">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <Target size={16} className="text-[#c8f05a]" />
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Meta Mensal</h2>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-gray-500 hover:text-white transition-colors"
        >
          {isEditing ? <X size={16} /> : <Pencil size={16} />}
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <span className="text-xl text-gray-400">¥</span>
            <input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="bg-black/30 border border-white/10 rounded px-2 py-1 text-xl font-bold text-white w-full focus:outline-none focus:border-[#c8f05a]"
              autoFocus
            />
            <button
              onClick={handleSave}
              className="bg-[#c8f05a] text-black p-1 rounded hover:bg-[#b0d648]"
            >
              <Check size={20} />
            </button>
          </div>
        ) : (
          <div className="flex justify-between items-end mb-1">
            <span className="text-2xl font-bold text-white">
              {formatCurrency(displayPnL, currency)}
            </span>
            <span className="text-sm text-gray-500 mb-1">
              / {formatCurrency(displayGoal, currency)}
            </span>
          </div>
        )}

        <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-[#c8f05a] h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{progress.toFixed(1)}% Concluído</span>
          <span>{monthlyGoal > 0 ? (monthPnL >= monthlyGoal ? 'Meta Atingida!' : `${formatCurrency(displayGoal - displayPnL, currency)} restante`) : 'Definir meta'}</span>
        </div>
      </div>
    </div>
  );
}
