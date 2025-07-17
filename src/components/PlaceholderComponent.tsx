/**
 * Placeholder component for lazy loading fallbacks
 */

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface PlaceholderComponentProps {
  title?: string;
  message?: string;
  type?: 'loading' | 'error' | 'coming-soon';
}

export const PlaceholderComponent = ({ 
  title = 'Feature Not Available', 
  message = 'This feature is coming soon!',
  type = 'coming-soon'
}: PlaceholderComponentProps) => {
  const getIcon = () => {
    switch (type) {
      case 'loading':
        return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />;
      case 'error':
        return <AlertCircle className="h-8 w-8 text-destructive" />;
      case 'coming-soon':
      default:
        return <AlertCircle className="h-8 w-8 text-muted-foreground" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'loading':
        return 'Loading...';
      case 'error':
        return 'Error Loading Component';
      case 'coming-soon':
      default:
        return title;
    }
  };

  const getMessage = () => {
    switch (type) {
      case 'loading':
        return 'Please wait while we load this component.';
      case 'error':
        return 'Failed to load this component. Please try refreshing the page.';
      case 'coming-soon':
      default:
        return message;
    }
  };

  return (
    <Card className="glass-card border-white/30">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          {getIcon()}
        </div>
        <h3 className="text-lg font-semibold">{getTitle()}</h3>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-muted-foreground">{getMessage()}</p>
      </CardContent>
    </Card>
  );
};

export default PlaceholderComponent;
