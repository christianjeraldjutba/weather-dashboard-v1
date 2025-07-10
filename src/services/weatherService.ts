/**
 * Weather service for API interactions
 *
 * This service provides a clean interface for weather-related API operations,
 * including caching, validation, and error handling.
 *
 * @example
 * ```typescript
 * // Search for cities
 * const cities = await WeatherService.searchCities('London');
 *
 * // Get weather data
 * const weather = await WeatherService.getWeatherData(51.5074, -0.1278);
 *
 * // Get current location weather
 * const currentWeather = await WeatherService.getCurrentLocationWeather();
 * ```
 */

import {
  OpenWeatherMapCurrentWeatherResponse,
  OpenWeatherMapForecastResponse,
  OpenWeatherMapGeocodingResponse,
  CacheEntry,
  DailyForecastData,
  WeatherAPIError
} from '@/types/api';
import { WeatherData, SearchResult } from '@/types/weather';
import { WEATHER_API, ERROR_MESSAGES, DEFAULT_LOCATIONS } from '@/constants/weather';
import { convertWindSpeed, convertVisibility, generateCacheKey } from '@/utils/weather';
import { validateSearchQuery, validateCoordinates, apiRateLimiter } from '@/utils/validation';

/**
 * API key validation
 */
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

if (!API_KEY) {
  console.error('VITE_OPENWEATHER_API_KEY is not configured. Please check your .env file.');
}

/**
 * Cache for API responses
 */
const cache = new Map<string, CacheEntry>();

/**
 * Cache utility functions
 */
const cacheUtils = {
  get: <T>(key: string): T | null => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < WEATHER_API.CACHE_DURATION) {
      return cached.data as T;
    }
    return null;
  },

  set: <T>(key: string, data: T): void => {
    cache.set(key, {
      data,
      timestamp: Date.now()
    });
  },

  delete: (key: string): void => {
    cache.delete(key);
  },

  clear: (): void => {
    cache.clear();
  }
};

/**
 * Enhanced error message handler
 */
const getErrorMessage = (error: WeatherAPIError | Error | unknown): string => {
  console.error('Weather API Error:', error);
  
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  if (errorMessage.includes('401')) {
    return ERROR_MESSAGES.INVALID_API_KEY;
  }
  if (errorMessage.includes('404')) {
    return ERROR_MESSAGES.CITY_NOT_FOUND;
  }
  if (errorMessage.includes('429')) {
    return ERROR_MESSAGES.TOO_MANY_REQUESTS;
  }
  if (errorMessage.includes('NetworkError') || errorMessage.includes('fetch')) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }
  if (errorMessage.includes('Failed to fetch')) {
    return ERROR_MESSAGES.FETCH_ERROR;
  }
  return `Weather service error: ${errorMessage || ERROR_MESSAGES.GENERIC_ERROR}`;
};

/**
 * Weather Service Class
 */
export class WeatherService {
  /**
   * Search for cities using geocoding API
   *
   * @param query - The search query (city name)
   * @returns Promise resolving to array of search results
   * @throws {Error} When validation fails or API request fails
   *
   * @example
   * ```typescript
   * const cities = await WeatherService.searchCities('London');
   * console.log(cities[0].name); // "London"
   * ```
   */
  static async searchCities(query: string): Promise<SearchResult[]> {
    // Validate and sanitize input
    const validation = validateSearchQuery(query);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // Rate limiting
    if (!apiRateLimiter.isAllowed('search')) {
      throw new Error('Too many search requests. Please wait a moment.');
    }

    const cacheKey = generateCacheKey('search', query);
    const cached = cacheUtils.get<SearchResult[]>(cacheKey);
    if (cached) return cached;
    
    try {
      const response = await fetch(
        `${WEATHER_API.GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=${WEATHER_API.MAX_SEARCH_RESULTS}&appid=${API_KEY}`
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to search cities'}`);
      }
      
      const data: OpenWeatherMapGeocodingResponse[] = await response.json();
      const results = data.map((item: OpenWeatherMapGeocodingResponse) => ({
        name: item.name,
        country: item.country,
        state: item.state,
        lat: item.lat,
        lon: item.lon,
      }));
      
      cacheUtils.set(cacheKey, results);
      return results;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get weather data for specific coordinates
   *
   * @param lat - Latitude coordinate (-90 to 90)
   * @param lon - Longitude coordinate (-180 to 180)
   * @returns Promise resolving to complete weather data
   * @throws {Error} When coordinates are invalid or API request fails
   *
   * @example
   * ```typescript
   * const weather = await WeatherService.getWeatherData(51.5074, -0.1278);
   * console.log(weather.current.temperature); // Current temperature
   * console.log(weather.forecast.length); // 5 (days)
   * ```
   */
  static async getWeatherData(lat: number, lon: number): Promise<WeatherData> {
    // Validate coordinates
    const validation = validateCoordinates(lat, lon);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // Rate limiting
    if (!apiRateLimiter.isAllowed('weather')) {
      throw new Error('Too many weather requests. Please wait a moment.');
    }

    const cacheKey = generateCacheKey('weather', lat, lon);
    const cached = cacheUtils.get<WeatherData>(cacheKey);
    if (cached) return cached;

    try {
      // Get current weather and forecast with enhanced error handling
      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(`${WEATHER_API.BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`),
        fetch(`${WEATHER_API.BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
      ]);

      if (!currentResponse.ok) {
        const errorText = await currentResponse.text();
        throw new Error(`HTTP ${currentResponse.status}: ${errorText || 'Failed to fetch current weather'}`);
      }
      
      if (!forecastResponse.ok) {
        const errorText = await forecastResponse.text();
        throw new Error(`HTTP ${forecastResponse.status}: ${errorText || 'Failed to fetch forecast'}`);
      }

      const [currentData, forecastData] = await Promise.all([
        currentResponse.json() as Promise<OpenWeatherMapCurrentWeatherResponse>,
        forecastResponse.json() as Promise<OpenWeatherMapForecastResponse>
      ]);

      // Enhanced forecast processing - get daily data more accurately
      const dailyMap = new Map<string, DailyForecastData>();
      
      forecastData.list.forEach((item) => {
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
        
        const dayData = dailyMap.get(date)!;
        dayData.temps.push(item.main.temp);
        dayData.conditions.push(item.weather[0]);
        dayData.humidity.push(item.main.humidity);
        dayData.windSpeed.push(item.wind.speed);
        dayData.precipitation.push(item.pop);
        dayData.icons.push(item.weather[0].icon);
      });

      const dailyForecasts = Array.from(dailyMap.entries())
        .slice(0, 5)
        .map(([date, data]: [string, DailyForecastData]) => ({
          date,
          day: {
            maxTemp: Math.round(Math.max(...data.temps)),
            minTemp: Math.round(Math.min(...data.temps)),
            condition: data.conditions[0].main,
            description: data.conditions[0].description,
            humidity: Math.round(data.humidity.reduce((a: number, b: number) => a + b, 0) / data.humidity.length),
            windSpeed: Math.round((data.windSpeed.reduce((a: number, b: number) => a + b, 0) / data.windSpeed.length) * 3.6),
            precipitation: Math.round((data.precipitation.reduce((a: number, b: number) => a + b, 0) / data.precipitation.length) * 100),
            icon: data.icons[0],
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
          windSpeed: convertWindSpeed(currentData.wind.speed),
          visibility: convertVisibility(currentData.visibility || 10000),
          pressure: currentData.main.pressure,
          uvIndex: 0, // Would need separate UV API call
          icon: currentData.weather[0].icon,
        },
        forecast: dailyForecasts,
        lastUpdated: new Date().toISOString(),
      };

      cacheUtils.set(cacheKey, weatherData);
      return weatherData;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get current location weather using geolocation
   */
  static async getCurrentLocationWeather(): Promise<WeatherData | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const data = await WeatherService.getWeatherData(latitude, longitude);
            resolve(data);
          } catch (error) {
            console.error('Error getting weather for current location:', error);
            resolve(null);
          }
        },
        (error) => {
          let errorMessage = 'Failed to get your location';
          if (error.code === error.PERMISSION_DENIED) {
            errorMessage = ERROR_MESSAGES.LOCATION_DENIED;
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMessage = ERROR_MESSAGES.LOCATION_UNAVAILABLE;
          } else if (error.code === error.TIMEOUT) {
            errorMessage = ERROR_MESSAGES.LOCATION_TIMEOUT;
          }
          console.error(errorMessage);
          resolve(null);
        },
        {
          timeout: WEATHER_API.LOCATION_TIMEOUT,
          enableHighAccuracy: false,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  /**
   * Refresh weather data (clears cache and fetches fresh data)
   */
  static async refreshWeatherData(lat: number, lon: number): Promise<WeatherData> {
    const cacheKey = generateCacheKey('weather', lat, lon);
    cacheUtils.delete(cacheKey);
    return WeatherService.getWeatherData(lat, lon);
  }

  /**
   * Get default location weather (London)
   */
  static async getDefaultLocationWeather(): Promise<WeatherData> {
    const { lat, lon } = DEFAULT_LOCATIONS.LONDON;
    return WeatherService.getWeatherData(lat, lon);
  }

  /**
   * Check if API key is configured
   */
  static hasAPIKey(): boolean {
    return !!API_KEY;
  }

  /**
   * Clear all cached data
   */
  static clearCache(): void {
    cacheUtils.clear();
  }
}
