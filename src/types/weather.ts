export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temperature: number;
    feelsLike: number;
    condition: string;
    description: string;
    humidity: number;
    windSpeed: number;
    visibility: number;
    pressure: number;
    uvIndex: number;
    icon: string;
  };
  forecast: ForecastDay[];
  lastUpdated: string;
}

export interface ForecastDay {
  date: string;
  day: {
    maxTemp: number;
    minTemp: number;
    condition: string;
    description: string;
    humidity: number;
    windSpeed: number;
    icon: string;
    precipitation: number;
  };
}

export interface SearchResult {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface WeatherState {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
  unit: TemperatureUnit;
  recentSearches: SearchResult[];
}