import React from 'react';
import { X, Sun, Moon, Thermometer, Palette, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TemperatureUnit } from '@/types/weather';
import { cn } from '@/lib/utils';

interface SettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  unit: TemperatureUnit;
  onUnitChange: (unit: TemperatureUnit) => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

export const SettingsSidebar = React.memo<SettingsSidebarProps>(({
  isOpen,
  onClose,
  unit,
  onUnitChange,
  isDarkMode,
  onThemeToggle
}) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9998] bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 z-[9999] h-full w-80",
          "bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl",
          "border-r border-slate-200/50 dark:border-slate-700/50",
          "shadow-2xl",
          "transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "flex flex-col"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Palette className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Settings
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Customize your experience
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Theme Settings */}
          <Card className="p-5 glass-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                {isDarkMode ? (
                  <Moon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                ) : (
                  <Sun className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Appearance
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Choose your preferred theme
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={!isDarkMode ? "default" : "outline"}
                onClick={() => !isDarkMode || onThemeToggle()}
                className="justify-start gap-2 h-12"
              >
                <Sun className="h-4 w-4" />
                Light
              </Button>
              <Button
                variant={isDarkMode ? "default" : "outline"}
                onClick={() => isDarkMode || onThemeToggle()}
                className="justify-start gap-2 h-12"
              >
                <Moon className="h-4 w-4" />
                Dark
              </Button>
            </div>
          </Card>

          {/* Temperature Unit */}
          <Card className="p-5 glass-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Thermometer className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Temperature Unit
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Display temperature in
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={unit === 'celsius' ? "default" : "outline"}
                onClick={() => onUnitChange('celsius')}
                className="justify-center h-12"
              >
                °C
              </Button>
              <Button
                variant={unit === 'fahrenheit' ? "default" : "outline"}
                onClick={() => onUnitChange('fahrenheit')}
                className="justify-center h-12"
              >
                °F
              </Button>
            </div>
          </Card>

          {/* About */}
          <Card className="p-5 glass-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Info className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  About WeatherDash
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Professional weather dashboard
                </p>
              </div>
            </div>
            
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center justify-between">
                <span>Data Source</span>
                <span className="font-medium">OpenWeatherMap</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Update Frequency</span>
                <span className="font-medium">10 minutes</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Version</span>
                <span className="font-medium">2.0.0</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
            © {new Date().getFullYear()} WeatherDash • Portfolio Project
          </p>
        </div>
      </div>
    </>
  );
});

SettingsSidebar.displayName = 'SettingsSidebar';
