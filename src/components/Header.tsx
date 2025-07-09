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

export const Header = ({ 
  onLocationSelect, 
  onCurrentLocation, 
  recentSearches,
  unit,
  onUnitChange,
  isDarkMode,
  onThemeToggle
}: HeaderProps) => {
  return (
    <header className="glass-card border-white/30 p-4 mb-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Cloud className="h-8 w-8 text-primary animate-weather-pulse" />
            <h1 className="text-2xl font-bold bg-weather-gradient bg-clip-text text-transparent">
              WeatherDash
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SearchBar
            onLocationSelect={onLocationSelect}
            onCurrentLocation={onCurrentLocation}
            recentSearches={recentSearches}
            className="w-full sm:w-auto"
          />

          <div className="flex items-center gap-2">
            {/* Temperature Unit Toggle */}
            <div className="flex items-center glass border border-white/30 rounded-lg p-1">
              <Button
                size="sm"
                variant={unit === 'celsius' ? 'default' : 'ghost'}
                onClick={() => onUnitChange('celsius')}
                className="h-8 px-3 text-xs"
              >
                °C
              </Button>
              <Button
                size="sm"
                variant={unit === 'fahrenheit' ? 'default' : 'ghost'}
                onClick={() => onUnitChange('fahrenheit')}
                className="h-8 px-3 text-xs"
              >
                °F
              </Button>
            </div>

            {/* Theme Toggle */}
            <Button
              size="sm"
              variant="ghost"
              onClick={onThemeToggle}
              className="glass border border-white/30 h-10 w-10 p-0"
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};