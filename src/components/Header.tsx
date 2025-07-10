import React, { useState } from 'react';
import { Cloud, Sun, Moon, Thermometer, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { TemperatureUnit } from '@/types/weather';
import { SearchBar } from './SearchBar';
import { SearchResult } from '@/types/weather';

interface HeaderProps {
  onLocationSelect: (location: SearchResult) => void;
  onCurrentLocation: () => void;
  recentSearches: SearchResult[];
  unit: TemperatureUnit;
  onUnitChange: (unit: TemperatureUnit) => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

export const Header = React.memo<HeaderProps>(({
  onLocationSelect,
  onCurrentLocation,
  recentSearches,
  unit,
  onUnitChange,
  isDarkMode,
  onThemeToggle
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Temperature Unit Toggle Component (reusable)
  const TemperatureToggle = () => (
    <div
      className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700"
      role="group"
      aria-label="Temperature unit selection"
    >
      <Button
        size="sm"
        variant={unit === 'celsius' ? 'default' : 'ghost'}
        onClick={() => onUnitChange('celsius')}
        className={`h-8 px-3 text-xs font-medium transition-all duration-200 ${
          unit === 'celsius'
            ? 'text-white bg-blue-600 hover:bg-blue-700'
            : 'text-blue-600 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
        aria-label="Switch to Celsius"
        aria-pressed={unit === 'celsius'}
      >
        °C
      </Button>
      <Button
        size="sm"
        variant={unit === 'fahrenheit' ? 'default' : 'ghost'}
        onClick={() => onUnitChange('fahrenheit')}
        className={`h-8 px-3 text-xs font-medium transition-all duration-200 ${
          unit === 'fahrenheit'
            ? 'text-white bg-blue-600 hover:bg-blue-700'
            : 'text-blue-600 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
        aria-label="Switch to Fahrenheit"
        aria-pressed={unit === 'fahrenheit'}
      >
        °F
      </Button>
    </div>
  );

  // Theme Toggle Component (reusable)
  const ThemeToggle = () => (
    <Button
      size="sm"
      variant="ghost"
      onClick={onThemeToggle}
      className="h-10 w-10 p-0 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <Sun className="h-4 w-4 text-blue-600" aria-hidden="true" />
      ) : (
        <Moon className="h-4 w-4 text-blue-600" aria-hidden="true" />
      )}
    </Button>
  );

  return (
    <header
      className="sticky top-0 z-[9999] backdrop-blur-xl bg-white/85 dark:bg-slate-900/85 border-b border-slate-200/20 dark:border-slate-700/30 shadow-xl shadow-black/5"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-22 py-2">
          {/* Logo - Always visible */}
          <div className="flex items-center gap-3">
            <div className="relative" aria-hidden="true">
              <Cloud className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600 drop-shadow-sm" />
              <div className="absolute inset-0 h-8 w-8 sm:h-10 sm:w-10 text-blue-600/20 blur-sm" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 tracking-tight">
              WeatherDash
            </h1>
          </div>

          {/* Desktop Navigation - Hidden on mobile (640px and below) */}
          <div className="hidden min-[641px]:flex items-center gap-3 sm:gap-4">
            <SearchBar
              onLocationSelect={onLocationSelect}
              onCurrentLocation={onCurrentLocation}
              recentSearches={recentSearches}
              className="w-full sm:w-auto"
            />

            <div className="flex items-center gap-2">
              <TemperatureToggle />
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Hamburger Menu - Visible only on mobile (640px and below) */}
          <div className="min-[641px]:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-10 w-10 p-0 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                  aria-label="Open mobile menu"
                >
                  <Menu className="h-5 w-5 text-blue-600" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-l border-slate-200/20 dark:border-slate-700/30"
              >
                <div className="flex flex-col gap-6 pt-6">
                  {/* Mobile Menu Header */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-blue-600">Menu</h2>
                  </div>

                  {/* Search Bar in Mobile Menu */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Search Location
                    </label>
                    <SearchBar
                      onLocationSelect={(location) => {
                        onLocationSelect(location);
                        setIsMobileMenuOpen(false);
                      }}
                      onCurrentLocation={() => {
                        onCurrentLocation();
                        setIsMobileMenuOpen(false);
                      }}
                      recentSearches={recentSearches}
                      className="w-full"
                    />
                  </div>

                  {/* Temperature Unit Toggle in Mobile Menu */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Temperature Unit
                    </label>
                    <TemperatureToggle />
                  </div>

                  {/* Theme Toggle in Mobile Menu */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Theme
                    </label>
                    <div className="flex items-center gap-2">
                      <ThemeToggle />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                      </span>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';