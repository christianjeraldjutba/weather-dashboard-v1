import { useState, useCallback } from 'react';
import { WeatherData, SearchResult } from '@/types/weather';

// OpenWeatherMap API configuration
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';
const API_KEY = 'e8ab32fc68258a079b72b1bbd8f588f';

// Cache for API responses (10 minutes)
const CACHE_DURATION = 10 * 60 * 1000;
const cache = new Map();

const getCachedData = (key: string) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key: string, data: any) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

// Enhanced error messages
const getErrorMessage = (error: any): string => {
  if (error.message?.includes('404')) {
    return 'City not found. Please check spelling and try again.';
  }
  if (error.message?.includes('429')) {
    return 'Too many requests. Please wait a moment and try again.';
  }
  if (error.message?.includes('NetworkError') || error.message?.includes('fetch')) {
    return 'Unable to connect to weather service. Please check your internet connection.';
  }
  return 'Something went wrong. Please try again.';
};

export const useWeatherAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCities = useCallback(async (query: string): Promise<SearchResult[]> => {
    if (query.length < 2) return [];
    
    const cacheKey = `search_${query}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;
    
    try {
      setError(null);
      const response = await fetch(
        `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to search cities`);
      }
      
      const data = await response.json();
      const results = data.map((item: any) => ({
        name: item.name,
        country: item.country,
        state: item.state,
        lat: item.lat,
        lon: item.lon,
      }));
      
      setCachedData(cacheKey, results);
      return results;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      return [];
    }
  }, []);

  const getWeatherData = useCallback(async (lat: number, lon: number): Promise<WeatherData | null> => {
    const cacheKey = `weather_${lat}_${lon}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
      setLoading(true);
      setError(null);

      // Get current weather and forecast with enhanced error handling
      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`),
        fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
      ]);

      if (!currentResponse.ok) {
        throw new Error(`HTTP ${currentResponse.status}: Failed to fetch current weather`);
      }
      
      if (!forecastResponse.ok) {
        throw new Error(`HTTP ${forecastResponse.status}: Failed to fetch forecast`);
      }

      const [currentData, forecastData] = await Promise.all([
        currentResponse.json(),
        forecastResponse.json()
      ]);

      // Enhanced forecast processing - get daily data more accurately
      const dailyMap = new Map();
      
      forecastData.list.forEach((item: any) => {
        const date = item.dt_txt.split(' ')[0];
        if (!dailyMap.has(date)) {
          dailyMap.set(date, {
            temps: [],
            conditions: [],
            humidity: [],
            windSpeed: [],
            precipitation: [],
            icons: []
          });
        }
        
        const dayData = dailyMap.get(date);
        dayData.temps.push(item.main.temp);
        dayData.conditions.push(item.weather[0]);
        dayData.humidity.push(item.main.humidity);
        dayData.windSpeed.push(item.wind.speed);
        dayData.precipitation.push(item.pop);
        dayData.icons.push(item.weather[0].icon);
      });

      const dailyForecasts = Array.from(dailyMap.entries())
        .slice(0, 5)
        .map(([date, data]: [string, any]) => ({
          date,
          day: {
            maxTemp: Math.round(Math.max(...data.temps)),
            minTemp: Math.round(Math.min(...data.temps)),
            condition: data.conditions[0].main,
            description: data.conditions[0].description,
            humidity: Math.round(data.humidity.reduce((a: number, b: number) => a + b, 0) / data.humidity.length),
            windSpeed: Math.round((data.windSpeed.reduce((a: number, b: number) => a + b, 0) / data.windSpeed.length) * 3.6),
            icon: data.icons[Math.floor(data.icons.length / 2)], // Take middle icon
            precipitation: Math.round((data.precipitation.reduce((a: number, b: number) => a + b, 0) / data.precipitation.length) * 100),
          }
        }));

      const weatherData: WeatherData = {
        location: {
          name: currentData.name,
          country: currentData.sys.country,
          lat: currentData.coord.lat,
          lon: currentData.coord.lon,
        },
        current: {
          temperature: Math.round(currentData.main.temp),
          feelsLike: Math.round(currentData.main.feels_like),
          condition: currentData.weather[0].main,
          description: currentData.weather[0].description,
          humidity: currentData.main.humidity,
          windSpeed: Math.round(currentData.wind.speed * 3.6),
          visibility: Math.round((currentData.visibility || 10000) / 1000),
          pressure: currentData.main.pressure,
          uvIndex: 0, // Would need separate UV API call
          icon: currentData.weather[0].icon,
        },
        forecast: dailyForecasts,
        lastUpdated: new Date().toISOString(),
      };

      setCachedData(cacheKey, weatherData);
      return weatherData;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCurrentLocationWeather = useCallback(async (): Promise<WeatherData | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by this browser');
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const data = await getWeatherData(latitude, longitude);
          resolve(data);
        },
        (error) => {
          let errorMessage = 'Failed to get your location';
          if (error.code === error.PERMISSION_DENIED) {
            errorMessage = 'Location access denied. Please search manually or enable location permissions.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMessage = 'Location information unavailable. Please search manually.';
          } else if (error.code === error.TIMEOUT) {
            errorMessage = 'Location request timed out. Please search manually.';
          }
          setError(errorMessage);
          resolve(null);
        },
        {
          timeout: 10000,
          enableHighAccuracy: false,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }, [getWeatherData]);

  const hasAPIKey = useCallback(() => {
    return !!API_KEY;
  }, []);

  // Auto-refresh functionality
  const refreshWeatherData = useCallback(async (lat: number, lon: number): Promise<WeatherData | null> => {
    // Clear cache for this location to force fresh data
    const cacheKey = `weather_${lat}_${lon}`;
    cache.delete(cacheKey);
    return getWeatherData(lat, lon);
  }, [getWeatherData]);

  return {
    loading,
    error,
    searchCities,
    getWeatherData,
    getCurrentLocationWeather,
    refreshWeatherData,
    hasAPIKey,
  };
};