/**
 * Weather utility functions
 */

import { TemperatureUnit } from '@/types/weather';
import { WEATHER_ICONS } from '@/constants/weather';

/**
 * Convert temperature between Celsius and Fahrenheit
 *
 * @param temp - Temperature value in Celsius
 * @param unit - Target temperature unit ('celsius' or 'fahrenheit')
 * @returns Converted temperature value, rounded to nearest integer
 *
 * @example
 * ```typescript
 * convertTemperature(20, 'fahrenheit'); // Returns 68
 * convertTemperature(20, 'celsius'); // Returns 20
 * ```
 */
export const convertTemperature = (temp: number, unit: TemperatureUnit): number => {
  if (unit === 'fahrenheit') {
    return Math.round((temp * 9/5) + 32);
  }
  return Math.round(temp);
};

/**
 * Get temperature unit symbol
 */
export const getTemperatureUnit = (unit: TemperatureUnit): string => {
  return unit === 'fahrenheit' ? '°F' : '°C';
};

/**
 * Convert wind speed from m/s to km/h
 */
export const convertWindSpeed = (speedMs: number): number => {
  return Math.round(speedMs * 3.6);
};

/**
 * Convert visibility from meters to kilometers
 */
export const convertVisibility = (visibilityM: number): number => {
  return Math.round(visibilityM / 1000);
};

/**
 * Get weather icon emoji from OpenWeatherMap icon code
 */
export const getWeatherIcon = (iconCode: string): string => {
  return WEATHER_ICONS[iconCode as keyof typeof WEATHER_ICONS] || '🌤️';
};

/**
 * Format date for display
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format time for display
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Get day name from date string
 */
export const getDayName = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (str: string): string => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Debounce function for search input
 *
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 *
 * @example
 * ```typescript
 * const debouncedSearch = debounce((query: string) => {
 *   console.log('Searching for:', query);
 * }, 300);
 *
 * debouncedSearch('London'); // Will only execute after 300ms of no calls
 * ```
 */
export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Validate coordinates
 */
export const isValidCoordinates = (lat: number, lon: number): boolean => {
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
};

/**
 * Generate cache key for API requests
 */
export const generateCacheKey = (prefix: string, ...params: (string | number)[]): string => {
  return `${prefix}_${params.join('_')}`;
};
