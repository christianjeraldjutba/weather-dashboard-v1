/**
 * Environment configuration and utilities
 */

/**
 * Environment types
 */
export type Environment = 'development' | 'staging' | 'production';

/**
 * Feature flags interface
 */
export interface FeatureFlags {
  enableAnalytics: boolean;
  enableNotifications: boolean;
  enableOfflineMode: boolean;
  enableAdvancedCharts: boolean;
  enableWeatherAlerts: boolean;
  enableFavorites: boolean;
  enableExportFeatures: boolean;
  enableBetaFeatures: boolean;
  enableDebugMode: boolean;
  enablePerformanceMonitoring: boolean;
}

/**
 * API configuration interface
 */
export interface APIConfig {
  openWeatherMapApiKey: string;
  openWeatherMapBaseUrl: string;
  analyticsEndpoint?: string;
  errorReportingEndpoint?: string;
  rateLimitRequests: number;
  rateLimitWindow: number;
  requestTimeout: number;
}

/**
 * Application configuration interface
 */
export interface AppConfig {
  name: string;
  version: string;
  environment: Environment;
  baseUrl: string;
  apiConfig: APIConfig;
  featureFlags: FeatureFlags;
  security: {
    enableCSP: boolean;
    enableSecureStorage: boolean;
    requireHTTPS: boolean;
  };
  performance: {
    enableCaching: boolean;
    enableServiceWorker: boolean;
    enableLazyLoading: boolean;
    cacheMaxAge: number;
  };
  ui: {
    defaultTheme: 'light' | 'dark' | 'system';
    enableAnimations: boolean;
    enableSounds: boolean;
  };
}

/**
 * Environment configuration manager
 */
export class EnvironmentManager {
  private static instance: EnvironmentManager;
  private config: AppConfig;

  private constructor() {
    this.config = this.loadConfiguration();
  }

  static getInstance(): EnvironmentManager {
    if (!EnvironmentManager.instance) {
      EnvironmentManager.instance = new EnvironmentManager();
    }
    return EnvironmentManager.instance;
  }

  /**
   * Load configuration based on environment
   */
  private loadConfiguration(): AppConfig {
    const env = this.detectEnvironment();

    const baseConfig: AppConfig = {
      name: import.meta.env.VITE_APP_NAME || 'WeatherDash Pro',
      version: import.meta.env.VITE_APP_VERSION || '1.0.0',
      environment: env,
      baseUrl: this.getBaseUrl(),
      apiConfig: this.buildAPIConfig(),
      featureFlags: this.buildFeatureFlags(env),
      security: this.getSecurityConfig(env),
      performance: this.getPerformanceConfig(env),
      ui: this.getUIConfig(env),
    };

    return baseConfig;
  }

  /**
   * Detect current environment
   */
  private detectEnvironment(): Environment {
    if (import.meta.env.PROD) {
      return import.meta.env.VITE_ENVIRONMENT === 'staging' ? 'staging' : 'production';
    }
    return 'development';
  }

  /**
   * Get base URL
   */
  private getBaseUrl(): string {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return import.meta.env.VITE_BASE_URL || 'http://localhost:5173';
  }

  /**
   * Build API configuration
   */
  private buildAPIConfig(): APIConfig {
    return {
      openWeatherMapApiKey: import.meta.env.VITE_OPENWEATHER_API_KEY || '',
      openWeatherMapBaseUrl: 'https://api.openweathermap.org/data/2.5',
      analyticsEndpoint: import.meta.env.VITE_ANALYTICS_ENDPOINT,
      errorReportingEndpoint: import.meta.env.VITE_ERROR_REPORTING_ENDPOINT,
      rateLimitRequests: parseInt(import.meta.env.VITE_RATE_LIMIT_REQUESTS || '60'),
      rateLimitWindow: parseInt(import.meta.env.VITE_RATE_LIMIT_WINDOW || '60000'),
      requestTimeout: parseInt(import.meta.env.VITE_REQUEST_TIMEOUT || '10000'),
    };
  }

  /**
   * Build feature flags based on environment
   */
  private buildFeatureFlags(env: Environment): FeatureFlags {
    const baseFlags: FeatureFlags = {
      enableAnalytics: env === 'production',
      enableNotifications: true,
      enableOfflineMode: true,
      enableAdvancedCharts: true,
      enableWeatherAlerts: true,
      enableFavorites: true,
      enableExportFeatures: env !== 'development',
      enableBetaFeatures: env === 'development' || env === 'staging',
      enableDebugMode: env === 'development',
      enablePerformanceMonitoring: env === 'production',
    };

    // Override with environment variables
    return {
      ...baseFlags,
      enableAnalytics: this.getBooleanEnv('VITE_ENABLE_ANALYTICS', baseFlags.enableAnalytics),
      enableNotifications: this.getBooleanEnv('VITE_ENABLE_NOTIFICATIONS', baseFlags.enableNotifications),
      enableOfflineMode: this.getBooleanEnv('VITE_ENABLE_OFFLINE_MODE', baseFlags.enableOfflineMode),
      enableAdvancedCharts: this.getBooleanEnv('VITE_ENABLE_ADVANCED_CHARTS', baseFlags.enableAdvancedCharts),
      enableWeatherAlerts: this.getBooleanEnv('VITE_ENABLE_WEATHER_ALERTS', baseFlags.enableWeatherAlerts),
      enableFavorites: this.getBooleanEnv('VITE_ENABLE_FAVORITES', baseFlags.enableFavorites),
      enableExportFeatures: this.getBooleanEnv('VITE_ENABLE_EXPORT_FEATURES', baseFlags.enableExportFeatures),
      enableBetaFeatures: this.getBooleanEnv('VITE_ENABLE_BETA_FEATURES', baseFlags.enableBetaFeatures),
      enableDebugMode: this.getBooleanEnv('VITE_ENABLE_DEBUG_MODE', baseFlags.enableDebugMode),
      enablePerformanceMonitoring: this.getBooleanEnv('VITE_ENABLE_PERFORMANCE_MONITORING', baseFlags.enablePerformanceMonitoring),
    };
  }

  /**
   * Get security configuration
   */
  private getSecurityConfig(env: Environment) {
    return {
      enableCSP: env === 'production',
      enableSecureStorage: true,
      requireHTTPS: env === 'production',
    };
  }

  /**
   * Get performance configuration
   */
  private getPerformanceConfig(env: Environment) {
    return {
      enableCaching: true,
      enableServiceWorker: env !== 'development',
      enableLazyLoading: true,
      cacheMaxAge: env === 'production' ? 3600000 : 600000, // 1 hour prod, 10 min dev
    };
  }

  /**
   * Get UI configuration
   */
  private getUIConfig(env: Environment) {
    return {
      defaultTheme: (import.meta.env.VITE_DEFAULT_THEME as 'light' | 'dark' | 'system') || 'system',
      enableAnimations: !this.getBooleanEnv('VITE_DISABLE_ANIMATIONS', false),
      enableSounds: this.getBooleanEnv('VITE_ENABLE_SOUNDS', false),
    };
  }

  /**
   * Get boolean environment variable
   */
  private getBooleanEnv(key: string, defaultValue: boolean): boolean {
    const value = import.meta.env[key];
    if (value === undefined) return defaultValue;
    return value === 'true' || value === '1';
  }

  /**
   * Get current configuration
   */
  getConfig(): AppConfig {
    return { ...this.config };
  }

  /**
   * Get specific configuration section
   */
  getAPIConfig(): APIConfig {
    return { ...this.config.apiConfig };
  }

  getFeatureFlags(): FeatureFlags {
    return { ...this.config.featureFlags };
  }

  /**
   * Check if feature is enabled
   */
  isFeatureEnabled(feature: keyof FeatureFlags): boolean {
    return this.config.featureFlags[feature];
  }

  /**
   * Get environment
   */
  getEnvironment(): Environment {
    return this.config.environment;
  }

  /**
   * Check if development environment
   */
  isDevelopment(): boolean {
    return this.config.environment === 'development';
  }

  /**
   * Check if production environment
   */
  isProduction(): boolean {
    return this.config.environment === 'production';
  }

  /**
   * Check if staging environment
   */
  isStaging(): boolean {
    return this.config.environment === 'staging';
  }

  /**
   * Validate configuration
   */
  validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate API key
    if (!this.config.apiConfig.openWeatherMapApiKey) {
      errors.push('OpenWeatherMap API key is required');
    }

    // Validate API key format
    if (this.config.apiConfig.openWeatherMapApiKey && 
        !/^[a-zA-Z0-9]{32}$/.test(this.config.apiConfig.openWeatherMapApiKey)) {
      errors.push('OpenWeatherMap API key format is invalid');
    }

    // Validate rate limits
    if (this.config.apiConfig.rateLimitRequests <= 0) {
      errors.push('Rate limit requests must be greater than 0');
    }

    if (this.config.apiConfig.rateLimitWindow <= 0) {
      errors.push('Rate limit window must be greater than 0');
    }

    // Validate timeout
    if (this.config.apiConfig.requestTimeout <= 0) {
      errors.push('Request timeout must be greater than 0');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get configuration summary for debugging
   */
  getConfigSummary(): Record<string, any> {
    return {
      name: this.config.name,
      version: this.config.version,
      environment: this.config.environment,
      baseUrl: this.config.baseUrl,
      features: Object.entries(this.config.featureFlags)
        .filter(([_, enabled]) => enabled)
        .map(([feature]) => feature),
      apiConfigured: !!this.config.apiConfig.openWeatherMapApiKey,
      securityEnabled: this.config.security.enableCSP,
      performanceOptimized: this.config.performance.enableCaching,
    };
  }
}

/**
 * Global environment manager instance
 */
export const environmentManager = EnvironmentManager.getInstance();

/**
 * Convenience exports (lazy to avoid initialization issues)
 */
export const getConfig = () => environmentManager.getConfig();
export const getFeatureFlags = () => environmentManager.getFeatureFlags();
export const getAPIConfig = () => environmentManager.getAPIConfig();

/**
 * Initialize environment
 */
export const initializeEnvironment = (): void => {
  const validation = environmentManager.validateConfig();
  
  if (!validation.isValid) {
    console.error('Configuration validation failed:', validation.errors);
    
    // Show user-friendly error for missing API key
    if (validation.errors.some(error => error.includes('API key'))) {
      console.error('Please set VITE_OPENWEATHER_API_KEY in your environment variables');
    }
  }

  if (environmentManager.isDevelopment()) {
    console.log('Environment Configuration:', environmentManager.getConfigSummary());
  }
};
