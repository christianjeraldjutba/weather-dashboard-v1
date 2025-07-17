/**
 * Performance monitoring and optimization utilities
 */

import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';

/**
 * Performance metrics interface
 */
export interface PerformanceMetrics {
  cls: number | null; // Cumulative Layout Shift
  inp: number | null; // Interaction to Next Paint (replaces FID)
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  ttfb: number | null; // Time to First Byte
  timestamp: number;
  userAgent: string;
  url: string;
}

/**
 * Performance thresholds (Google's recommended values)
 */
export const PERFORMANCE_THRESHOLDS = {
  CLS: { good: 0.1, needsImprovement: 0.25 },
  INP: { good: 200, needsImprovement: 500 }, // Interaction to Next Paint thresholds
  FCP: { good: 1800, needsImprovement: 3000 },
  LCP: { good: 2500, needsImprovement: 4000 },
  TTFB: { good: 800, needsImprovement: 1800 },
} as const;

/**
 * Performance monitoring class
 */
export class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];
  private onMetricCallback?: (metric: Metric) => void;

  constructor(onMetric?: (metric: Metric) => void) {
    this.onMetricCallback = onMetric;
    this.initializeWebVitals();
    this.initializeCustomMetrics();
  }

  /**
   * Initialize Web Vitals monitoring
   */
  private initializeWebVitals(): void {
    const handleMetric = (metric: Metric) => {
      // Map metric names to our interface
      const metricKey = metric.name.toLowerCase() as keyof PerformanceMetrics;
      this.metrics[metricKey] = metric.value;
      this.onMetricCallback?.(metric);

      // Log performance issues
      this.checkThresholds(metric);
    };

    onCLS(handleMetric);
    onINP(handleMetric);
    onFCP(handleMetric);
    onLCP(handleMetric);
    onTTFB(handleMetric);
  }

  /**
   * Initialize custom performance metrics
   */
  private initializeCustomMetrics(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    // Monitor long tasks
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) {
            console.warn(`Long task detected: ${entry.duration}ms`, entry);
          }
        });
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.push(longTaskObserver);
    } catch (e) {
      console.warn('Long task observer not supported');
    }

    // Monitor resource loading
    try {
      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const resourceEntry = entry as PerformanceResourceTiming;
          if (resourceEntry.duration > 1000 && !import.meta.env.DEV) {
            console.warn(`Slow resource: ${resourceEntry.name} (${resourceEntry.duration}ms)`);
          }
        });
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);
    } catch (e) {
      console.warn('Resource observer not supported');
    }
  }

  /**
   * Check if metrics meet performance thresholds
   */
  private checkThresholds(metric: Metric): void {
    const threshold = PERFORMANCE_THRESHOLDS[metric.name as keyof typeof PERFORMANCE_THRESHOLDS];
    if (!threshold) return;

    let status: 'good' | 'needs-improvement' | 'poor';
    if (metric.value <= threshold.good) {
      status = 'good';
    } else if (metric.value <= threshold.needsImprovement) {
      status = 'needs-improvement';
    } else {
      status = 'poor';
    }

    if (status !== 'good' && !import.meta.env.DEV) {
      console.warn(`Performance issue detected: ${metric.name} = ${metric.value} (${status})`);
    }
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): Partial<PerformanceMetrics> {
    return {
      ...this.metrics,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };
  }

  /**
   * Send metrics to analytics service
   */
  sendMetrics(endpoint?: string): void {
    const metrics = this.getMetrics();
    
    if (endpoint) {
      // Send to custom analytics endpoint
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metrics),
      }).catch(console.error);
    } else {
      // Log to console in development
      console.log('Performance Metrics:', metrics);
    }
  }

  /**
   * Cleanup observers
   */
  disconnect(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

/**
 * Memory usage monitoring
 */
export const getMemoryUsage = (): any => {
  if ('memory' in performance) {
    return (performance as any).memory;
  }
  return null;
};

/**
 * Network information
 */
export const getNetworkInfo = (): any => {
  if ('connection' in navigator) {
    return (navigator as any).connection;
  }
  return null;
};

/**
 * Performance timing utilities
 */
export const measurePerformance = {
  /**
   * Measure function execution time
   */
  measure: <T>(name: string, fn: () => T): T => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${name}: ${end - start}ms`);
    return result;
  },

  /**
   * Measure async function execution time
   */
  measureAsync: async <T>(name: string, fn: () => Promise<T>): Promise<T> => {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    console.log(`${name}: ${end - start}ms`);
    return result;
  },

  /**
   * Mark performance timeline
   */
  mark: (name: string): void => {
    performance.mark(name);
  },

  /**
   * Measure between two marks
   */
  measureBetween: (name: string, startMark: string, endMark: string): void => {
    performance.measure(name, startMark, endMark);
  },
};

/**
 * Global performance monitor instance
 */
export const performanceMonitor = new PerformanceMonitor((metric) => {
  // In production, send to analytics service
  if (import.meta.env.PROD) {
    // TODO: Integrate with analytics service
    console.log('Performance metric:', metric);
  }
});

/**
 * Initialize performance monitoring
 */
export const initializePerformanceMonitoring = (): void => {
  // Send metrics after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      performanceMonitor.sendMetrics();
    }, 5000); // Wait 5 seconds after load
  });

  // Send metrics before page unload
  window.addEventListener('beforeunload', () => {
    performanceMonitor.sendMetrics();
  });
};

/**
 * Resource loading optimization
 */
export const optimizeResourceLoading = {
  /**
   * Preload critical resources
   */
  preloadResource: (href: string, as: string): void => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  },

  /**
   * Prefetch resources for next navigation
   */
  prefetchResource: (href: string): void => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  },

  /**
   * Lazy load images
   */
  lazyLoadImage: (img: HTMLImageElement): void => {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const image = entry.target as HTMLImageElement;
            image.src = image.dataset.src || '';
            image.classList.remove('lazy');
            observer.unobserve(image);
          }
        });
      });
      observer.observe(img);
    } else {
      // Fallback for browsers without IntersectionObserver
      img.src = img.dataset.src || '';
    }
  },
};
