import { useState, useEffect } from 'react';
import { formatCurrency, cn } from '@/lib/utils';
import { Pencil, Check, X } from 'lucide-react';

interface BalanceCardProps {
  initialBalance: number;
  trades: { result: number }[];
  currency: 'JPY' | 'BRL';
  exchangeRate: number;
  setInitialBalance: (amount: number) => void;
}

export function BalanceCard({
  initialBalance,
  trades,
  currency,
  exchangeRate,
  setInitialBalance,
}: BalanceCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(initialBalance.toString());

  const totalPnL = trades.reduce((acc, trade) => acc + trade.result, 0);
  const currentBalanceJPY = initialBalance + totalPnL;

  const displayBalance = currency === 'JPY' ? currentBalanceJPY : currentBalanceJPY * exchangeRate;
  const secondaryBalance = currency === 'JPY' ? currentBalanceJPY * exchangeRate : currentBalanceJPY;
  const secondaryCurrency = currency === 'JPY' ? 'BRL' : 'JPY';

  useEffect(() => {
    setEditValue(initialBalance.toString());
  }, [initialBalance]);

  const handleSave = () => {
    const val = parseFloat(editValue);
    if (!isNaN(val)) {
      setInitialBalance(val);
    }
    setIsEditing(false);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#13141b] p-6 shadow-lg border border-white/5">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Saldo da Conta</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-gray-500 hover:text-white transition-colors"
        >
          {isEditing ? <X size={16} /> : <Pencil size={16} />}
        </button>
      </div>

      <div className="flex flex-col gap-1">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <span className="text-2xl text-gray-400">¥</span>
            <input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="bg-black/30 border border-white/10 rounded px-2 py-1 text-2xl font-bold text-white w-full focus:outline-none focus:border-[#c8f05a]"
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
          <div className="text-4xl font-bold text-white tracking-tight">
            {formatCurrency(displayBalance, currency)}
          </div>
        )}
        
        <div className="text-sm text-gray-500 font-mono mt-1">
          ≈ {formatCurrency(secondaryBalance, secondaryCurrency)}
        </div>
      </div>
    </div>
  );
}
