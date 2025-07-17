/**
 * Comprehensive error handling system
 */

/**
 * Error types for better categorization
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  API = 'API',
  VALIDATION = 'VALIDATION',
  PERMISSION = 'PERMISSION',
  STORAGE = 'STORAGE',
  PERFORMANCE = 'PERFORMANCE',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * Enhanced error interface
 */
export interface EnhancedError {
  id: string;
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  originalError?: Error;
  context?: Record<string, any>;
  timestamp: number;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId?: string;
  stackTrace?: string;
}

/**
 * Error reporting service interface
 */
export interface ErrorReportingService {
  report(error: EnhancedError): Promise<void>;
  reportBatch(errors: EnhancedError[]): Promise<void>;
}

/**
 * Console error reporting (development)
 */
class ConsoleErrorReporter implements ErrorReportingService {
  async report(error: EnhancedError): Promise<void> {
    console.group(`🚨 Error Report [${error.severity}]`);
    console.error('Message:', error.message);
    console.error('Type:', error.type);
    console.error('Context:', error.context);
    console.error('Original Error:', error.originalError);
    console.error('Stack Trace:', error.stackTrace);
    console.groupEnd();
  }

  async reportBatch(errors: EnhancedError[]): Promise<void> {
    console.group(`🚨 Batch Error Report (${errors.length} errors)`);
    errors.forEach((error, index) => {
      console.group(`Error ${index + 1}:`);
      console.error('Message:', error.message);
      console.error('Type:', error.type);
      console.error('Severity:', error.severity);
      console.groupEnd();
    });
    console.groupEnd();
  }
}

/**
 * Remote error reporting (production)
 */
class RemoteErrorReporter implements ErrorReportingService {
  private endpoint: string;
  private apiKey: string;

  constructor(endpoint: string, apiKey: string) {
    this.endpoint = endpoint;
    this.apiKey = apiKey;
  }

  async report(error: EnhancedError): Promise<void> {
    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(error),
      });
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }

  async reportBatch(errors: EnhancedError[]): Promise<void> {
    try {
      await fetch(`${this.endpoint}/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ errors }),
      });
    } catch (reportingError) {
      console.error('Failed to report batch errors:', reportingError);
    }
  }
}

/**
 * Error handler class
 */
export class ErrorHandler {
  private reporter: ErrorReportingService;
  private errorQueue: EnhancedError[] = [];
  private batchSize = 10;
  private flushInterval = 30000; // 30 seconds
  private flushTimer: NodeJS.Timeout | null = null;

  constructor(reporter?: ErrorReportingService) {
    this.reporter = reporter || new ConsoleErrorReporter();
    this.startBatchFlush();
    this.setupGlobalHandlers();
  }

  /**
   * Handle and report an error
   */
  async handleError(
    error: Error | string,
    type: ErrorType = ErrorType.UNKNOWN,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    context?: Record<string, any>
  ): Promise<void> {
    const enhancedError = this.createEnhancedError(error, type, severity, context);
    
    // Add to queue for batch processing
    this.errorQueue.push(enhancedError);
    
    // For critical errors, report immediately
    if (severity === ErrorSeverity.CRITICAL) {
      await this.reporter.report(enhancedError);
    }
    
    // Flush queue if it reaches batch size
    if (this.errorQueue.length >= this.batchSize) {
      await this.flushErrors();
    }
  }

  /**
   * Create enhanced error object
   */
  private createEnhancedError(
    error: Error | string,
    type: ErrorType,
    severity: ErrorSeverity,
    context?: Record<string, any>
  ): EnhancedError {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const originalError = typeof error === 'string' ? undefined : error;
    
    return {
      id: this.generateErrorId(),
      type,
      severity,
      message: errorMessage,
      originalError,
      context,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId: this.getSessionId(),
      stackTrace: originalError?.stack,
    };
  }

  /**
   * Generate unique error ID
   */
  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get or create session ID
   */
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('error-session-id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('error-session-id', sessionId);
    }
    return sessionId;
  }

  /**
   * Flush error queue
   */
  private async flushErrors(): Promise<void> {
    if (this.errorQueue.length === 0) return;
    
    const errorsToFlush = [...this.errorQueue];
    this.errorQueue = [];
    
    try {
      await this.reporter.reportBatch(errorsToFlush);
    } catch (error) {
      console.error('Failed to flush errors:', error);
      // Re-add errors to queue for retry
      this.errorQueue.unshift(...errorsToFlush);
    }
  }

  /**
   * Start batch flush timer
   */
  private startBatchFlush(): void {
    this.flushTimer = setInterval(() => {
      this.flushErrors();
    }, this.flushInterval);
  }

  /**
   * Setup global error handlers
   */
  private setupGlobalHandlers(): void {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(
        event.reason,
        ErrorType.UNKNOWN,
        ErrorSeverity.HIGH,
        { type: 'unhandledrejection' }
      );
    });

    // Handle global JavaScript errors
    window.addEventListener('error', (event) => {
      this.handleError(
        event.error || event.message,
        ErrorType.UNKNOWN,
        ErrorSeverity.HIGH,
        {
          type: 'global-error',
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        }
      );
    });

    // Handle resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.handleError(
          `Resource failed to load: ${(event.target as any)?.src || 'unknown'}`,
          ErrorType.NETWORK,
          ErrorSeverity.MEDIUM,
          { type: 'resource-error', target: event.target }
        );
      }
    }, true);
  }

  /**
   * Stop error handler
   */
  stop(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    this.flushErrors(); // Final flush
  }
}

/**
 * Error recovery strategies
 */
export const errorRecovery = {
  /**
   * Retry function with exponential backoff
   */
  retry: async <T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> => {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          throw lastError;
        }
        
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  },

  /**
   * Circuit breaker pattern
   */
  circuitBreaker: (
    fn: () => Promise<any>,
    failureThreshold: number = 5,
    resetTimeout: number = 60000
  ) => {
    let failures = 0;
    let lastFailureTime = 0;
    let state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

    return async () => {
      const now = Date.now();

      if (state === 'OPEN') {
        if (now - lastFailureTime > resetTimeout) {
          state = 'HALF_OPEN';
        } else {
          throw new Error('Circuit breaker is OPEN');
        }
      }

      try {
        const result = await fn();
        failures = 0;
        state = 'CLOSED';
        return result;
      } catch (error) {
        failures++;
        lastFailureTime = now;

        if (failures >= failureThreshold) {
          state = 'OPEN';
        }

        throw error;
      }
    };
  },
};

/**
 * Global error handler instance
 */
export const globalErrorHandler = new ErrorHandler(
  import.meta.env.PROD 
    ? new RemoteErrorReporter(
        import.meta.env.VITE_ERROR_REPORTING_ENDPOINT || '',
        import.meta.env.VITE_ERROR_REPORTING_API_KEY || ''
      )
    : new ConsoleErrorReporter()
);

/**
 * Utility functions for common error scenarios
 */
export const handleAPIError = (error: Error, context?: Record<string, any>) => {
  globalErrorHandler.handleError(error, ErrorType.API, ErrorSeverity.MEDIUM, context);
};

export const handleNetworkError = (error: Error, context?: Record<string, any>) => {
  globalErrorHandler.handleError(error, ErrorType.NETWORK, ErrorSeverity.HIGH, context);
};

export const handleValidationError = (error: Error, context?: Record<string, any>) => {
  globalErrorHandler.handleError(error, ErrorType.VALIDATION, ErrorSeverity.LOW, context);
};
