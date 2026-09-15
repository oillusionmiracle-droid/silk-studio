'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface OrderThemeContextType {
  orderTheme: 'dark' | 'light';
  setOrderTheme: (theme: 'dark' | 'light') => void;
  toggleOrderTheme: () => void;
}

const OrderThemeContext = createContext<OrderThemeContextType>({
  orderTheme: 'dark',
  setOrderTheme: () => {},
  toggleOrderTheme: () => {},
});

export function OrderThemeProvider({ children }: { children: React.ReactNode }) {
  const [orderTheme, setOrderTheme] = useState<'dark' | 'light'>('dark');

  // Load from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem('silk_order_theme');
      if (saved === 'light' || saved === 'dark') {
        setOrderTheme(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSetTheme = (theme: 'dark' | 'light') => {
    setOrderTheme(theme);
    try {
      localStorage.setItem('silk_order_theme', theme);
    } catch {
      // ignore
    }
  };

  const toggleOrderTheme = () => {
    handleSetTheme(orderTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <OrderThemeContext.Provider
      value={{
        orderTheme,
        setOrderTheme: handleSetTheme,
        toggleOrderTheme,
      }}
    >
      {children}
    </OrderThemeContext.Provider>
  );
}

export function useOrderTheme() {
  return useContext(OrderThemeContext);
}
