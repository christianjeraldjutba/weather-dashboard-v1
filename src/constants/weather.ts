/**
 * Weather application constants
 */

// API Configuration
export const WEATHER_API = {
  BASE_URL: 'https://api.openweathermap.org/data/2.5',
  GEO_URL: 'https://api.openweathermap.org/geo/1.0',
  CACHE_DURATION: Number(import.meta.env.VITE_WEATHER_CACHE_DURATION) || 10 * 60 * 1000, // 10 minutes
  LOCATION_TIMEOUT: Number(import.meta.env.VITE_LOCATION_REQUEST_TIMEOUT) || 10000, // 10 seconds
  MAX_SEARCH_RESULTS: 5,
  MAX_RECENT_SEARCHES: 5,
} as const;

// Application Configuration
export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'WeatherDash Pro',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  AUTO_REFRESH_INTERVAL: 10 * 60 * 1000, // 10 minutes
} as const;

// Default Locations
export const DEFAULT_LOCATIONS = {
  LONDON: { lat: 51.5074, lon: -0.1278, name: 'London' },
} as const;

// Theme Configuration
export const THEME = {
  STORAGE_KEY: 'weather-theme',
  UNIT_STORAGE_KEY: 'weather-unit',
  SEARCHES_STORAGE_KEY: 'weather-recent-searches',
  CURRENT_LOCATION_STORAGE_KEY: 'weather-current-location',
} as const;

// Weather Condition Icons Mapping
export const WEATHER_ICONS = {
  '01d': '☀️', // clear sky day
  '01n': '🌙', // clear sky night
  '02d': '⛅', // few clouds day
  '02n': '☁️', // few clouds night
  '03d': '☁️', // scattered clouds
  '03n': '☁️', // scattered clouds
  '04d': '☁️', // broken clouds
  '04n': '☁️', // broken clouds
  '09d': '🌧️', // shower rain
  '09n': '🌧️', // shower rain
  '10d': '🌦️', // rain day
  '10n': '🌧️', // rain night
  '11d': '⛈️', // thunderstorm
  '11n': '⛈️', // thunderstorm
  '13d': '❄️', // snow
  '13n': '❄️', // snow
  '50d': '🌫️', // mist
  '50n': '🌫️', // mist
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_API_KEY: 'Invalid API key. Please check your OpenWeatherMap API key.',
  CITY_NOT_FOUND: 'City not found. Please check spelling and try again.',
  TOO_MANY_REQUESTS: 'Too many requests. Please wait a moment and try again.',
  NETWORK_ERROR: 'Unable to connect to weather service. Please check your internet connection.',
  FETCH_ERROR: 'Network error. Please check your internet connection and try again.',
  LOCATION_DENIED: 'Location access denied. Please search manually or enable location permissions.',
  LOCATION_UNAVAILABLE: 'Location information unavailable. Please search manually.',
  LOCATION_TIMEOUT: 'Location request timed out. Please search manually.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
} as const;
