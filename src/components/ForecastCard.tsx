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
    <Card className="glass-card border-white/30 p-8 rounded-3xl">
      <h3 className="font-bold mb-8 text-2xl bg-premium-gradient bg-clip-text text-transparent">
        5-Day Forecast
      </h3>
      <div className="space-y-6">
        {forecast.map((day, index) => (
          <div 
            key={day.date}
            className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/10 transition-all duration-300 animate-forecast-slide group cursor-pointer border border-white/10 hover:border-white/20"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center gap-6 flex-1">
              <div className="w-20 text-sm font-bold text-primary">
                {formatDate(day.date)}
              </div>
              <div className="relative group-hover:scale-110 transition-transform duration-300">
                <WeatherIcon icon={day.day.icon} size={40} />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold capitalize mb-1">
                  {day.day.description}
                </p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Droplets className="h-4 w-4 text-blue-400" />
                    <span className="font-medium">{Math.round(day.day.precipitation)}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-lg font-bold bg-warm-gradient bg-clip-text text-transparent">
                {convertTemperature(day.day.maxTemp)}°
              </span>
              <span className="text-sm text-muted-foreground font-medium">
                {convertTemperature(day.day.minTemp)}°
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};