/**
 * Weather alerts and notification system
 */

/**
 * Notification permission status
 */
export type NotificationPermission = 'granted' | 'denied' | 'default';

/**
 * Weather alert types
 */
export enum WeatherAlertType {
  SEVERE_WEATHER = 'severe-weather',
  TEMPERATURE_EXTREME = 'temperature-extreme',
  PRECIPITATION = 'precipitation',
  WIND = 'wind',
  VISIBILITY = 'visibility',
  AIR_QUALITY = 'air-quality',
}

/**
 * Alert severity levels
 */
export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  SEVERE = 'severe',
  CRITICAL = 'critical',
}

/**
 * Weather alert interface
 */
export interface WeatherAlert {
  id: string;
  type: WeatherAlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  location: string;
  timestamp: number;
  expiresAt?: number;
  actionUrl?: string;
  dismissed?: boolean;
}

/**
 * Notification manager class
 */
export class NotificationManager {
  private permission: NotificationPermission = 'default';
  private alerts: Map<string, WeatherAlert> = new Map();
  private subscribers: Set<(alerts: WeatherAlert[]) => void> = new Set();

  constructor() {
    this.checkPermission();
    this.setupVisibilityHandler();
  }

  /**
   * Check current notification permission
   */
  private checkPermission(): void {
    if ('Notification' in window) {
      this.permission = Notification.permission as NotificationPermission;
    }
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return 'denied';
    }

    if (this.permission === 'granted') {
      return 'granted';
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission as NotificationPermission;
      return this.permission;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return 'denied';
    }
  }

  /**
   * Show browser notification
   */
  private showBrowserNotification(alert: WeatherAlert): void {
    if (this.permission !== 'granted') return;

    const notification = new Notification(alert.title, {
      body: alert.message,
      icon: '/logo/cloudy.png',
      badge: '/logo/cloudy.png',
      tag: alert.id,
      requireInteraction: alert.severity === AlertSeverity.CRITICAL,
      silent: false,
      timestamp: alert.timestamp,
      data: {
        alertId: alert.id,
        actionUrl: alert.actionUrl,
      },
    });

    notification.onclick = () => {
      window.focus();
      if (alert.actionUrl) {
        window.location.href = alert.actionUrl;
      }
      notification.close();
    };

    // Auto-close after 10 seconds for non-critical alerts
    if (alert.severity !== AlertSeverity.CRITICAL) {
      setTimeout(() => {
        notification.close();
      }, 10000);
    }
  }

  /**
   * Add weather alert
   */
  addAlert(alert: WeatherAlert): void {
    this.alerts.set(alert.id, alert);
    
    // Show browser notification
    this.showBrowserNotification(alert);
    
    // Notify subscribers
    this.notifySubscribers();
  }

  /**
   * Remove weather alert
   */
  removeAlert(alertId: string): void {
    this.alerts.delete(alertId);
    this.notifySubscribers();
  }

  /**
   * Dismiss alert
   */
  dismissAlert(alertId: string): void {
    const alert = this.alerts.get(alertId);
    if (alert) {
      alert.dismissed = true;
      this.alerts.set(alertId, alert);
      this.notifySubscribers();
    }
  }

  /**
   * Get all active alerts
   */
  getAlerts(): WeatherAlert[] {
    const now = Date.now();
    return Array.from(this.alerts.values())
      .filter(alert => !alert.expiresAt || alert.expiresAt > now)
      .sort((a, b) => {
        // Sort by severity, then by timestamp
        const severityOrder = {
          [AlertSeverity.CRITICAL]: 4,
          [AlertSeverity.SEVERE]: 3,
          [AlertSeverity.WARNING]: 2,
          [AlertSeverity.INFO]: 1,
        };
        
        const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
        if (severityDiff !== 0) return severityDiff;
        
        return b.timestamp - a.timestamp;
      });
  }

  /**
   * Get active alerts count
   */
  getActiveAlertsCount(): number {
    return this.getAlerts().filter(alert => !alert.dismissed).length;
  }

  /**
   * Subscribe to alert updates
   */
  subscribe(callback: (alerts: WeatherAlert[]) => void): () => void {
    this.subscribers.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Notify all subscribers
   */
  private notifySubscribers(): void {
    const alerts = this.getAlerts();
    this.subscribers.forEach(callback => callback(alerts));
  }

  /**
   * Clean up expired alerts
   */
  private cleanup(): void {
    const now = Date.now();
    const expiredAlerts: string[] = [];
    
    this.alerts.forEach((alert, id) => {
      if (alert.expiresAt && alert.expiresAt <= now) {
        expiredAlerts.push(id);
      }
    });
    
    expiredAlerts.forEach(id => this.alerts.delete(id));
    
    if (expiredAlerts.length > 0) {
      this.notifySubscribers();
    }
  }

  /**
   * Setup visibility change handler
   */
  private setupVisibilityHandler(): void {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        // Clean up when page becomes visible
        this.cleanup();
      }
    });

    // Periodic cleanup
    setInterval(() => {
      this.cleanup();
    }, 60000); // Every minute
  }
}

/**
 * Weather alert analyzer
 */
export class WeatherAlertAnalyzer {
  /**
   * Analyze weather data for potential alerts
   */
  static analyzeWeatherData(weatherData: any): WeatherAlert[] {
    const alerts: WeatherAlert[] = [];
    const now = Date.now();

    // Temperature extremes
    if (weatherData.current.temperature > 35) {
      alerts.push({
        id: `temp-high-${now}`,
        type: WeatherAlertType.TEMPERATURE_EXTREME,
        severity: AlertSeverity.WARNING,
        title: 'High Temperature Alert',
        message: `Temperature is ${weatherData.current.temperature}°C. Stay hydrated and avoid prolonged sun exposure.`,
        location: weatherData.location.name,
        timestamp: now,
        expiresAt: now + (4 * 60 * 60 * 1000), // 4 hours
      });
    }

    if (weatherData.current.temperature < -10) {
      alerts.push({
        id: `temp-low-${now}`,
        type: WeatherAlertType.TEMPERATURE_EXTREME,
        severity: AlertSeverity.WARNING,
        title: 'Low Temperature Alert',
        message: `Temperature is ${weatherData.current.temperature}°C. Dress warmly and be cautious of icy conditions.`,
        location: weatherData.location.name,
        timestamp: now,
        expiresAt: now + (4 * 60 * 60 * 1000), // 4 hours
      });
    }

    // High wind speeds
    if (weatherData.current.windSpeed > 50) {
      alerts.push({
        id: `wind-high-${now}`,
        type: WeatherAlertType.WIND,
        severity: weatherData.current.windSpeed > 80 ? AlertSeverity.SEVERE : AlertSeverity.WARNING,
        title: 'High Wind Alert',
        message: `Wind speed is ${weatherData.current.windSpeed} km/h. Avoid outdoor activities and secure loose objects.`,
        location: weatherData.location.name,
        timestamp: now,
        expiresAt: now + (2 * 60 * 60 * 1000), // 2 hours
      });
    }

    // Low visibility
    if (weatherData.current.visibility < 1) {
      alerts.push({
        id: `visibility-low-${now}`,
        type: WeatherAlertType.VISIBILITY,
        severity: AlertSeverity.WARNING,
        title: 'Low Visibility Alert',
        message: `Visibility is ${weatherData.current.visibility} km. Drive carefully and use headlights.`,
        location: weatherData.location.name,
        timestamp: now,
        expiresAt: now + (2 * 60 * 60 * 1000), // 2 hours
      });
    }

    // Severe weather conditions
    const severeConditions = ['thunderstorm', 'tornado', 'hurricane', 'blizzard'];
    const description = weatherData.current.description.toLowerCase();
    
    if (severeConditions.some(condition => description.includes(condition))) {
      alerts.push({
        id: `severe-weather-${now}`,
        type: WeatherAlertType.SEVERE_WEATHER,
        severity: AlertSeverity.SEVERE,
        title: 'Severe Weather Alert',
        message: `${weatherData.current.description} conditions detected. Seek shelter immediately.`,
        location: weatherData.location.name,
        timestamp: now,
        expiresAt: now + (6 * 60 * 60 * 1000), // 6 hours
      });
    }

    return alerts;
  }
}

/**
 * Global notification manager instance
 */
export const notificationManager = new NotificationManager();

/**
 * Initialize notification system
 */
export const initializeNotifications = async (): Promise<void> => {
  // Request permission on first visit
  const hasRequestedBefore = localStorage.getItem('notification-permission-requested');
  
  if (!hasRequestedBefore) {
    const permission = await notificationManager.requestPermission();
    localStorage.setItem('notification-permission-requested', 'true');
    
    if (permission === 'granted') {
      // Show welcome notification
      notificationManager.addAlert({
        id: 'welcome',
        type: WeatherAlertType.SEVERE_WEATHER,
        severity: AlertSeverity.INFO,
        title: 'WeatherDash Pro Notifications Enabled',
        message: 'You will now receive weather alerts and updates.',
        location: 'System',
        timestamp: Date.now(),
        expiresAt: Date.now() + (10 * 1000), // 10 seconds
      });
    }
  }
};
