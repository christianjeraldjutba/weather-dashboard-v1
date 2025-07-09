import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  CloudDrizzle,
  Moon,
  Cloudy
} from 'lucide-react';

interface WeatherIconProps {
  icon: string;
  className?: string;
  size?: number;
}

export const WeatherIcon = ({ icon, className = '', size = 24 }: WeatherIconProps) => {
  const getIconComponent = (iconCode: string) => {
    // OpenWeatherMap icon codes
    switch (iconCode) {
      case '01d': // clear sky day
        return <Sun className={`text-weather-sunny ${className}`} size={size} />;
      case '01n': // clear sky night
        return <Moon className={`text-primary ${className}`} size={size} />;
      case '02d':
      case '02n': // few clouds
        return <Cloud className={`text-weather-cloudy ${className}`} size={size} />;
      case '03d':
      case '03n':
      case '04d':
      case '04n': // scattered/broken clouds
        return <Cloudy className={`text-weather-cloudy ${className}`} size={size} />;
      case '09d':
      case '09n': // shower rain
        return <CloudDrizzle className={`text-weather-rainy ${className}`} size={size} />;
      case '10d':
      case '10n': // rain
        return <CloudRain className={`text-weather-rainy ${className}`} size={size} />;
      case '11d':
      case '11n': // thunderstorm
        return <CloudLightning className={`text-weather-stormy ${className}`} size={size} />;
      case '13d':
      case '13n': // snow
        return <CloudSnow className={`text-weather-snowy ${className}`} size={size} />;
      case '50d':
      case '50n': // mist
        return <Cloud className={`text-weather-cloudy ${className}`} size={size} />;
      default:
        return <Sun className={`text-weather-sunny ${className}`} size={size} />;
    }
  };

  return getIconComponent(icon);
};