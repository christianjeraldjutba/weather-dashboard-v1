/**
 * Custom hook for weather API operations
 * This hook provides a clean interface for weather-related API calls
 */

import { useState, useCallback } from 'react';
import { WeatherData, SearchResult } from '@/types/weather';
import { WeatherService } from '@/services/weatherService';

export const useWeatherAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Search for cities by name
   */
  const searchCities = useCallback(async (query: string): Promise<SearchResult[]> => {
    if (query.length < 2) return [];
    
    try {
      setError(null);
      return await WeatherService.searchCities(query);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search cities';
      setError(errorMessage);
      return [];
    }
  }, []);

  /**
   * Get weather data for specific coordinates
   */
  const getWeatherData = useCallback(async (lat: number, lon: number): Promise<WeatherData | null> => {
    try {
      setLoading(true);
      setError(null);
      return await WeatherService.getWeatherData(lat, lon);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get weather data';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get weather for current location using geolocation
   */
  const getCurrentLocationWeather = useCallback(async (): Promise<WeatherData | null> => {
    try {
      setLoading(true);
      setError(null);
      return await WeatherService.getCurrentLocationWeather();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get current location weather';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh weather data (clears cache and fetches fresh data)
   */
  const refreshWeatherData = useCallback(async (lat: number, lon: number): Promise<WeatherData | null> => {
    try {
      setLoading(true);
      setError(null);
      return await WeatherService.refreshWeatherData(lat, lon);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh weather data';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Check if API key is configured
   */
  const hasAPIKey = useCallback(() => {
    return WeatherService.hasAPIKey();
  }, []);

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
