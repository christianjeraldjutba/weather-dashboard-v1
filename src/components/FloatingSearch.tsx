import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchResult } from '@/types/weather';
import { SearchBar } from './SearchBar';
import { cn } from '@/lib/utils';

interface FloatingSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: SearchResult) => void;
  onCurrentLocation: () => void;
  recentSearches: SearchResult[];
}

export const FloatingSearch = React.memo<FloatingSearchProps>(({
  isOpen,
  onClose,
  onLocationSelect,
  onCurrentLocation,
  recentSearches
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen && 
        overlayRef.current && 
        searchRef.current &&
        !searchRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className={cn(
        "fixed inset-0 z-[9999] flex items-start justify-center",
        "bg-black/50 backdrop-blur-sm",
        "animate-in fade-in duration-200",
        "pt-20 px-4"
      )}
    >
      <div
        ref={searchRef}
        className={cn(
          "w-full max-w-2xl",
          "bg-white dark:bg-slate-900",
          "rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700",
          "animate-in slide-in-from-top-4 duration-300",
          "overflow-hidden"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Search Location
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Find weather for any city worldwide
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search Content */}
        <div className="p-6">
          <SearchBar
            onLocationSelect={(location) => {
              onLocationSelect(location);
              onClose();
            }}
            onCurrentLocation={() => {
              onCurrentLocation();
              onClose();
            }}
            recentSearches={recentSearches}
            className="mb-6"
          />

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Recent Searches
                </h3>
              </div>
              <div className="space-y-2">
                {recentSearches.slice(0, 5).map((search, index) => (
                  <button
                    key={`${search.lat}-${search.lon}-${index}`}
                    onClick={() => {
                      onLocationSelect(search);
                      onClose();
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg",
                      "hover:bg-slate-100 dark:hover:bg-slate-800",
                      "transition-colors duration-200",
                      "text-left group"
                    )}
                  >
                    <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-md group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                      <MapPin className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {search.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {search.country}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <Button
              onClick={() => {
                onCurrentLocation();
                onClose();
              }}
              variant="outline"
              className="w-full justify-start gap-3 h-12"
            >
              <MapPin className="h-4 w-4" />
              Use Current Location
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

FloatingSearch.displayName = 'FloatingSearch';
