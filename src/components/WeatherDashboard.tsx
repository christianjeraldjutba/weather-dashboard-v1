import { useState, useEffect } from 'react';
import { WeatherData, TemperatureUnit, SearchResult } from '@/types/weather';
import { useWeatherAPI } from '@/hooks/useWeatherAPI';
import { weatherStorage } from '@/utils/storage';
import { APP_CONFIG } from '@/constants/weather';
import { Header } from './Header';
import { CurrentWeatherCard } from './CurrentWeatherCard';
import { ForecastCard } from './ForecastCard';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { WeatherCardSkeleton, ForecastCardSkeleton } from './SkeletonLoader';
import { toast } from '@/hooks/use-toast';

export const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>('celsius');
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const { loading, error, getWeatherData, getCurrentLocationWeather, refreshWeatherData } = useWeatherAPI();

  // Load initial data and preferences
  useEffect(() => {
    // Load saved preferences
    const savedUnit = localStorage.getItem('weather-unit') as TemperatureUnit;
    const savedSearches = localStorage.getItem('weather-recent-searches');
    const savedTheme = localStorage.getItem('weather-theme');
    
    if (savedUnit) setUnit(savedUnit);
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches));
      } catch (e) {
        console.error('Failed to parse saved searches');
      }
    }
    
    // Enhanced theme detection
    const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDarkMode = savedTheme === 'dark' || (!savedTheme && systemDarkMode);
    
    if (shouldUseDarkMode) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Load default location
    loadDefaultLocation();

    // Set up auto-refresh every 10 minutes
    const interval = setInterval(() => {
      if (weatherData) {
        refreshWeatherData(weatherData.location.lat, weatherData.location.lon)
          .then((data) => {
            if (data) {
              setWeatherData(data);
              toast({
                title: "Weather updated",
                description: "Latest weather data loaded",
              });
            }
          });
      }
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, []);

  const loadDefaultLocation = async () => {
    try {
      // Try to get user's current location first
      const currentLocationData = await getCurrentLocationWeather();
      if (currentLocationData) {
        setWeatherData(currentLocationData);
        toast({
          title: "Location detected",
          description: `Weather loaded for ${currentLocationData.location.name}`,
        });
        return;
      }
    } catch (e) {
      console.error('Failed to get current location');
    }

    // Fallback to default city (London)
    try {
      const defaultData = await getWeatherData(51.5074, -0.1278); // London coordinates
      if (defaultData) {
        setWeatherData(defaultData);
      }
    } catch (e) {
      console.error('Failed to load default location');
    }
  };

  const handleLocationSelect = async (location: SearchResult) => {
    try {
      const data = await getWeatherData(location.lat, location.lon);
      if (data) {
        setWeatherData(data);
        
        // Update recent searches
        const updatedSearches = [
          location,
          ...recentSearches.filter(
            (search) => !(search.lat === location.lat && search.lon === location.lon)
          )
        ].slice(0, 5); // Keep only 5 recent searches
        
        setRecentSearches(updatedSearches);
        localStorage.setItem('weather-recent-searches', JSON.stringify(updatedSearches));
        
        toast({
          title: "Weather updated",
          description: `Showing weather for ${data.location.name}`,
        });
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to load weather for selected location",
        variant: "destructive",
      });
    }
  };

  const handleCurrentLocation = async () => {
    try {
      const data = await getCurrentLocationWeather();
      if (data) {
        setWeatherData(data);
        toast({
          title: "Location updated",
          description: `Weather loaded for ${data.location.name}`,
        });
      }
    } catch (e) {
      toast({
        title: "Location error",
        description: "Unable to access your current location",
        variant: "destructive",
      });
    }
  };

  const handleUnitChange = (newUnit: TemperatureUnit) => {
    setUnit(newUnit);
    localStorage.setItem('weather-unit', newUnit);
    toast({
      title: "Unit changed",
      description: `Temperature unit changed to ${newUnit === 'celsius' ? 'Celsius' : 'Fahrenheit'}`,
    });
  };

  const handleThemeToggle = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('weather-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('weather-theme', 'light');
    }
    
    toast({
      title: "Theme changed",
      description: `Switched to ${newTheme ? 'dark' : 'light'} mode`,
    });
  };

  const handleRetry = () => {
    if (weatherData) {
      handleLocationSelect({
        name: weatherData.location.name,
        country: weatherData.location.country,
        lat: weatherData.location.lat,
        lon: weatherData.location.lon,
      });
    } else {
      loadDefaultLocation();
    }
  };

  const handleRefresh = async () => {
    if (weatherData) {
      const data = await refreshWeatherData(weatherData.location.lat, weatherData.location.lon);
      if (data) {
        setWeatherData(data);
        toast({
          title: "Refreshed",
          description: "Latest weather data loaded",
        });
      }
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <Header
          onLocationSelect={handleLocationSelect}
          onCurrentLocation={handleCurrentLocation}
          recentSearches={recentSearches}
          unit={unit}
          onUnitChange={handleUnitChange}
          isDarkMode={isDarkMode}
          onThemeToggle={handleThemeToggle}
        />

        <main className="space-y-8">
          {loading ? (
            <>
              <WeatherCardSkeleton />
              <ForecastCardSkeleton />
            </>
          ) : error ? (
            <ErrorMessage message={error} onRetry={handleRetry} />
          ) : weatherData ? (
            <>
              <CurrentWeatherCard data={weatherData} unit={unit} />
              <ForecastCard forecast={weatherData.forecast} unit={unit} />
            </>
          ) : (
            <>
              <WeatherCardSkeleton />
              <ForecastCardSkeleton />
            </>
          )}
        </main>

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>Weather data powered by OpenWeatherMap API</p>
          <p className="mt-1">Professional Weather Dashboard • Real-time Data</p>
        </footer>
      </div>
    </div>
  );
};