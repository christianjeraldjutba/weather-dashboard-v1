# API Documentation

## Overview

WeatherDash Pro uses the OpenWeatherMap API to fetch weather data. This document describes the API interfaces and data structures used in the application.

## API Endpoints

### Current Weather API
- **Endpoint**: `https://api.openweathermap.org/data/2.5/weather`
- **Method**: GET
- **Parameters**:
  - `lat`: Latitude coordinate
  - `lon`: Longitude coordinate
  - `appid`: API key
  - `units`: metric (for Celsius)

### 5-Day Weather Forecast API
- **Endpoint**: `https://api.openweathermap.org/data/2.5/forecast`
- **Method**: GET
- **Parameters**:
  - `lat`: Latitude coordinate
  - `lon`: Longitude coordinate
  - `appid`: API key
  - `units`: metric (for Celsius)

### Geocoding API
- **Endpoint**: `https://api.openweathermap.org/geo/1.0/direct`
- **Method**: GET
- **Parameters**:
  - `q`: City name
  - `limit`: Number of results (max 5)
  - `appid`: API key

## Data Structures

### WeatherData Interface

```typescript
interface WeatherData {
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
```

### ForecastDay Interface

```typescript
interface ForecastDay {
  date: string;
  day: {
    maxTemp: number;
    minTemp: number;
    condition: string;
    description: string;
    humidity: number;
    windSpeed: number;
    precipitation: number;
    icon: string;
  };
}
```

### SearchResult Interface

```typescript
interface SearchResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}
```

## Service Methods

### WeatherService.searchCities()

Searches for cities using the geocoding API.

**Parameters:**
- `query: string` - The search query (city name)

**Returns:**
- `Promise<SearchResult[]>` - Array of matching cities

**Example:**
```typescript
const cities = await WeatherService.searchCities('London');
```

### WeatherService.getWeatherData()

Gets complete weather data for specific coordinates.

**Parameters:**
- `lat: number` - Latitude coordinate (-90 to 90)
- `lon: number` - Longitude coordinate (-180 to 180)

**Returns:**
- `Promise<WeatherData>` - Complete weather information

**Example:**
```typescript
const weather = await WeatherService.getWeatherData(51.5074, -0.1278);
```

### WeatherService.getCurrentLocationWeather()

Gets weather data for the user's current location using geolocation.

**Returns:**
- `Promise<WeatherData | null>` - Weather data or null if location unavailable

**Example:**
```typescript
const weather = await WeatherService.getCurrentLocationWeather();
```

### WeatherService.refreshWeatherData()

Refreshes weather data by clearing cache and fetching fresh data.

**Parameters:**
- `lat: number` - Latitude coordinate
- `lon: number` - Longitude coordinate

**Returns:**
- `Promise<WeatherData>` - Fresh weather data

**Example:**
```typescript
const weather = await WeatherService.refreshWeatherData(51.5074, -0.1278);
```

## Error Handling

All service methods throw descriptive errors:

- **Validation Errors**: Invalid input parameters
- **Network Errors**: Connection issues
- **API Errors**: Invalid API key, rate limiting, etc.
- **Location Errors**: Geolocation permission denied

## Caching

The service implements intelligent caching:

- **Cache Duration**: 10 minutes (configurable)
- **Cache Keys**: Based on coordinates and query
- **Cache Storage**: In-memory Map
- **Cache Invalidation**: Automatic expiration and manual refresh

## Rate Limiting

To prevent API abuse:

- **Search API**: 60 requests per minute
- **Weather API**: 60 requests per minute
- **Implementation**: Sliding window algorithm
- **Storage**: In-memory tracking

## Configuration

Environment variables for API configuration:

```env
VITE_OPENWEATHER_API_KEY=your_api_key_here
VITE_WEATHER_CACHE_DURATION=600000
VITE_LOCATION_REQUEST_TIMEOUT=10000
```

## Error Codes

Common error scenarios:

| Code | Description | Solution |
|------|-------------|----------|
| 401 | Invalid API key | Check API key configuration |
| 404 | City not found | Verify city name spelling |
| 429 | Rate limit exceeded | Wait before making more requests |
| Network | Connection failed | Check internet connection |

## Best Practices

1. **Always handle errors** - Use try-catch blocks
2. **Validate inputs** - Check coordinates and queries
3. **Respect rate limits** - Don't make excessive requests
4. **Cache responses** - Avoid unnecessary API calls
5. **Handle offline scenarios** - Provide fallback UI

## Testing

Mock data structures for testing:

```typescript
const mockWeatherData: WeatherData = {
  location: {
    name: 'London',
    country: 'GB',
    lat: 51.5074,
    lon: -0.1278
  },
  current: {
    temperature: 20,
    feelsLike: 22,
    condition: 'Clear',
    description: 'clear sky',
    humidity: 65,
    windSpeed: 15,
    visibility: 10,
    pressure: 1013,
    uvIndex: 5,
    icon: '01d'
  },
  forecast: [],
  lastUpdated: new Date().toISOString()
};
```
