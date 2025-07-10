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
        className="lg:col-span-2 glass-card border-white/30 p-10 weather-fade-in rounded-3xl relative overflow-hidden"
        role="main"
        aria-label="Current weather information"
      >
        {/* Dynamic weather background */}
        <div className="absolute inset-0 opacity-20">
          <div className={`w-full h-full ${getWeatherGradient(data.current.condition)}`} />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative" aria-hidden="true">
              <MapPin className="h-6 w-6 text-primary drop-shadow-lg" />
              <div className="absolute inset-0 h-6 w-6 text-primary-glow blur-sm opacity-50" />
            </div>
            <div>
              <h2
                className="text-2xl font-bold bg-premium-gradient bg-clip-text text-transparent"
                id="location-name"
              >
                {data.location.name}, {data.location.country}
              </h2>
              <p className="text-sm text-muted-foreground font-medium">
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
                className="text-8xl font-bold bg-weather-gradient bg-clip-text text-transparent mb-4 leading-none"
                aria-label={`Current temperature: ${convertTemperature(data.current.temperature, unit)} degrees ${unit}`}
              >
                {convertTemperature(data.current.temperature, unit)}°
              </div>
              <div
                className="text-2xl font-semibold capitalize mb-2 bg-warm-gradient bg-clip-text text-transparent"
                aria-label={`Weather condition: ${data.current.description}`}
              >
                {capitalizeWords(data.current.description)}
              </div>
              <div
                className="text-lg text-muted-foreground font-medium"
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
        className="glass-card border-white/30 p-8 weather-slide-up rounded-3xl"
        role="complementary"
        aria-labelledby="weather-details-heading"
      >
        <h3
          id="weather-details-heading"
          className="font-bold mb-6 text-xl bg-premium-gradient bg-clip-text text-transparent"
        >
          Weather Details
        </h3>
        <div className="space-y-6" role="list">
          <div
            className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors"
            role="listitem"
            aria-label={`Feels like temperature: ${convertTemperature(data.current.feelsLike, unit)} degrees ${unit}`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10" aria-hidden="true">
                <Thermometer className="h-5 w-5 text-primary" />
              </div>
              <span className="font-medium">Feels like</span>
            </div>
            <span className="font-bold text-lg">
              {convertTemperature(data.current.feelsLike, unit)}{getTemperatureUnit(unit)}
            </span>
          </div>

          <div
            className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors"
            role="listitem"
            aria-label={`Humidity: ${data.current.humidity} percent`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10" aria-hidden="true">
                <Droplets className="h-5 w-5 text-blue-400" />
              </div>
              <span className="font-medium">Humidity</span>
            </div>
            <span className="font-bold text-lg">{data.current.humidity}%</span>
          </div>

          <div
            className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors"
            role="listitem"
            aria-label={`Wind speed: ${convertSpeed(data.current.windSpeed)} ${getSpeedUnit()}`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10" aria-hidden="true">
                <Wind className="h-5 w-5 text-green-400" />
              </div>
              <span className="font-medium">Wind Speed</span>
            </div>
            <span className="font-bold text-lg">
              {convertSpeed(data.current.windSpeed)} {getSpeedUnit()}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Eye className="h-5 w-5 text-purple-400" />
              </div>
              <span className="font-medium">Visibility</span>
            </div>
            <span className="font-bold text-lg">{data.current.visibility} km</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Gauge className="h-5 w-5 text-orange-400" />
              </div>
              <span className="font-medium">Pressure</span>
            </div>
            <span className="font-bold text-lg">{data.current.pressure} hPa</span>
          </div>
        </div>
      </Card>
    </div>
  );
});

CurrentWeatherCard.displayName = 'CurrentWeatherCard';