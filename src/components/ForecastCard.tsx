import React from 'react';
import { ForecastDay, TemperatureUnit } from '@/types/weather';
import { WeatherIcon } from './WeatherIcon';
import { Card } from '@/components/ui/card';
import { convertTemperature, getTemperatureUnit, getDayName } from '@/utils/weather';
import { Droplets } from 'lucide-react';

interface ForecastCardProps {
  forecast: ForecastDay[];
  unit: TemperatureUnit;
}

export const ForecastCard = React.memo<ForecastCardProps>(({ forecast, unit }) => {
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
    <Card className="glass-card p-6 sm:p-10 rounded-2xl sm:rounded-3xl">
      <h3 className="font-bold mb-6 sm:mb-8 text-xl sm:text-2xl text-gray-900 dark:text-white">
        5-Day Forecast
      </h3>
      <div className="space-y-4 sm:space-y-6">
        {forecast.map((day, index) => (
          <div
            key={day.date}
            className="flex items-center justify-between p-5 rounded-xl hover:bg-gray-50/80 dark:hover:bg-slate-800/50 transition-all duration-300 animate-forecast-slide group cursor-pointer border border-gray-200/50 dark:border-slate-700/50 hover:border-gray-300 dark:hover:border-slate-600 hover:scale-[1.01] hover:shadow-lg"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center gap-4 sm:gap-6 flex-1">
              <div className="w-16 sm:w-20 text-sm font-bold text-blue-600 dark:text-blue-400">
                {formatDate(day.date)}
              </div>
              <div className="relative group-hover:scale-105 transition-transform duration-200">
                <WeatherIcon icon={day.day.icon} size={40} />
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold capitalize mb-1 text-gray-900 dark:text-white">
                  {day.day.description}
                </p>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Droplets className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                    <span className="font-medium">{Math.round(day.day.precipitation)}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                {convertTemperature(day.day.maxTemp, unit)}°
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {convertTemperature(day.day.minTemp, unit)}°
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
});

ForecastCard.displayName = 'ForecastCard';