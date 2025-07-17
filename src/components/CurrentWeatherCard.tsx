import React from 'react';
import { WeatherData, TemperatureUnit } from '@/types/weather';
import { WeatherIcon } from './WeatherIcon';
import { convertTemperature, getTemperatureUnit } from '@/utils/weather';

interface CurrentWeatherCardProps {
  data: WeatherData;
  unit: TemperatureUnit;
}

/**
 * Simplified current weather card for split-screen left panel
 * Displays essential weather information with large typography and minimal design
 */
export const CurrentWeatherCard = React.memo<CurrentWeatherCardProps>(({ data, unit }) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="flex flex-col items-center justify-center text-center w-full overflow-hidden">
      {/* Location */}
      <div className="space-y-1 mb-4 lg:mb-6 w-full">
        <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-light text-slate-900 dark:text-white tracking-wide truncate px-2">
          {data.location.name}
        </h1>
        <p className="text-xs sm:text-sm lg:text-base text-slate-600 dark:text-slate-400 font-medium">
          {data.location.country}
        </p>
      </div>

      {/* Weather Icon */}
      <div className="relative group mb-4 lg:mb-6">
        <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <WeatherIcon
          icon={data.current.icon}
          size={60}
          className="relative z-10 drop-shadow-lg sm:w-16 sm:h-16 lg:w-20 lg:h-20"
        />
      </div>

      {/* Temperature */}
      <div className="space-y-1 mb-3 lg:mb-4">
        <div className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extralight text-slate-900 dark:text-white tracking-tighter">
          {convertTemperature(data.current.temperature, unit)}°
        </div>
        <p className="text-sm sm:text-base lg:text-lg text-slate-700 dark:text-slate-300 font-medium capitalize px-2 truncate">
          {data.current.description}
        </p>
      </div>

      {/* Feels Like */}
      <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-2 lg:mb-3">
        Feels like {convertTemperature(data.current.feelsLike, unit)}°{getTemperatureUnit(unit)}
      </div>

      {/* Last Updated */}
      <div className="text-xs text-slate-500 dark:text-slate-500 opacity-75">
        Updated {formatTime(data.lastUpdated)}
      </div>
    </div>
  );
});

CurrentWeatherCard.displayName = 'CurrentWeatherCard';
