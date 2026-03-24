'use client';

import { useState, type ReactNode } from 'react';
import { LayoutContext } from './LayoutContext';

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <LayoutContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      {children}
    </LayoutContext.Provider>
  );
}