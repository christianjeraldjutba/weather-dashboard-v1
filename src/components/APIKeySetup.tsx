import { useState } from 'react';
import { Key, ExternalLink, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface APIKeySetupProps {
  onAPIKeySet: (apiKey: string) => void;
}

export const APIKeySetup = ({ onAPIKeySet }: APIKeySetupProps) => {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) return;
    
    setIsValidating(true);
    
    // Basic validation - just check if it looks like an API key
    if (apiKey.length > 10) {
      localStorage.setItem('openweather-api-key', apiKey);
      onAPIKeySet(apiKey);
    }
    
    setIsValidating(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="glass-card border-white/30 p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <Key className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">API Key Required</h2>
          <p className="text-muted-foreground">
            To use this weather dashboard, you need a free API key from OpenWeatherMap.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10">
            <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Get your free API key:</p>
              <ol className="list-decimal list-inside mt-2 space-y-1 text-muted-foreground">
                <li>Visit OpenWeatherMap.org</li>
                <li>Sign up for a free account</li>
                <li>Go to API Keys section</li>
                <li>Copy your API key</li>
              </ol>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="apiKey">OpenWeatherMap API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key..."
              className="glass border-white/30"
              required
            />
          </div>
          
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={!apiKey.trim() || isValidating}
              className="flex-1"
            >
              {isValidating ? 'Validating...' : 'Set API Key'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="glass border-white/30"
              onClick={() => window.open('https://openweathermap.org/api', '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </form>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          Your API key is stored locally and never sent to our servers.
        </p>
      </Card>
    </div>
  );
};