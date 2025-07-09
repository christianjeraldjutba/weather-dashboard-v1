import { WeatherDashboard } from '@/components/WeatherDashboard';
import weatherBg from '@/assets/weather-bg.jpg';

const Index = () => {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${weatherBg})` }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
      
      {/* Content */}
      <div className="relative z-10">
        <WeatherDashboard />
      </div>
    </div>
  );
};

export default Index;
