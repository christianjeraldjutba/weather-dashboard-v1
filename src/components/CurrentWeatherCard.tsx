import React from 'react';
import { WeatherData, TemperatureUnit } from '@/types/weather';
import { WeatherIcon } from './WeatherIcon';
import { MapPin, Thermometer, Droplets, Wind, Eye, Gauge } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { convertTemperature, getTemperatureUnit, capitalizeWords } from '@/utils/weather';

interface CurrentWeatherCardProps {
  data: WeatherData;
  unit: TemperatureUnit;
}

export const CurrentWeatherCard = React.memo<CurrentWeatherCardProps>(({ data, unit }) => {
  
  const getSpeedUnit = () => unit === 'fahrenheit' ? 'mph' : 'km/h';
  
  const convertSpeed = (speed: number) => {
    if (unit === 'fahrenheit') {
      return Math.round(speed * 0.621371); // Convert km/h to mph
    }
    return speed;
  };

  const getWeatherGradient = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return 'bg-sunny-gradient';
      case 'clouds':
        return 'bg-gradient-to-br from-blue-400/30 to-gray-400/30';
      case 'rain':
      case 'drizzle':
        return 'bg-gradient-to-br from-blue-600/30 to-blue-800/30';
      case 'thunderstorm':
        return 'bg-gradient-to-br from-purple-600/30 to-gray-800/30';
      case 'snow':
        return 'bg-gradient-to-br from-blue-200/30 to-white/30';
      default:
        return 'bg-premium-gradient opacity-20';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Weather Card */}
      <Card
        className="lg:col-span-2 glass-card p-8 sm:p-12 weather-fade-in rounded-2xl sm:rounded-3xl relative overflow-hidden group"
        role="main"
        aria-label="Current weather information"
      >
        {/* Dynamic weather background */}
        <div className="absolute inset-0 opacity-10 dark:opacity-20 transition-opacity duration-300">
          <div className={`w-full h-full ${getWeatherGradient(data.current.condition)}`} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative" aria-hidden="true">
              <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400 drop-shadow-lg" />
              <div className="absolute inset-0 h-6 w-6 text-blue-600/30 dark:text-blue-400/30 blur-sm opacity-50" />
            </div>
            <div>
              <h2
                className="text-2xl font-bold text-gray-900 dark:text-white"
                id="location-name"
              >
                {data.location.name}, {data.location.country}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            <div className="relative" aria-hidden="true">
              <div className="animate-weather-bounce">
                <WeatherIcon icon={data.current.icon} size={120} />
              </div>
              {/* Glow effect behind icon */}
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-3xl scale-150 animate-pulse" />
            </div>

            <div className="text-center lg:text-left">
              <div
                className="text-6xl sm:text-8xl font-bold text-gray-900 dark:text-white mb-4 leading-none"
                aria-label={`Current temperature: ${convertTemperature(data.current.temperature, unit)} degrees ${unit}`}
              >
                {convertTemperature(data.current.temperature, unit)}°
              </div>
              <div
                className="text-xl sm:text-2xl font-semibold capitalize mb-2 text-orange-600 dark:text-orange-400"
                aria-label={`Weather condition: ${data.current.description}`}
              >
                {capitalizeWords(data.current.description)}
              </div>
              <div
                className="text-lg text-gray-600 dark:text-gray-400 font-medium"
                aria-label={`Feels like temperature: ${convertTemperature(data.current.feelsLike, unit)} degrees ${unit}`}
              >
                Feels like {convertTemperature(data.current.feelsLike, unit)}{getTemperatureUnit(unit)}
              </div>
              <div className="text-sm text-muted-foreground/80 mt-3">
                Updated {formatTime(data.lastUpdated)}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Weather Details */}
      <Card
        className="glass-card p-6 sm:p-8 weather-slide-up rounded-2xl sm:rounded-3xl"
        role="complementary"
        aria-labelledby="weather-details-heading"
      >
        <h3
          id="weather-details-heading"
          className="font-bold mb-6 text-xl text-gray-900 dark:text-white"
        >
          Weather Details
        </h3>
        <div className="space-y-4" role="list">
          <div
            className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50/80 dark:hover:bg-slate-800/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
            role="listitem"
            aria-label={`Feels like temperature: ${convertTemperature(data.current.feelsLike, unit)} degrees ${unit}`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30" aria-hidden="true">
                <Thermometer className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Feels like</span>
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">
              {convertTemperature(data.current.feelsLike, unit)}{getTemperatureUnit(unit)}
            </span>
          </div>

          <div
            className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50/80 dark:hover:bg-slate-800/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
            role="listitem"
            aria-label={`Humidity: ${data.current.humidity} percent`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30" aria-hidden="true">
                <Droplets className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Humidity</span>
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">{data.current.humidity}%</span>
          </div>

          <div
            className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50/80 dark:hover:bg-slate-800/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
            role="listitem"
            aria-label={`Wind speed: ${convertSpeed(data.current.windSpeed)} ${getSpeedUnit()}`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30" aria-hidden="true">
                <Wind className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Wind Speed</span>
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">
              {convertSpeed(data.current.windSpeed)} {getSpeedUnit()}
            </span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50/80 dark:hover:bg-slate-800/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Eye className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Visibility</span>
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">{data.current.visibility} km</span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50/80 dark:hover:bg-slate-800/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <Gauge className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Pressure</span>
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">{data.current.pressure} hPa</span>
          </div>
        </div>
      </Card>
    </div>
  );
});

CurrentWeatherCard.displayName = 'CurrentWeatherCard';