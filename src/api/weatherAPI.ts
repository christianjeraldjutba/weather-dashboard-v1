/**
 * Weather API client
 * This module handles all HTTP requests to the OpenWeatherMap API
 */

import { WEATHER_API } from '@/constants/weather';

/**
 * Base API client configuration
 */
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

/**
 * Base fetch wrapper with error handling
 */
const apiRequest = async <T>(url: string): Promise<T> => {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || 'API request failed'}`);
    }
    
    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error occurred');
  }
};

/**
 * Weather API endpoints
 */
export const weatherAPI = {
  /**
   * Get current weather by coordinates
   */
  getCurrentWeather: (lat: number, lon: number) => {
    const url = `${WEATHER_API.BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    return apiRequest(url);
  },

  /**
   * Get weather forecast by coordinates
   */
  getForecast: (lat: number, lon: number) => {
    const url = `${WEATHER_API.BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    return apiRequest(url);
  },

  /**
   * Search cities by name
   */
  searchCities: (query: string, limit: number = WEATHER_API.MAX_SEARCH_RESULTS) => {
    const url = `${WEATHER_API.GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=${limit}&appid=${API_KEY}`;
    return apiRequest(url);
  },

  /**
   * Get city by coordinates (reverse geocoding)
   */
  getCityByCoordinates: (lat: number, lon: number) => {
    const url = `${WEATHER_API.GEO_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
    return apiRequest(url);
  }
};
