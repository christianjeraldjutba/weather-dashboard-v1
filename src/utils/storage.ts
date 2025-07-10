/**
 * Local storage utility functions
 */

import { SearchResult, TemperatureUnit } from '@/types/weather';
import { THEME } from '@/constants/weather';

/**
 * Generic localStorage wrapper with error handling
 */
export const storage = {
  /**
   * Get item from localStorage with type safety
   */
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue || null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue || null;
    }
  },

  /**
   * Set item in localStorage with error handling
   */
  set: <T>(key: string, value: T): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
      return false;
    }
  },

  /**
   * Remove item from localStorage
   */
  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage key "${key}":`, error);
      return false;
    }
  },

  /**
   * Clear all localStorage
   */
  clear: (): boolean => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};

/**
 * Weather-specific storage functions
 */
export const weatherStorage = {
  /**
   * Get saved temperature unit
   */
  getTemperatureUnit: (): TemperatureUnit => {
    return storage.get<TemperatureUnit>(THEME.UNIT_STORAGE_KEY, 'celsius') || 'celsius';
  },

  /**
   * Save temperature unit
   */
  setTemperatureUnit: (unit: TemperatureUnit): boolean => {
    return storage.set(THEME.UNIT_STORAGE_KEY, unit);
  },

  /**
   * Get saved theme preference
   */
  getTheme: (): 'light' | 'dark' | null => {
    return storage.get<'light' | 'dark'>(THEME.STORAGE_KEY);
  },

  /**
   * Save theme preference
   */
  setTheme: (theme: 'light' | 'dark'): boolean => {
    return storage.set(THEME.STORAGE_KEY, theme);
  },

  /**
   * Get recent searches
   */
  getRecentSearches: (): SearchResult[] => {
    return storage.get<SearchResult[]>(THEME.SEARCHES_STORAGE_KEY, []) || [];
  },

  /**
   * Save recent searches
   */
  setRecentSearches: (searches: SearchResult[]): boolean => {
    return storage.set(THEME.SEARCHES_STORAGE_KEY, searches);
  },

  /**
   * Add a new search to recent searches
   */
  addRecentSearch: (search: SearchResult): boolean => {
    const recentSearches = weatherStorage.getRecentSearches();
    
    // Remove duplicate if exists
    const filteredSearches = recentSearches.filter(
      (item) => !(item.lat === search.lat && item.lon === search.lon)
    );
    
    // Add new search at the beginning and limit to 5
    const updatedSearches = [search, ...filteredSearches].slice(0, 5);
    
    return weatherStorage.setRecentSearches(updatedSearches);
  }
};
