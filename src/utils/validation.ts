/**
 * Enhanced input validation and sanitization utilities with DOMPurify
 */

import DOMPurify from 'dompurify';

/**
 * Advanced sanitization configuration
 */
const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [], // No HTML tags allowed
  ALLOWED_ATTR: [], // No attributes allowed
  KEEP_CONTENT: true, // Keep text content
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
  RETURN_DOM_IMPORT: false,
};

/**
 * Enhanced string sanitization with DOMPurify and additional security measures
 *
 * @param input - Raw string input to sanitize
 * @param maxLength - Maximum allowed length (default: 100)
 * @returns Sanitized string with harmful characters removed
 *
 * @example
 * ```typescript
 * sanitizeString('<script>alert("xss")</script>London'); // Returns 'London'
 * sanitizeString('  New York  '); // Returns 'New York'
 * sanitizeString('Very long city name...', 50); // Truncated to 50 chars
 * ```
 */
export const sanitizeString = (input: string, maxLength: number = 100): string => {
  if (typeof input !== 'string') return '';

  // First pass: DOMPurify sanitization
  const purified = DOMPurify.sanitize(input, SANITIZE_CONFIG);

  // Second pass: Additional sanitization
  return purified
    .trim()
    .replace(/[<>]/g, '') // Remove any remaining angle brackets
    .replace(/[^\w\s\-.,'/]/g, '') // Allow word chars, spaces, hyphens, dots, commas, apostrophes, slashes
    .replace(/\s+/g, ' ') // Normalize whitespace
    .substring(0, maxLength); // Limit length
};

/**
 * Sanitize HTML content (for future use with rich text)
 */
export const sanitizeHTML = (input: string): string => {
  if (typeof input !== 'string') return '';

  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'span'],
    ALLOWED_ATTR: ['class'],
    KEEP_CONTENT: true,
  });
};

/**
 * Validate and sanitize URL inputs
 */
export const sanitizeURL = (input: string): string => {
  if (typeof input !== 'string') return '';

  try {
    const url = new URL(input);
    // Only allow HTTPS URLs for security
    if (url.protocol !== 'https:') return '';
    return url.toString();
  } catch {
    return '';
  }
};

/**
 * Validate search query
 */
export const validateSearchQuery = (query: string): { isValid: boolean; error?: string } => {
  if (!query || typeof query !== 'string') {
    return { isValid: false, error: 'Search query is required' };
  }

  const sanitized = sanitizeString(query);
  
  if (sanitized.length < 2) {
    return { isValid: false, error: 'Search query must be at least 2 characters long' };
  }

  if (sanitized.length > 50) {
    return { isValid: false, error: 'Search query must be less than 50 characters' };
  }

  // Check for valid characters (letters, numbers, spaces, hyphens, dots, commas)
  if (!/^[\w\s\-.,]+$/.test(sanitized)) {
    return { isValid: false, error: 'Search query contains invalid characters' };
  }

  return { isValid: true };
};

/**
 * Validate coordinates
 */
export const validateCoordinates = (lat: number, lon: number): { isValid: boolean; error?: string } => {
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    return { isValid: false, error: 'Coordinates must be numbers' };
  }

  if (isNaN(lat) || isNaN(lon)) {
    return { isValid: false, error: 'Coordinates must be valid numbers' };
  }

  if (lat < -90 || lat > 90) {
    return { isValid: false, error: 'Latitude must be between -90 and 90 degrees' };
  }

  if (lon < -180 || lon > 180) {
    return { isValid: false, error: 'Longitude must be between -180 and 180 degrees' };
  }

  return { isValid: true };
};

/**
 * Validate temperature unit
 */
export const validateTemperatureUnit = (unit: string): { isValid: boolean; error?: string } => {
  if (!unit || typeof unit !== 'string') {
    return { isValid: false, error: 'Temperature unit is required' };
  }

  const validUnits = ['celsius', 'fahrenheit'];
  if (!validUnits.includes(unit.toLowerCase())) {
    return { isValid: false, error: 'Temperature unit must be celsius or fahrenheit' };
  }

  return { isValid: true };
};

/**
 * Enhanced API key validation with multiple format support
 */
export const validateAPIKey = (apiKey: string, provider: 'openweathermap' | 'generic' = 'openweathermap'): {
  isValid: boolean;
  error?: string;
  strength?: 'weak' | 'medium' | 'strong';
} => {
  if (!apiKey || typeof apiKey !== 'string') {
    return { isValid: false, error: 'API key is required' };
  }

  // Sanitize the API key
  const sanitizedKey = sanitizeString(apiKey.trim(), 64);

  if (sanitizedKey !== apiKey.trim()) {
    return { isValid: false, error: 'API key contains invalid characters' };
  }

  // Provider-specific validation
  switch (provider) {
    case 'openweathermap':
      // OpenWeatherMap API keys are typically 32 characters long and alphanumeric
      if (!/^[a-zA-Z0-9]{32}$/.test(sanitizedKey)) {
        return { isValid: false, error: 'OpenWeatherMap API key must be 32 alphanumeric characters' };
      }
      break;

    case 'generic':
      // Generic API key validation (16-64 characters, alphanumeric + some special chars)
      if (!/^[a-zA-Z0-9_\-\.]{16,64}$/.test(sanitizedKey)) {
        return { isValid: false, error: 'API key must be 16-64 characters (alphanumeric, underscore, hyphen, dot only)' };
      }
      break;
  }

  // Assess key strength
  const strength = assessAPIKeyStrength(sanitizedKey);

  return { isValid: true, strength };
};

/**
 * Assess API key strength based on entropy and patterns
 */
const assessAPIKeyStrength = (apiKey: string): 'weak' | 'medium' | 'strong' => {
  let score = 0;

  // Length bonus
  if (apiKey.length >= 32) score += 2;
  else if (apiKey.length >= 24) score += 1;

  // Character variety
  if (/[a-z]/.test(apiKey)) score += 1;
  if (/[A-Z]/.test(apiKey)) score += 1;
  if (/[0-9]/.test(apiKey)) score += 1;

  // No obvious patterns
  if (!/(.)\1{3,}/.test(apiKey)) score += 1; // No 4+ repeated chars
  if (!/012|123|234|345|456|567|678|789|890|abc|bcd|cde/.test(apiKey.toLowerCase())) score += 1; // No sequences

  if (score >= 6) return 'strong';
  if (score >= 4) return 'medium';
  return 'weak';
};

/**
 * API key rotation support
 */
export interface APIKeyRotation {
  primary: string;
  backup?: string;
  rotationDate?: Date;
  expiryDate?: Date;
}

/**
 * Validate API key rotation configuration
 */
export const validateAPIKeyRotation = (rotation: APIKeyRotation): { isValid: boolean; error?: string } => {
  const primaryValidation = validateAPIKey(rotation.primary);
  if (!primaryValidation.isValid) {
    return { isValid: false, error: `Primary key invalid: ${primaryValidation.error}` };
  }

  if (rotation.backup) {
    const backupValidation = validateAPIKey(rotation.backup);
    if (!backupValidation.isValid) {
      return { isValid: false, error: `Backup key invalid: ${backupValidation.error}` };
    }

    if (rotation.primary === rotation.backup) {
      return { isValid: false, error: 'Primary and backup keys must be different' };
    }
  }

  if (rotation.expiryDate && rotation.expiryDate <= new Date()) {
    return { isValid: false, error: 'API key has expired' };
  }

  return { isValid: true };
};

/**
 * Sanitize and validate search result data
 */
export const validateSearchResult = (result: unknown): { isValid: boolean; error?: string } => {
  if (!result || typeof result !== 'object') {
    return { isValid: false, error: 'Search result must be an object' };
  }

  const r = result as Record<string, unknown>;

  if (!r.name || typeof r.name !== 'string') {
    return { isValid: false, error: 'Search result must have a valid name' };
  }

  if (!r.country || typeof r.country !== 'string') {
    return { isValid: false, error: 'Search result must have a valid country' };
  }

  if (typeof r.lat !== 'number' || typeof r.lon !== 'number') {
    return { isValid: false, error: 'Search result must have valid coordinates' };
  }

  const coordValidation = validateCoordinates(r.lat, r.lon);
  if (!coordValidation.isValid) {
    return coordValidation;
  }

  return { isValid: true };
};

/**
 * Enhanced rate limiting utility class with exponential backoff
 *
 * Implements a sliding window rate limiter with exponential backoff to prevent API abuse.
 *
 * @example
 * ```typescript
 * const limiter = new EnhancedRateLimiter(10, 60000); // 10 requests per minute
 *
 * const result = limiter.checkRequest('user123');
 * if (result.allowed) {
 *   // Make API call
 * } else {
 *   // Rate limit exceeded, wait for result.retryAfter ms
 * }
 * ```
 */
export class EnhancedRateLimiter {
  private requests: Map<string, number[]> = new Map();
  private violations: Map<string, { count: number; lastViolation: number }> = new Map();
  private maxRequests: number;
  private windowMs: number;
  private baseBackoffMs: number;

  constructor(
    maxRequests: number = 10,
    windowMs: number = 60000,
    baseBackoffMs: number = 1000
  ) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.baseBackoffMs = baseBackoffMs;
  }

  /**
   * Check if request is allowed with exponential backoff
   */
  checkRequest(identifier: string): { allowed: boolean; retryAfter?: number; remaining: number } {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    const violation = this.violations.get(identifier);

    // Check if still in backoff period
    if (violation) {
      const backoffTime = this.baseBackoffMs * Math.pow(2, Math.min(violation.count - 1, 10));
      const backoffEnd = violation.lastViolation + backoffTime;

      if (now < backoffEnd) {
        return {
          allowed: false,
          retryAfter: backoffEnd - now,
          remaining: 0
        };
      }
    }

    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    const remaining = Math.max(0, this.maxRequests - validRequests.length);

    if (validRequests.length >= this.maxRequests) {
      // Record violation for exponential backoff
      const currentViolation = this.violations.get(identifier) || { count: 0, lastViolation: 0 };
      this.violations.set(identifier, {
        count: currentViolation.count + 1,
        lastViolation: now
      });

      const backoffTime = this.baseBackoffMs * Math.pow(2, Math.min(currentViolation.count, 10));

      return {
        allowed: false,
        retryAfter: backoffTime,
        remaining: 0
      };
    }

    // Request allowed - add to tracking and reset violations
    validRequests.push(now);
    this.requests.set(identifier, validRequests);

    // Reset violation count on successful request
    if (violation) {
      this.violations.delete(identifier);
    }

    return {
      allowed: true,
      remaining: remaining - 1
    };
  }

  /**
   * Legacy method for backward compatibility
   */
  isAllowed(identifier: string): boolean {
    return this.checkRequest(identifier).allowed;
  }

  /**
   * Get remaining requests for identifier
   */
  getRemainingRequests(identifier: string): number {
    return this.checkRequest(identifier).remaining;
  }

  /**
   * Get current backoff time for identifier
   */
  getBackoffTime(identifier: string): number {
    const violation = this.violations.get(identifier);
    if (!violation) return 0;

    const backoffTime = this.baseBackoffMs * Math.pow(2, Math.min(violation.count - 1, 10));
    const backoffEnd = violation.lastViolation + backoffTime;

    return Math.max(0, backoffEnd - Date.now());
  }

  /**
   * Clear all rate limit data
   */
  clear(): void {
    this.requests.clear();
    this.violations.clear();
  }

  /**
   * Clear data for specific identifier
   */
  clearIdentifier(identifier: string): void {
    this.requests.delete(identifier);
    this.violations.delete(identifier);
  }
}

/**
 * Backward compatibility - use EnhancedRateLimiter
 * @deprecated Use EnhancedRateLimiter instead
 */
export class RateLimiter extends EnhancedRateLimiter {}

/**
 * Global rate limiter instances for different API endpoints
 */
export const apiRateLimiter = new EnhancedRateLimiter(60, 60000, 2000); // 60 requests per minute, 2s base backoff
export const searchRateLimiter = new EnhancedRateLimiter(30, 60000, 1000); // 30 searches per minute, 1s base backoff
export const weatherRateLimiter = new EnhancedRateLimiter(120, 60000, 5000); // 120 weather requests per minute, 5s base backoff
