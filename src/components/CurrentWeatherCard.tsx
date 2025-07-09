import { WeatherData, TemperatureUnit } from '@/types/weather';
import { WeatherIcon } from './WeatherIcon';
import { MapPin, Thermometer, Droplets, Wind, Eye, Gauge } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface CurrentWeatherCardProps {
  data: WeatherData;
  unit: TemperatureUnit;
}

export const CurrentWeatherCard = ({ data, unit }: CurrentWeatherCardProps) => {
  const convertTemperature = (temp: number) => {
    if (unit === 'fahrenheit') {
      return Math.round((temp * 9/5) + 32);
    }
    return temp;
  };

  const getTemperatureUnit = () => unit === 'fahrenheit' ? '°F' : '°C';
  
  const getSpeedUnit = () => unit === 'fahrenheit' ? 'mph' : 'km/h';
  
  const convertSpeed = (speed: number) => {
    if (unit === 'fahrenheit') {
      return Math.round(speed * 0.621371); // Convert km/h to mph
    }
    return speed;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Weather Card */}
      <Card className="lg:col-span-2 glass-card border-white/30 p-8 weather-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="h-5 w-5 text-primary" />
          <div>
            <h2 className="text-xl font-semibold">
              {data.location.name}, {data.location.country}
            </h2>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="animate-weather-bounce">
              <WeatherIcon icon={data.current.icon} size={80} />
            </div>
            <div>
              <div className="text-6xl font-bold text-primary">
                {convertTemperature(data.current.temperature)}{getTemperatureUnit()}
              </div>
              <p className="text-lg text-muted-foreground capitalize">
                {data.current.description}
              </p>
              <p className="text-sm text-muted-foreground">
                Feels like {convertTemperature(data.current.feelsLike)}{getTemperatureUnit()}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Weather Details */}
      <Card className="glass-card border-white/30 p-6 weather-slide-up">
        <h3 className="font-semibold mb-4 text-lg">Weather Details</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Feels like</span>
            </div>
            <span className="font-medium">
              {convertTemperature(data.current.feelsLike)}{getTemperatureUnit()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Humidity</span>
            </div>
            <span className="font-medium">{data.current.humidity}%</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Wind Speed</span>
            </div>
            <span className="font-medium">
              {convertSpeed(data.current.windSpeed)} {getSpeedUnit()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Visibility</span>
            </div>
            <span className="font-medium">{data.current.visibility} km</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Pressure</span>
            </div>
            <span className="font-medium">{data.current.pressure} hPa</span>
          </div>
        </div>
      </Card>
    </div>
  );
};