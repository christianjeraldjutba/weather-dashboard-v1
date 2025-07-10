import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchResult } from '@/types/weather';
import { useWeatherAPI } from '@/hooks/useWeatherAPI';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onLocationSelect: (location: SearchResult) => void;
  onCurrentLocation: () => void;
  recentSearches: SearchResult[];
  className?: string;
}

export const SearchBar = ({ 
  onLocationSelect, 
  onCurrentLocation, 
  recentSearches,
  className 
}: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const { searchCities } = useWeatherAPI();

  const debouncedSearch = useCallback(async (searchQuery: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        try {
          const results = await searchCities(searchQuery);
          setSuggestions(results);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
  }, [searchCities]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const handleLocationSelect = (location: SearchResult) => {
    setQuery(`${location.name}, ${location.country}`);
    setShowSuggestions(false);
    setSuggestions([]);
    onLocationSelect(location);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={cn('relative w-full max-w-md', className)}>
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4 transition-colors group-focus-within:text-blue-500" />
        <Input
          type="text"
          placeholder="Search for a city..."
          value={query}
          onChange={handleInputChange}
          className="pl-12 pr-20 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {query && (
            <Button
              size="sm"
              variant="ghost"
              onClick={clearSearch}
              className="h-7 w-7 p-0 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="h-3 w-3 text-gray-500 dark:text-gray-400" />
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={onCurrentLocation}
            className="h-7 w-7 p-0 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Use current location"
          >
            <MapPin className="h-3 w-3 text-gray-500 dark:text-gray-400" />
          </Button>
        </div>
      </div>

      {/* Search Suggestions */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl z-50 max-h-60 overflow-y-auto">
          {isSearching ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Searching...</span>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="py-2">
              {suggestions.map((location, index) => (
                <button
                  key={`${location.lat}-${location.lon}-${index}`}
                  onClick={() => handleLocationSelect(location)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-all duration-150 group"
                >
                  <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{location.name}, {location.country}</span>
                </button>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
              No cities found
            </div>
          ) : null}

          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 py-2">
              <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide">
                Recent Searches
              </div>
              {recentSearches.map((location, index) => (
                <button
                  key={`recent-${location.lat}-${location.lon}-${index}`}
                  onClick={() => handleLocationSelect(location)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-all duration-150 group"
                >
                  <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{location.name}, {location.country}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};