import { useState, useCallback } from 'react';
import { WeatherData, SearchResult } from '@/types/weather';

// OpenWeatherMap API configuration
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// Demo data for when no API key is available
const DEMO_WEATHER_DATA = {
  location: {
    name: 'London',
    country: 'GB',
    lat: 51.5074,
    lon: -0.1278,
  },
  current: {
    temperature: 18,
    feelsLike: 20,
    condition: 'Clouds',
    description: 'partly cloudy',
    humidity: 65,
    windSpeed: 15,
    visibility: 10,
    pressure: 1013,
    uvIndex: 3,
    icon: '02d',
  },
  forecast: [
    {
      date: new Date().toISOString().split('T')[0],
      day: {
        maxTemp: 22,
        minTemp: 15,
        condition: 'Clouds',
        description: 'partly cloudy',
        humidity: 60,
        windSpeed: 12,
        icon: '02d',
        precipitation: 20,
      }
    },
    {
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      day: {
        maxTemp: 25,
        minTemp: 17,
        condition: 'Clear',
        description: 'clear sky',
        humidity: 55,
        windSpeed: 8,
        icon: '01d',
        precipitation: 5,
      }
    },
    {
      date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
      day: {
        maxTemp: 19,
        minTemp: 12,
        condition: 'Rain',
        description: 'light rain',
        humidity: 80,
        windSpeed: 20,
        icon: '10d',
        precipitation: 75,
      }
    },
    {
      date: new Date(Date.now() + 259200000).toISOString().split('T')[0],
      day: {
        maxTemp: 23,
        minTemp: 16,
        condition: 'Clear',
        description: 'clear sky',
        humidity: 50,
        windSpeed: 10,
        icon: '01d',
        precipitation: 0,
      }
    },
    {
      date: new Date(Date.now() + 345600000).toISOString().split('T')[0],
      day: {
        maxTemp: 21,
        minTemp: 14,
        condition: 'Clouds',
        description: 'scattered clouds',
        humidity: 70,
        windSpeed: 14,
        icon: '03d',
        precipitation: 30,
      }
    }
  ],
  lastUpdated: new Date().toISOString(),
};

const getAPIKey = () => {
  return localStorage.getItem('openweather-api-key') || '';
};

export const useWeatherAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCities = useCallback(async (query: string): Promise<SearchResult[]> => {
    if (query.length < 2) return [];
    
    const apiKey = getAPIKey();
    if (!apiKey) {
      // Return demo cities when no API key
      const demoCities = [
        { name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278 },
        { name: 'New York', country: 'US', lat: 40.7128, lon: -74.0060 },
        { name: 'Tokyo', country: 'JP', lat: 35.6762, lon: 139.6503 },
        { name: 'Paris', country: 'FR', lat: 48.8566, lon: 2.3522 },
        { name: 'Sydney', country: 'AU', lat: -33.8688, lon: 151.2093 },
      ].filter(city => 
        city.name.toLowerCase().includes(query.toLowerCase()) ||
        city.country.toLowerCase().includes(query.toLowerCase())
      );
      return demoCities;
    }
    
    try {
      setError(null);
      const response = await fetch(
        `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to search cities');
      }
      
      const data = await response.json();
      return data.map((item: any) => ({
        name: item.name,
        country: item.country,
        lat: item.lat,
        lon: item.lon,
      }));
    } catch (err) {
      setError('Failed to search cities');
      return [];
    }
  }, []);

  const getWeatherData = useCallback(async (lat: number, lon: number): Promise<WeatherData | null> => {
    const apiKey = getAPIKey();
    
    // Return demo data if no API key is available
    if (!apiKey) {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
      
      // Customize demo data based on location
      const customDemoData = { ...DEMO_WEATHER_DATA };
      
      // Simple location mapping for demo
      if (lat === 40.7128) { // New York
        customDemoData.location = { name: 'New York', country: 'US', lat, lon };
        customDemoData.current.temperature = 22;
        customDemoData.current.description = 'clear sky';
        customDemoData.current.icon = '01d';
      } else if (lat === 35.6762) { // Tokyo
        customDemoData.location = { name: 'Tokyo', country: 'JP', lat, lon };
        customDemoData.current.temperature = 25;
        customDemoData.current.description = 'few clouds';
        customDemoData.current.icon = '02d';
      } else if (lat === 48.8566) { // Paris
        customDemoData.location = { name: 'Paris', country: 'FR', lat, lon };
        customDemoData.current.temperature = 16;
        customDemoData.current.description = 'light rain';
        customDemoData.current.icon = '10d';
      } else if (lat === -33.8688) { // Sydney
        customDemoData.location = { name: 'Sydney', country: 'AU', lat, lon };
        customDemoData.current.temperature = 28;
        customDemoData.current.description = 'clear sky';
        customDemoData.current.icon = '01d';
      }
      
      return customDemoData;
    }

    try {
      setLoading(true);
      setError(null);

      // Get current weather and forecast
      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`),
        fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
      ]);

      if (!currentResponse.ok || !forecastResponse.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const [currentData, forecastData] = await Promise.all([
        currentResponse.json(),
        forecastResponse.json()
      ]);

      // Process forecast data (group by day and take first entry for each day)
      const dailyForecasts = forecastData.list
        .filter((_: any, index: number) => index % 8 === 0) // Every 8th entry (24h/3h = 8)
        .slice(0, 5)
        .map((item: any) => ({
          date: item.dt_txt.split(' ')[0],
          day: {
            maxTemp: Math.round(item.main.temp_max),
            minTemp: Math.round(item.main.temp_min),
            condition: item.weather[0].main,
            description: item.weather[0].description,
            humidity: item.main.humidity,
            windSpeed: Math.round(item.wind.speed * 3.6), // Convert m/s to km/h
            icon: item.weather[0].icon,
            precipitation: item.pop * 100, // Convert to percentage
          }
        }));

      return {
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
          windSpeed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
          visibility: Math.round(currentData.visibility / 1000), // Convert to km
          pressure: currentData.main.pressure,
          uvIndex: 0, // Would need UV index API
          icon: currentData.weather[0].icon,
        },
        forecast: dailyForecasts,
        lastUpdated: new Date().toISOString(),
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCurrentLocationWeather = useCallback(async (): Promise<WeatherData | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by this browser');
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const data = await getWeatherData(latitude, longitude);
          resolve(data);
        },
        () => {
          setError('Failed to get your location');
          resolve(null);
        }
      );
    });
  }, [getWeatherData]);

  const hasAPIKey = useCallback(() => {
    return !!getAPIKey();
  }, []);

  return {
    loading,
    error,
    searchCities,
    getWeatherData,
    getCurrentLocationWeather,
    hasAPIKey,
  };
};