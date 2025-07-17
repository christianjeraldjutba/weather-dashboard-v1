/**
 * Weather Charts and Visualizations Component
 */

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  Legend,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WeatherData, TemperatureUnit } from '@/types/weather';
import { convertTemperature } from '@/utils/weather';

interface WeatherChartsProps {
  data: WeatherData;
  unit: TemperatureUnit;
}

export const WeatherCharts: React.FC<WeatherChartsProps> = ({ data, unit }) => {
  // Prepare chart data
  const chartData = useMemo(() => {
    return data.forecast.map((day, index) => ({
      day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
      date: day.date,
      high: convertTemperature(day.high, 'celsius', unit),
      low: convertTemperature(day.low, 'celsius', unit),
      humidity: day.humidity,
      windSpeed: day.windSpeed,
      precipitation: day.precipitation || 0,
      index,
    }));
  }, [data.forecast, unit]);

  // Current weather data for radial charts
  const currentData = useMemo(() => ({
    temperature: convertTemperature(data.current.temperature, 'celsius', unit),
    humidity: data.current.humidity,
    pressure: data.current.pressure,
    windSpeed: data.current.windSpeed,
    uvIndex: data.current.uvIndex || 0,
    visibility: data.current.visibility,
  }), [data.current, unit]);

  // Color schemes
  const colors = {
    temperature: '#ef4444',
    temperatureLow: '#3b82f6',
    humidity: '#06b6d4',
    wind: '#10b981',
    precipitation: '#8b5cf6',
    pressure: '#f59e0b',
    uv: '#f97316',
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.dataKey === 'high' || entry.dataKey === 'low' ? `°${unit === 'celsius' ? 'C' : 'F'}` : ''}
              {entry.dataKey === 'humidity' ? '%' : ''}
              {entry.dataKey === 'windSpeed' ? ' km/h' : ''}
              {entry.dataKey === 'precipitation' ? ' mm' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Humidity distribution data
  const humidityData = useMemo(() => {
    const ranges = [
      { name: 'Very Dry', range: '0-30%', value: 0, color: '#ef4444' },
      { name: 'Dry', range: '30-50%', value: 0, color: '#f59e0b' },
      { name: 'Comfortable', range: '50-70%', value: 0, color: '#10b981' },
      { name: 'Humid', range: '70-85%', value: 0, color: '#06b6d4' },
      { name: 'Very Humid', range: '85-100%', value: 0, color: '#8b5cf6' },
    ];

    chartData.forEach(day => {
      if (day.humidity <= 30) ranges[0].value++;
      else if (day.humidity <= 50) ranges[1].value++;
      else if (day.humidity <= 70) ranges[2].value++;
      else if (day.humidity <= 85) ranges[3].value++;
      else ranges[4].value++;
    });

    return ranges.filter(range => range.value > 0);
  }, [chartData]);

  // UV Index gauge data
  const uvGaugeData = [
    {
      name: 'UV Index',
      value: currentData.uvIndex,
      fill: currentData.uvIndex <= 2 ? '#10b981' : 
            currentData.uvIndex <= 5 ? '#f59e0b' : 
            currentData.uvIndex <= 7 ? '#ef4444' : '#8b5cf6',
    },
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="temperature" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="temperature">Temperature</TabsTrigger>
          <TabsTrigger value="conditions">Conditions</TabsTrigger>
          <TabsTrigger value="current">Current</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="temperature" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>7-Day Temperature Trend</CardTitle>
              <CardDescription>
                High and low temperatures for the next 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="high"
                    stackId="1"
                    stroke={colors.temperature}
                    fill={colors.temperature}
                    fillOpacity={0.3}
                    name="High"
                  />
                  <Area
                    type="monotone"
                    dataKey="low"
                    stackId="2"
                    stroke={colors.temperatureLow}
                    fill={colors.temperatureLow}
                    fillOpacity={0.3}
                    name="Low"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Temperature Range</CardTitle>
              <CardDescription>
                Daily temperature highs and lows comparison
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="high"
                    stroke={colors.temperature}
                    strokeWidth={3}
                    dot={{ fill: colors.temperature, strokeWidth: 2, r: 4 }}
                    name="High"
                  />
                  <Line
                    type="monotone"
                    dataKey="low"
                    stroke={colors.temperatureLow}
                    strokeWidth={3}
                    dot={{ fill: colors.temperatureLow, strokeWidth: 2, r: 4 }}
                    name="Low"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conditions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Humidity Levels</CardTitle>
                <CardDescription>7-day humidity trend</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="humidity" fill={colors.humidity} name="Humidity" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Wind Speed</CardTitle>
                <CardDescription>Daily wind speed variations</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="windSpeed"
                      stroke={colors.wind}
                      fill={colors.wind}
                      fillOpacity={0.4}
                      name="Wind Speed"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Precipitation Forecast</CardTitle>
              <CardDescription>Expected rainfall for the next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="precipitation" fill={colors.precipitation} name="Precipitation" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="current" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>UV Index</CardTitle>
                <CardDescription>Current UV radiation level</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={uvGaugeData}>
                    <RadialBar dataKey="value" cornerRadius={10} fill={uvGaugeData[0].fill} />
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold">
                      {currentData.uvIndex}
                    </text>
                  </RadialBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Humidity Distribution</CardTitle>
                <CardDescription>Humidity levels over forecast period</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={humidityData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {humidityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Current Conditions Overview</CardTitle>
              <CardDescription>Real-time weather metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold" style={{ color: colors.temperature }}>
                    {currentData.temperature}°
                  </div>
                  <div className="text-sm text-muted-foreground">Temperature</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold" style={{ color: colors.humidity }}>
                    {currentData.humidity}%
                  </div>
                  <div className="text-sm text-muted-foreground">Humidity</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold" style={{ color: colors.wind }}>
                    {currentData.windSpeed}
                  </div>
                  <div className="text-sm text-muted-foreground">Wind (km/h)</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold" style={{ color: colors.pressure }}>
                    {currentData.pressure}
                  </div>
                  <div className="text-sm text-muted-foreground">Pressure (hPa)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weather Pattern Analysis</CardTitle>
              <CardDescription>Insights and trends from the forecast data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Temperature Trend</h4>
                    <p className="text-sm text-muted-foreground">
                      {chartData[0].high > chartData[chartData.length - 1].high 
                        ? 'Temperatures are expected to decrease over the forecast period.'
                        : 'Temperatures are expected to increase over the forecast period.'}
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Humidity Pattern</h4>
                    <p className="text-sm text-muted-foreground">
                      Average humidity: {Math.round(chartData.reduce((sum, day) => sum + day.humidity, 0) / chartData.length)}%
                    </p>
                  </div>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Precipitation Outlook</h4>
                  <p className="text-sm text-muted-foreground">
                    Total expected precipitation: {chartData.reduce((sum, day) => sum + day.precipitation, 0).toFixed(1)} mm
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WeatherCharts;
