import { ForecastDay, TemperatureUnit } from '@/types/weather';
import { WeatherIcon } from './WeatherIcon';
import { Card } from '@/components/ui/card';
import { Droplets } from 'lucide-react';

interface ForecastCardProps {
  forecast: ForecastDay[];
  unit: TemperatureUnit;
}

export const ForecastCard = ({ forecast, unit }: ForecastCardProps) => {
  const convertTemperature = (temp: number) => {
    if (unit === 'fahrenheit') {
      return Math.round((temp * 9/5) + 32);
    }
    return temp;
  };

  const getTemperatureUnit = () => unit === 'fahrenheit' ? '°F' : '°C';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };

  return (
    <Card className="glass-card border-white/30 p-6">
      <h3 className="font-semibold mb-6 text-lg">5-Day Forecast</h3>
      <div className="space-y-4">
        {forecast.map((day, index) => (
          <div 
            key={day.date}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors animate-forecast-slide"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="w-16 text-sm font-medium">
                {formatDate(day.date)}
              </div>
              <WeatherIcon icon={day.day.icon} size={32} />
              <div className="flex-1">
                <p className="text-sm font-medium capitalize">
                  {day.day.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Droplets className="h-3 w-3" />
                  <span>{Math.round(day.day.precipitation)}%</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-right">
              <span className="text-sm font-medium">
                {convertTemperature(day.day.maxTemp)}{getTemperatureUnit()}
              </span>
              <span className="text-sm text-muted-foreground">
                {convertTemperature(day.day.minTemp)}{getTemperatureUnit()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};