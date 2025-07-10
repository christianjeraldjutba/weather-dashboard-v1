/**
 * Skeleton loading components for better UX
 */

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Weather card skeleton loader
 */
export const WeatherCardSkeleton = React.memo(() => (
  <Card className="w-full">
    <CardHeader className="space-y-2">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-4 w-48" />
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex items-center justify-center space-x-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-12 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </CardContent>
  </Card>
));

WeatherCardSkeleton.displayName = 'WeatherCardSkeleton';

/**
 * Forecast card skeleton loader
 */
export const ForecastCardSkeleton = React.memo(() => (
  <Card className="w-full">
    <CardHeader>
      <Skeleton className="h-6 w-32" />
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="space-y-3 text-center">
            <Skeleton className="h-4 w-16 mx-auto" />
            <Skeleton className="h-12 w-12 rounded-full mx-auto" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-12 mx-auto" />
              <Skeleton className="h-3 w-16 mx-auto" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-3 w-14 mx-auto" />
              <Skeleton className="h-3 w-12 mx-auto" />
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
));

ForecastCardSkeleton.displayName = 'ForecastCardSkeleton';

/**
 * Header search skeleton loader
 */
export const SearchSkeleton = React.memo(() => (
  <div className="space-y-2">
    <Skeleton className="h-10 w-full" />
    <div className="space-y-1">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="h-8 w-full" />
      ))}
    </div>
  </div>
));

SearchSkeleton.displayName = 'SearchSkeleton';

/**
 * Weather details skeleton loader
 */
export const WeatherDetailsSkeleton = React.memo(() => (
  <Card className="w-full">
    <CardHeader>
      <Skeleton className="h-6 w-32" />
    </CardHeader>
    <CardContent className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </CardContent>
  </Card>
));

WeatherDetailsSkeleton.displayName = 'WeatherDetailsSkeleton';

/**
 * Full dashboard skeleton loader
 */
export const DashboardSkeleton = React.memo(() => (
  <div className="min-h-screen p-4">
    <div className="max-w-7xl mx-auto">
      {/* Header skeleton */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
        <SearchSkeleton />
      </div>

      {/* Main content skeleton */}
      <main className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <WeatherCardSkeleton />
          </div>
          <div>
            <WeatherDetailsSkeleton />
          </div>
        </div>
        <ForecastCardSkeleton />
      </main>
    </div>
  </div>
));

DashboardSkeleton.displayName = 'DashboardSkeleton';
