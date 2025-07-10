import React from 'react';
import { Cloud, Sun, Moon, Thermometer } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  return (
    <header
      className="sticky top-0 z-[9999] backdrop-blur-xl bg-white/85 dark:bg-slate-900/85 border-b border-slate-200/20 dark:border-slate-700/30 shadow-xl shadow-black/5"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-22 py-2">
          <div className="flex items-center gap-3">
            <div className="relative" aria-hidden="true">
              <Cloud className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600 drop-shadow-sm" />
              <div className="absolute inset-0 h-8 w-8 sm:h-10 sm:w-10 text-blue-600/20 blur-sm" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 tracking-tight">
              WeatherDash
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <SearchBar
              onLocationSelect={onLocationSelect}
              onCurrentLocation={onCurrentLocation}
              recentSearches={recentSearches}
              className="w-full sm:w-auto"
            />

            <div className="flex items-center gap-2">
              {/* Temperature Unit Toggle */}
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

              {/* Theme Toggle */}
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
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';