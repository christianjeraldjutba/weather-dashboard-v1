/**
 * Privacy-compliant analytics and user tracking
 */

/**
 * Analytics event interface
 */
export interface AnalyticsEvent {
  name: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  customParameters?: Record<string, any>;
  timestamp: number;
  sessionId: string;
  userId?: string;
}

/**
 * User session interface
 */
export interface UserSession {
  id: string;
  startTime: number;
  lastActivity: number;
  pageViews: number;
  events: number;
  userAgent: string;
  referrer: string;
  language: string;
  timezone: string;
  screenResolution: string;
  isReturning: boolean;
}

/**
 * Analytics configuration
 */
interface AnalyticsConfig {
  enabled: boolean;
  trackingId?: string;
  apiEndpoint?: string;
  batchSize: number;
  flushInterval: number;
  respectDoNotTrack: boolean;
  anonymizeIp: boolean;
  cookieConsent: boolean;
}

/**
 * Privacy-compliant analytics manager
 */
export class AnalyticsManager {
  private config: AnalyticsConfig;
  private session: UserSession;
  private eventQueue: AnalyticsEvent[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private consentGiven = false;

  constructor(config: Partial<AnalyticsConfig> = {}) {
    this.config = {
      enabled: true,
      batchSize: 10,
      flushInterval: 30000, // 30 seconds
      respectDoNotTrack: true,
      anonymizeIp: true,
      cookieConsent: false,
      ...config,
    };

    this.session = this.initializeSession();
    this.checkConsent();
    this.setupEventListeners();
  }

  /**
   * Initialize user session
   */
  private initializeSession(): UserSession {
    const sessionId = this.generateSessionId();
    const isReturning = localStorage.getItem('analytics-returning-user') === 'true';
    
    if (!isReturning) {
      localStorage.setItem('analytics-returning-user', 'true');
    }

    return {
      id: sessionId,
      startTime: Date.now(),
      lastActivity: Date.now(),
      pageViews: 0,
      events: 0,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screenResolution: `${screen.width}x${screen.height}`,
      isReturning,
    };
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Check user consent for tracking
   */
  private checkConsent(): void {
    // Check Do Not Track header
    if (this.config.respectDoNotTrack && navigator.doNotTrack === '1') {
      this.config.enabled = false;
      return;
    }

    // Check cookie consent (if required)
    if (this.config.cookieConsent) {
      const consent = localStorage.getItem('analytics-consent');
      this.consentGiven = consent === 'granted';
      this.config.enabled = this.config.enabled && this.consentGiven;
    } else {
      this.consentGiven = true;
    }
  }

  /**
   * Request user consent
   */
  async requestConsent(): Promise<boolean> {
    if (!this.config.cookieConsent) {
      this.consentGiven = true;
      return true;
    }

    // This would typically show a consent banner
    // For now, we'll assume consent is granted
    const consent = confirm('Allow analytics tracking to help improve the app?');
    
    localStorage.setItem('analytics-consent', consent ? 'granted' : 'denied');
    this.consentGiven = consent;
    this.config.enabled = this.config.enabled && consent;
    
    return consent;
  }

  /**
   * Track event
   */
  track(
    name: string,
    category: string,
    action: string,
    label?: string,
    value?: number,
    customParameters?: Record<string, any>
  ): void {
    if (!this.config.enabled || !this.consentGiven) return;

    const event: AnalyticsEvent = {
      name,
      category,
      action,
      label,
      value,
      customParameters,
      timestamp: Date.now(),
      sessionId: this.session.id,
    };

    this.eventQueue.push(event);
    this.session.events++;
    this.session.lastActivity = Date.now();

    // Flush if queue is full
    if (this.eventQueue.length >= this.config.batchSize) {
      this.flush();
    }
  }

  /**
   * Track page view
   */
  trackPageView(path: string, title?: string): void {
    this.session.pageViews++;
    this.track('page_view', 'navigation', 'view', path, undefined, {
      title: title || document.title,
      path,
      referrer: document.referrer,
    });
  }

  /**
   * Track user interaction
   */
  trackInteraction(element: string, action: string, details?: Record<string, any>): void {
    this.track('user_interaction', 'engagement', action, element, undefined, details);
  }

  /**
   * Track performance metrics
   */
  trackPerformance(metric: string, value: number, unit: string): void {
    this.track('performance', 'metrics', metric, unit, value);
  }

  /**
   * Track error
   */
  trackError(error: Error, context?: Record<string, any>): void {
    this.track('error', 'application', 'error', error.message, undefined, {
      stack: error.stack,
      context,
    });
  }

  /**
   * Track weather-specific events
   */
  trackWeatherEvent(action: string, location?: string, details?: Record<string, any>): void {
    this.track('weather', 'weather_data', action, location, undefined, details);
  }

  /**
   * Flush event queue
   */
  private async flush(): void {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      if (this.config.apiEndpoint) {
        await this.sendToCustomEndpoint(events);
      } else {
        await this.sendToConsole(events);
      }
    } catch (error) {
      console.error('Failed to send analytics events:', error);
      // Re-add events to queue for retry
      this.eventQueue.unshift(...events);
    }
  }

  /**
   * Send events to custom endpoint
   */
  private async sendToCustomEndpoint(events: AnalyticsEvent[]): Promise<void> {
    const payload = {
      session: this.session,
      events,
      timestamp: Date.now(),
    };

    await fetch(this.config.apiEndpoint!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  }

  /**
   * Send events to console (development)
   */
  private async sendToConsole(events: AnalyticsEvent[]): Promise<void> {
    console.group('📊 Analytics Events');
    console.log('Session:', this.session);
    console.table(events);
    console.groupEnd();
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Start flush timer
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval);

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.flush(); // Flush before page becomes hidden
      } else {
        this.session.lastActivity = Date.now();
      }
    });

    // Track page unload
    window.addEventListener('beforeunload', () => {
      this.flush();
    });

    // Track clicks on important elements
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.matches('button, a, [role="button"]')) {
        this.trackInteraction(
          target.tagName.toLowerCase(),
          'click',
          {
            text: target.textContent?.trim(),
            href: (target as HTMLAnchorElement).href,
          }
        );
      }
    });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      this.trackInteraction('form', 'submit', {
        action: form.action,
        method: form.method,
      });
    });
  }

  /**
   * Get session information
   */
  getSession(): UserSession {
    return { ...this.session };
  }

  /**
   * Get analytics summary
   */
  getSummary(): {
    session: UserSession;
    queueSize: number;
    enabled: boolean;
    consentGiven: boolean;
  } {
    return {
      session: this.getSession(),
      queueSize: this.eventQueue.length,
      enabled: this.config.enabled,
      consentGiven: this.consentGiven,
    };
  }

  /**
   * Disable analytics
   */
  disable(): void {
    this.config.enabled = false;
    this.eventQueue = [];
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }

  /**
   * Enable analytics
   */
  enable(): void {
    if (this.consentGiven) {
      this.config.enabled = true;
      this.setupEventListeners();
    }
  }
}

/**
 * Weather-specific analytics utilities
 */
export const weatherAnalytics = {
  /**
   * Track weather search
   */
  trackSearch: (query: string, resultsCount: number): void => {
    analytics.trackWeatherEvent('search', query, {
      resultsCount,
      queryLength: query.length,
    });
  },

  /**
   * Track location selection
   */
  trackLocationSelect: (location: string, method: 'search' | 'geolocation' | 'favorite'): void => {
    analytics.trackWeatherEvent('location_select', location, { method });
  },

  /**
   * Track weather data load
   */
  trackWeatherLoad: (location: string, loadTime: number, cached: boolean): void => {
    analytics.trackWeatherEvent('weather_load', location, {
      loadTime,
      cached,
      performance: loadTime < 1000 ? 'fast' : loadTime < 3000 ? 'medium' : 'slow',
    });
  },

  /**
   * Track feature usage
   */
  trackFeatureUse: (feature: string, details?: Record<string, any>): void => {
    analytics.trackWeatherEvent('feature_use', feature, details);
  },

  /**
   * Track error
   */
  trackError: (error: string, context?: Record<string, any>): void => {
    analytics.trackError(new Error(error), context);
  },
};

/**
 * Global analytics instance
 */
export const analytics = new AnalyticsManager({
  enabled: import.meta.env.PROD,
  apiEndpoint: import.meta.env.VITE_ANALYTICS_ENDPOINT,
  trackingId: import.meta.env.VITE_ANALYTICS_TRACKING_ID,
  cookieConsent: import.meta.env.VITE_REQUIRE_COOKIE_CONSENT === 'true',
});

/**
 * Initialize analytics
 */
export const initializeAnalytics = async (): Promise<void> => {
  // Request consent if required
  if (analytics.getSummary().enabled) {
    await analytics.requestConsent();
  }

  // Track initial page view
  analytics.trackPageView(window.location.pathname);
};
