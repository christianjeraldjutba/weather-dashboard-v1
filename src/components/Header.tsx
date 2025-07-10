import React, { useState } from 'react';
import { Cloud, Sun, Moon, Thermometer, Menu, X, Search, Palette } from 'lucide-react';
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
                  className="h-10 w-10 p-0 hover:bg-transparent focus:bg-transparent transition-all duration-200"
                  aria-label="Open mobile menu"
                >
                  <Menu className="h-6 w-6 text-blue-600 hover:text-blue-700 dark:hover:text-blue-500 transition-colors duration-200" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-80 p-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-l border-gray-200/50 dark:border-gray-700/50 shadow-2xl"
              >
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-gray-800/50 dark:to-gray-900/50">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <Menu className="h-4 w-4 text-white" />
                      </div>
                      <h2 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                        Menu
                      </h2>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 space-y-8 overflow-y-auto">
                    {/* Search Location */}
                    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300 delay-100">
                      <div className="flex items-center space-x-2">
                        <div className="h-5 w-5 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Search className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          Search Location
                        </h3>
                      </div>
                      <div className="pl-7">
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
                    </div>

                    {/* Temperature Unit */}
                    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300 delay-200">
                      <div className="flex items-center space-x-2">
                        <div className="h-5 w-5 rounded-md bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                          <Thermometer className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          Temperature Unit
                        </h3>
                      </div>
                      <div className="pl-7">
                        <TemperatureToggle />
                      </div>
                    </div>

                    {/* Theme */}
                    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300 delay-300">
                      <div className="flex items-center space-x-2">
                        <div className="h-5 w-5 rounded-md bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <Palette className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          Theme
                        </h3>
                      </div>
                      <div className="pl-7">
                        <div className="flex items-center gap-2">
                          <ThemeToggle />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-blue-50/50 dark:from-gray-800/50 dark:to-gray-900/50">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        WeatherDash v1.0
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        Premium Weather Experience
                      </p>
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