'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface WatchlistContextType {
  watchlist: string[];
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  isInWatchlist: (symbol: string) => boolean;
  toggleWatchlist: (symbol: string) => void;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<string[]>(['BTC', 'ETH', 'SOL', 'JTO']);

  useEffect(() => {
    const stored = localStorage.getItem('crypto_terminal_watchlist');
    if (stored) {
      try {
        setWatchlist(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse watchlist', e);
      }
    }
  }, []);

  const saveWatchlist = (items: string[]) => {
    setWatchlist(items);
    if (typeof window !== 'undefined') {
      localStorage.setItem('crypto_terminal_watchlist', JSON.stringify(items));
    }
  };

  const addToWatchlist = (symbol: string) => {
    const sym = symbol.toUpperCase();
    if (!watchlist.includes(sym)) {
      saveWatchlist([...watchlist, sym]);
    }
  };

  const removeFromWatchlist = (symbol: string) => {
    saveWatchlist(watchlist.filter((s) => s !== symbol.toUpperCase()));
  };

  const isInWatchlist = (symbol: string) => {
    return watchlist.includes(symbol.toUpperCase());
  };

  const toggleWatchlist = (symbol: string) => {
    const sym = symbol.toUpperCase();
    if (watchlist.includes(sym)) {
      removeFromWatchlist(sym);
    } else {
      addToWatchlist(sym);
    }
  };

  return (
    <WatchlistContext.Provider
      value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist, toggleWatchlist }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
}
