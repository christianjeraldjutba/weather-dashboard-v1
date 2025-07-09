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
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search for a city..."
          value={query}
          onChange={handleInputChange}
          className="pl-10 pr-20 glass-card border-white/30 text-foreground placeholder:text-muted-foreground"
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {query && (
            <Button
              size="sm"
              variant="ghost"
              onClick={clearSearch}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={onCurrentLocation}
            className="h-6 w-6 p-0"
            title="Use current location"
          >
            <MapPin className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Search Suggestions */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-card rounded-lg border border-white/30 shadow-lg z-50 max-h-60 overflow-y-auto custom-scrollbar">
          {isSearching ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="py-2">
              {suggestions.map((location, index) => (
                <button
                  key={`${location.lat}-${location.lon}-${index}`}
                  onClick={() => handleLocationSelect(location)}
                  className="w-full px-4 py-2 text-left hover:bg-white/10 flex items-center gap-2 transition-colors"
                >
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm">{location.name}, {location.country}</span>
                </button>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No cities found
            </div>
          ) : null}

          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div className="border-t border-white/20 py-2">
              <div className="px-4 py-2 text-xs text-muted-foreground font-medium">
                Recent Searches
              </div>
              {recentSearches.map((location, index) => (
                <button
                  key={`recent-${location.lat}-${location.lon}-${index}`}
                  onClick={() => handleLocationSelect(location)}
                  className="w-full px-4 py-2 text-left hover:bg-white/10 flex items-center gap-2 transition-colors"
                >
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm">{location.name}, {location.country}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};