import React from 'react';
import { WeatherData, TemperatureUnit } from '@/types/weather';
import { Card } from '@/components/ui/card';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Gauge, 
  Eye, 
  Sun,
  Compass
} from 'lucide-react';
import { convertTemperature } from '@/utils/weather';
import { cn } from '@/lib/utils';

interface WeatherMetricsProps {
  data: WeatherData;
  unit: TemperatureUnit;
}

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit?: string;
  color: string;
  description?: string;
}

const MetricCard = React.memo<MetricCardProps>(({ 
  icon, 
  label, 
  value, 
  unit, 
  color, 
  description 
}) => (
  <Card className={cn(
    "p-3 sm:p-4 glass-card rounded-xl",
    "hover:scale-[1.01] transition-all duration-200",
    "border border-slate-200/60 dark:border-slate-700/60",
    "group cursor-default"
  )}>
    <div className="flex items-start justify-between mb-2">
      <div className={cn(
        "p-1.5 rounded-lg transition-colors duration-200",
        color,
        "group-hover:scale-110"
      )}>
        {React.cloneElement(icon, { className: "h-4 w-4" })}
      </div>
      <div className="text-right">
        <div className="flex items-baseline gap-1">
          <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {value}
          </span>
          {unit && (
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              {unit}
            </span>
          )}
        </div>
      </div>
    </div>
    <div>
      <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-0.5">
        {label}
      </p>
      {description && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
    </div>
  </Card>
));

MetricCard.displayName = 'MetricCard';

export const WeatherMetrics = React.memo<WeatherMetricsProps>(({ data, unit }) => {
  const metrics = [
    {
      icon: <Thermometer className="h-5 w-5 text-orange-600 dark:text-orange-400" />,
      label: "Feels Like",
      value: convertTemperature(data.current.feelsLike, unit).toString(),
      unit: unit === 'celsius' ? '°C' : '°F',
      color: "bg-orange-100 dark:bg-orange-900/30",
      description: "Perceived temperature"
    },
    {
      icon: <Droplets className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      label: "Humidity",
      value: data.current.humidity.toString(),
      unit: "%",
      color: "bg-blue-100 dark:bg-blue-900/30",
      description: "Relative humidity"
    },
    {
      icon: <Wind className="h-5 w-5 text-green-600 dark:text-green-400" />,
      label: "Wind Speed",
      value: Math.round(data.current.windSpeed).toString(),
      unit: "km/h",
      color: "bg-green-100 dark:bg-green-900/30",
      description: `${data.current.windDirection}° direction`
    },
    {
      icon: <Gauge className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
      label: "Pressure",
      value: data.current.pressure.toString(),
      unit: "hPa",
      color: "bg-purple-100 dark:bg-purple-900/30",
      description: "Atmospheric pressure"
    },
    {
      icon: <Eye className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />,
      label: "Visibility",
      value: (data.current.visibility / 1000).toFixed(1),
      unit: "km",
      color: "bg-indigo-100 dark:bg-indigo-900/30",
      description: "Visibility distance"
    },
    {
      icon: <Sun className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />,
      label: "UV Index",
      value: data.current.uvIndex?.toString() || "N/A",
      color: "bg-yellow-100 dark:bg-yellow-900/30",
      description: "UV radiation level"
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-1">
          Weather Details
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Current conditions and measurements
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {metrics.map((metric, index) => (
          <MetricCard
            key={metric.label}
            {...metric}
          />
        ))}
      </div>
    </div>
  );
});

WeatherMetrics.displayName = 'WeatherMetrics';
