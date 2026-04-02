'use client';

import type { ReactNode } from 'react';
import { useLayout } from '../../context/layout/useLayout';
import Sidebar from './Slider';
import Header from './Header';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { isCollapsed } = useLayout();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Header */}
      <Header />

      {/* Main Content - Dynamically adjusts based on sidebar state */}
      <main className={`fixed top-20 bottom-0 right-0 transition-all duration-300 overflow-auto me-4 mb-2 border rounded-md border-zinc-800
        ${isCollapsed ? 'left-24' : 'left-44'}`}>
        <div className="h-full p-6">
          {children}
        </div>
      </main>
    </div>
  );
}