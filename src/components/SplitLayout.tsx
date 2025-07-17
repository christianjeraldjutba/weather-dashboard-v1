import React from 'react';
import { cn } from '@/lib/utils';

interface SplitLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  className?: string;
}

/**
 * Split-screen layout component for modern dashboard interface
 * Mobile: Stacked vertically with proper height constraints
 * Desktop: Left panel (40%) and right panel (60%) side by side
 */
export const SplitLayout = React.memo<SplitLayoutProps>(({
  leftPanel,
  rightPanel,
  className
}) => {
  return (
    <div className={cn(
      // Mobile-first: Stack vertically, desktop: side by side
      "w-full min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)]",
      "flex flex-col lg:grid lg:grid-cols-5 lg:gap-0",
      "transition-all duration-300 ease-in-out",
      className
    )}>
      {/* Left Panel - Current Weather */}
      <div className={cn(
        // Mobile: Fixed height with proper constraints
        "lg:col-span-2 relative",
        "bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-purple-50/40",
        "dark:from-slate-900/95 dark:via-slate-800/90 dark:to-slate-900/95",
        "lg:border-r border-slate-200/50 dark:border-slate-700/50",
        "flex flex-col",
        // Mobile: Take up appropriate space, desktop: full height to match content
        "min-h-[45vh] lg:h-full",
        "transition-all duration-500"
      )}>
        {/* Background Pattern - Fixed to cover entire panel */}
        <div className="absolute inset-0 opacity-30 dark:opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(59,130,246,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.08),transparent_50%)]" />
        </div>

        {/* Content Container - Perfectly centered content */}
        <div className="relative z-10 w-full h-full flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-sm">
            {leftPanel}
          </div>
        </div>
      </div>

      {/* Right Panel - Details & Forecast */}
      <div className={cn(
        "lg:col-span-3 relative",
        "bg-white/95 dark:bg-slate-900/95",
        "backdrop-blur-sm",
        "flex flex-col",
        // Mobile: Take remaining space, desktop: natural height
        "flex-1",
        "overflow-y-auto custom-scrollbar"
      )}>
        {/* Background Texture */}
        <div className="absolute inset-0 opacity-20 dark:opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,0.02)_50%,transparent_75%)]" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 p-4 sm:p-6 lg:p-8">
          {rightPanel}
        </div>
      </div>
    </div>
  );
});

SplitLayout.displayName = 'SplitLayout';
