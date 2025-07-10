/**
 * Input validation and sanitization utilities
 */

/**
 * Sanitize string input by removing potentially harmful characters
 *
 * @param input - Raw string input to sanitize
 * @returns Sanitized string with harmful characters removed
 *
 * @example
 * ```typescript
 * sanitizeString('<script>alert("xss")</script>London'); // Returns 'London'
 * sanitizeString('  New York  '); // Returns 'New York'
 * ```
 */
export const sanitizeString = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets to prevent XSS
    .replace(/[^\w\s\-.,]/g, '') // Allow only word characters, spaces, hyphens, dots, and commas
    .substring(0, 100); // Limit length
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
 * Validate API key format
 */
export const validateAPIKey = (apiKey: string): { isValid: boolean; error?: string } => {
  if (!apiKey || typeof apiKey !== 'string') {
    return { isValid: false, error: 'API key is required' };
  }

  // OpenWeatherMap API keys are typically 32 characters long and alphanumeric
  if (!/^[a-zA-Z0-9]{32}$/.test(apiKey)) {
    return { isValid: false, error: 'API key format is invalid' };
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
 * Rate limiting utility class
 *
 * Implements a sliding window rate limiter to prevent API abuse.
 *
 * @example
 * ```typescript
 * const limiter = new RateLimiter(10, 60000); // 10 requests per minute
 *
 * if (limiter.isAllowed('user123')) {
 *   // Make API call
 * } else {
 *   // Rate limit exceeded
 * }
 * ```
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * Check if request is allowed
   */
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    // Add current request
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return true;
  }

  /**
   * Get remaining requests for identifier
   */
  getRemainingRequests(identifier: string): number {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    return Math.max(0, this.maxRequests - validRequests.length);
  }

  /**
   * Clear all rate limit data
   */
  clear(): void {
    this.requests.clear();
  }
}

/**
 * Global rate limiter instance for API calls
 */
export const apiRateLimiter = new RateLimiter(60, 60000); // 60 requests per minute
