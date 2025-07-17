import React from 'react';
import { ForecastDay, TemperatureUnit } from '@/types/weather';
import { WeatherIcon } from './WeatherIcon';
import { convertTemperature } from '@/utils/weather';
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
    <div className="space-y-4">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-1">
          5-Day Forecast
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Extended weather outlook
        </p>
      </div>
      <div className="space-y-2">
        {forecast.map((day) => (
          <div
            key={day.date}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-all duration-300 group cursor-pointer border border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 hover:scale-[1.005] hover:shadow-sm"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 text-xs font-semibold text-slate-700 dark:text-slate-300">
                {formatDate(day.date)}
              </div>
              <div className="relative group-hover:scale-105 transition-transform duration-200">
                <WeatherIcon icon={day.day.icon} size={24} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium capitalize text-slate-900 dark:text-white">
                  {day.day.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  <div className="flex items-center gap-1">
                    <Droplets className="h-2.5 w-2.5 text-blue-500 dark:text-blue-400" />
                    <span>{Math.round(day.day.precipitation)}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {convertTemperature(day.day.maxTemp, unit)}°
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {convertTemperature(day.day.minTemp, unit)}°
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

ForecastCard.displayName = 'ForecastCard';