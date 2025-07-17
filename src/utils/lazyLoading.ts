/**
 * Lazy loading utilities for code splitting and performance optimization
 */

import { lazy, ComponentType, LazyExoticComponent } from 'react';

/**
 * Enhanced lazy loading with retry mechanism
 */
export const lazyWithRetry = <T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  maxRetries: number = 3,
  retryDelay: number = 1000
): LazyExoticComponent<T> => {
  return lazy(() => {
    return new Promise<{ default: T }>((resolve, reject) => {
      let retries = 0;

      const attemptImport = async () => {
        try {
          const module = await importFunc();
          resolve(module);
        } catch (error) {
          if (retries < maxRetries) {
            retries++;
            console.warn(`Import failed, retrying (${retries}/${maxRetries})...`, error);
            setTimeout(attemptImport, retryDelay * retries);
          } else {
            console.error('Import failed after maximum retries:', error);
            reject(error);
          }
        }
      };

      attemptImport();
    });
  });
};

/**
 * Preload component for better UX
 */
export const preloadComponent = (importFunc: () => Promise<any>): Promise<any> => {
  return importFunc();
};

/**
 * Lazy loading with preloading on hover
 */
export const lazyWithPreload = <T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) => {
  let componentImport: Promise<{ default: T }> | null = null;

  const LazyComponent = lazy(() => {
    if (!componentImport) {
      componentImport = importFunc();
    }
    return componentImport;
  });

  const preload = () => {
    if (!componentImport) {
      componentImport = importFunc();
    }
    return componentImport;
  };

  return { Component: LazyComponent, preload };
};

/**
 * Route-based lazy loading components
 */
export const LazyComponents = {
  // Main dashboard (already loaded)
  Dashboard: lazyWithRetry(() => import('@/components/WeatherDashboard')),

  // Weather charts
  WeatherCharts: lazyWithRetry(() => import('@/components/WeatherCharts')),

  // Placeholder for future components
  PlaceholderComponent: lazyWithRetry(() => import('@/components/PlaceholderComponent')),
};

/**
 * Component-based lazy loading for heavy components
 */
export const LazyFeatures = {
  // Weather charts (available)
  WeatherCharts: lazyWithPreload(() => import('@/components/WeatherCharts')),

  // Placeholder for future features
  PlaceholderComponent: lazyWithPreload(() => import('@/components/PlaceholderComponent')),
};

/**
 * Intersection Observer for lazy loading components when they come into view
 */
export class LazyComponentLoader {
  private observer: IntersectionObserver | null = null;
  private loadedComponents = new Set<string>();

  constructor() {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const componentId = entry.target.getAttribute('data-lazy-component');
              if (componentId && !this.loadedComponents.has(componentId)) {
                this.loadComponent(componentId);
                this.loadedComponents.add(componentId);
                this.observer?.unobserve(entry.target);
              }
            }
          });
        },
        {
          rootMargin: '50px', // Start loading 50px before component comes into view
          threshold: 0.1,
        }
      );
    }
  }

  /**
   * Observe element for lazy loading
   */
  observe(element: Element, componentId: string): void {
    if (this.observer) {
      element.setAttribute('data-lazy-component', componentId);
      this.observer.observe(element);
    }
  }

  /**
   * Load component by ID
   */
  private loadComponent(componentId: string): void {
    switch (componentId) {
      case 'weather-charts':
        LazyFeatures.WeatherCharts.preload();
        break;
      case 'placeholder':
        LazyFeatures.PlaceholderComponent.preload();
        break;
      default:
        console.warn(`Unknown component ID: ${componentId}`);
    }
  }

  /**
   * Disconnect observer
   */
  disconnect(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

/**
 * Global lazy component loader instance
 */
export const lazyComponentLoader = new LazyComponentLoader();

/**
 * Preload critical components on app initialization
 */
export const preloadCriticalComponents = async (): Promise<void> => {
  try {
    // Preload components that are likely to be used soon
    await Promise.all([
      // Preload weather charts component
      preloadComponent(() => import('@/components/WeatherCharts')),
      // Preload placeholder component
      preloadComponent(() => import('@/components/PlaceholderComponent')),
    ]);
  } catch (error) {
    console.warn('Failed to preload some components:', error);
  }
};

/**
 * Bundle splitting utilities
 */
export const bundleUtils = {
  /**
   * Dynamically import vendor libraries
   */
  loadChartLibrary: () => import('recharts'),
  loadDateLibrary: () => import('date-fns'),
  loadAnimationLibrary: () => import('framer-motion'),

  /**
   * Load utility libraries on demand
   */
  loadExportLibrary: () => import('file-saver'),
  loadCompressionLibrary: () => import('pako'),
};

/**
 * Resource hints for better loading performance
 */
export const addResourceHints = (): void => {
  if (typeof document === 'undefined') return;

  // Preconnect to external domains
  const preconnectDomains = [
    'https://api.openweathermap.org',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ];

  preconnectDomains.forEach((domain) => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });

  // DNS prefetch for other domains
  const dnsPrefetchDomains = [
    'https://openweathermap.org',
  ];

  dnsPrefetchDomains.forEach((domain) => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });
};

/**
 * Initialize lazy loading optimizations
 */
export const initializeLazyLoading = (): void => {
  // Add resource hints
  addResourceHints();
  
  // Preload critical components after a short delay
  setTimeout(() => {
    preloadCriticalComponents();
  }, 2000);
};
