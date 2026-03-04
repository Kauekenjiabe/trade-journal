import { useState, useEffect, useCallback } from 'react';

export interface Trade {
  id: number;
  date: string;
  result: number; // Always in JPY
  trades: number;
  notes: string;
}

export interface TradeStore {
  trades: Trade[];
  initialBalance: number; // Always in JPY
  monthlyGoal: number; // Always in JPY
  currency: 'JPY' | 'BRL';
  exchangeRate: number; // JPY to BRL
  lastRateFetch: number;
  addTrade: (trade: Omit<Trade, 'id'>) => void;
  deleteTrade: (id: number) => void;
  setInitialBalance: (amount: number) => void;
  setMonthlyGoal: (amount: number) => void;
  setCurrency: (currency: 'JPY' | 'BRL') => void;
  setExchangeRate: (rate: number) => void;
  setLastRateFetch: (timestamp: number) => void;
  toggleCurrency: () => void;
  refreshRate: () => Promise<void>;
  isLoaded: boolean;
}

const STORAGE_KEY = 'trade_journal_data';
const RATE_CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export function useTradeStore(): TradeStore {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [initialBalance, setInitialBalance] = useState<number>(0);
  const [monthlyGoal, setMonthlyGoal] = useState<number>(0);
  const [currency, setCurrency] = useState<'JPY' | 'BRL'>('JPY');
  const [exchangeRate, setExchangeRate] = useState<number>(0.033); // Default fallback
  const [lastRateFetch, setLastRateFetch] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setTrades(data.trades || []);
        setInitialBalance(data.initialBalance || 0);
        setMonthlyGoal(data.monthlyGoal || 0);
        setCurrency(data.currency || 'JPY');
        setExchangeRate(data.exchangeRate || 0.033);
        setLastRateFetch(data.lastRateFetch || 0);
      } catch (e) {
        console.error("Failed to parse local storage", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever state changes, but only after loading
  useEffect(() => {
    if (!isLoaded) return;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      trades,
      initialBalance,
      monthlyGoal,
      currency,
      exchangeRate,
      lastRateFetch
    }));
  }, [trades, initialBalance, monthlyGoal, currency, exchangeRate, lastRateFetch, isLoaded]);

  const refreshRate = useCallback(async () => {
    const now = Date.now();
    // If we have a recent rate (less than 1 hour old), don't fetch
    if (now - lastRateFetch < RATE_CACHE_DURATION && exchangeRate > 0) {
      return; 
    }

    try {
      const res = await fetch('https://api.frankfurter.app/latest?from=JPY&to=BRL');
      if (!res.ok) throw new Error('Failed to fetch rate');
      const data = await res.json();
      if (data && data.rates && data.rates.BRL) {
        setExchangeRate(data.rates.BRL);
        setLastRateFetch(now);
      }
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error);
    }
  }, [exchangeRate, lastRateFetch]);

  // Initial fetch on mount (after load)
  useEffect(() => {
    if (isLoaded) {
      refreshRate();
    }
  }, [isLoaded, refreshRate]);

  const addTrade = (trade: Omit<Trade, 'id'>) => {
    const newTrade = { ...trade, id: Date.now() };
    setTrades(prev => [...prev, newTrade]);
  };

  const deleteTrade = (id: number) => {
    setTrades(prev => prev.filter(t => t.id !== id));
  };

  const toggleCurrency = () => {
    setCurrency(prev => (prev === 'JPY' ? 'BRL' : 'JPY'));
  };

  return {
    trades,
    initialBalance,
    monthlyGoal,
    currency,
    exchangeRate,
    lastRateFetch,
    addTrade,
    deleteTrade,
    setInitialBalance,
    setMonthlyGoal,
    setCurrency,
    setExchangeRate,
    setLastRateFetch,
    toggleCurrency,
    refreshRate,
    isLoaded
  };
}
