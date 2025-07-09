import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner = ({ message = 'Loading weather data...' }: LoadingSpinnerProps) => {
  return (
    <Card className="glass-card border-white/30 p-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </Card>
  );
};