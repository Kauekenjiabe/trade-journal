import { useState } from 'react';
import { useTradeStore } from '@/hooks/useTradeStore';
import { DashboardPage } from '@/pages/DashboardPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { RefreshCw, Wallet, LayoutDashboard, History } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Dashboard() {
  const {
    trades,
    currency,
    exchangeRate,
    deleteTrade,
    toggleCurrency,
    refreshRate,
    isLoaded
  } = useTradeStore();

  const [currentPage, setCurrentPage] = useState<'dashboard' | 'history'>('dashboard');

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#08090f] flex items-center justify-center text-white">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/10" />
          <div className="h-4 w-32 bg-white/10 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090f] text-gray-300 font-sans selection:bg-[#c8f05a] selection:text-black">
      {/* Background Dot Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
        style={{ 
          backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', 
          backgroundSize: '24px 24px' 
        }} 
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#c8f05a] to-[#a0d040] p-2 rounded-lg shadow-lg shadow-[#c8f05a]/20">
              <Wallet className="text-black" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Diário de Trade</h1>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Dashboard Profissional</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Navigation */}
            <div className="flex bg-[#13141b] p-1 rounded-lg border border-white/5">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                  currentPage === 'dashboard' ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"
                )}
              >
                <LayoutDashboard size={14} />
                Dashboard
              </button>
              <button
                onClick={() => setCurrentPage('history')}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                  currentPage === 'history' ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"
                )}
              >
                <History size={14} />
                Histórico
              </button>
            </div>

            <div className="flex items-center gap-4 bg-[#13141b] p-1.5 rounded-lg border border-white/5 shadow-sm">
              <div className="flex items-center gap-2 px-3 border-r border-white/5 pr-4">
                <span className="text-xs text-gray-500 font-mono">
                  1 JPY = {exchangeRate.toFixed(4)} BRL
                </span>
                <button 
                  onClick={() => refreshRate()} 
                  className="text-gray-600 hover:text-white transition-colors"
                  title="Atualizar Taxa"
                >
                  <RefreshCw size={12} />
                </button>
              </div>
              
              <div className="flex gap-1">
                <button
                  onClick={() => currency === 'BRL' && toggleCurrency()}
                  className={cn(
                    "px-3 py-1.5 text-xs font-bold rounded transition-all",
                    currency === 'JPY' 
                      ? "bg-[#c8f05a] text-black shadow-lg shadow-[#c8f05a]/20" 
                      : "text-gray-500 hover:text-white hover:bg-white/5"
                  )}
                >
                  ¥ JPY
                </button>
                <button
                  onClick={() => currency === 'JPY' && toggleCurrency()}
                  className={cn(
                    "px-3 py-1.5 text-xs font-bold rounded transition-all",
                    currency === 'BRL' 
                      ? "bg-[#c8f05a] text-black shadow-lg shadow-[#c8f05a]/20" 
                      : "text-gray-500 hover:text-white hover:bg-white/5"
                  )}
                >
                  R$ BRL
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        {currentPage === 'dashboard' ? (
          <DashboardPage />
        ) : (
          <HistoryPage 
            trades={trades}
            currency={currency}
            exchangeRate={exchangeRate}
            deleteTrade={deleteTrade}
          />
        )}
      </div>
    </div>
  );
}
