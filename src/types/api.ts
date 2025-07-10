/**
 * OpenWeatherMap API Response Types
 * These interfaces match the exact structure returned by the OpenWeatherMap API
 */

export interface OpenWeatherMapCoordinates {
  lat: number;
  lon: number;
}

export interface OpenWeatherMapWeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface OpenWeatherMapMainData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

export interface OpenWeatherMapWindData {
  speed: number;
  deg: number;
  gust?: number;
}

export interface OpenWeatherMapCloudsData {
  all: number;
}

export interface OpenWeatherMapSysData {
  type?: number;
  id?: number;
  country: string;
  sunrise: number;
  sunset: number;
}

export interface OpenWeatherMapCurrentWeatherResponse {
  coord: OpenWeatherMapCoordinates;
  weather: OpenWeatherMapWeatherCondition[];
  base: string;
  main: OpenWeatherMapMainData;
  visibility?: number;
  wind: OpenWeatherMapWindData;
  clouds: OpenWeatherMapCloudsData;
  dt: number;
  sys: OpenWeatherMapSysData;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface OpenWeatherMapForecastItem {
  dt: number;
  main: OpenWeatherMapMainData;
  weather: OpenWeatherMapWeatherCondition[];
  clouds: OpenWeatherMapCloudsData;
  wind: OpenWeatherMapWindData;
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

export interface OpenWeatherMapForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: OpenWeatherMapForecastItem[];
  city: {
    id: number;
    name: string;
    coord: OpenWeatherMapCoordinates;
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface OpenWeatherMapGeocodingResponse {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

/**
 * Cache data structure
 */
export interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
}

/**
 * Daily forecast processing data structure
 */
export interface DailyForecastData {
  temps: number[];
  conditions: OpenWeatherMapWeatherCondition[];
  icons: string[];
  humidity: number[];
  windSpeed: number[];
  precipitation: number[];
}

/**
 * Error types for better error handling
 */
export interface WeatherAPIError extends Error {
  status?: number;
  code?: string;
}
