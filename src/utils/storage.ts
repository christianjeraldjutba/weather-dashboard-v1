/**
 * Enhanced storage utilities for weather application
 * Provides type-safe localStorage operations with encryption and error handling
 */

import CryptoJS from 'crypto-js';
import { SearchResult, TemperatureUnit } from '@/types/weather';
import { THEME } from '@/constants/weather';

/**
 * Encryption key for sensitive data
 * In production, this should be derived from user session or environment
 */
const ENCRYPTION_KEY = import.meta.env.VITE_STORAGE_ENCRYPTION_KEY || 'weather-dashboard-default-key';

/**
 * Secure storage utility with encryption
 */
export const secureStorage = {
  /**
   * Encrypt data before storing
   */
  encrypt: (data: string): string => {
    try {
      return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
    } catch (error) {
      console.error('Encryption failed:', error);
      return data; // Fallback to unencrypted
    }
  },

  /**
   * Decrypt data after retrieving
   */
  decrypt: (encryptedData: string): string => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted || encryptedData; // Fallback if decryption fails
    } catch (error) {
      console.error('Decryption failed:', error);
      return encryptedData; // Fallback to original data
    }
  },

  /**
   * Store encrypted data
   */
  setSecure: <T>(key: string, value: T): boolean => {
    try {
      const jsonString = JSON.stringify(value);
      const encrypted = secureStorage.encrypt(jsonString);
      localStorage.setItem(`secure_${key}`, encrypted);
      return true;
    } catch (error) {
      console.error(`Error storing secure data for key "${key}":`, error);
      return false;
    }
  },

  /**
   * Retrieve and decrypt data
   */
  getSecure: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const encrypted = localStorage.getItem(`secure_${key}`);
      if (!encrypted) return defaultValue || null;

      const decrypted = secureStorage.decrypt(encrypted);
      return JSON.parse(decrypted) as T;
    } catch (error) {
      console.error(`Error retrieving secure data for key "${key}":`, error);
      return defaultValue || null;
    }
  },

  /**
   * Remove secure data
   */
  removeSecure: (key: string): boolean => {
    try {
      localStorage.removeItem(`secure_${key}`);
      return true;
    } catch (error) {
      console.error(`Error removing secure data for key "${key}":`, error);
      return false;
    }
  }
};

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
  },

  /**
   * Get saved current location
   */
  getCurrentLocation: (): SearchResult | null => {
    return storage.get<SearchResult>(THEME.CURRENT_LOCATION_STORAGE_KEY);
  },

  /**
   * Save current location
   */
  setCurrentLocation: (location: SearchResult): boolean => {
    return storage.set(THEME.CURRENT_LOCATION_STORAGE_KEY, location);
  },

  /**
   * Clear saved current location
   */
  clearCurrentLocation: (): boolean => {
    return storage.remove(THEME.CURRENT_LOCATION_STORAGE_KEY);
  }
};
