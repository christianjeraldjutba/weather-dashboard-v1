/**
 * Tests for validation utilities
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  sanitizeString,
  validateSearchQuery,
  validateCoordinates,
  validateAPIKey,
  EnhancedRateLimiter,
} from './validation';

describe('sanitizeString', () => {
  it('should remove HTML tags', () => {
    const input = '<script>alert("xss")</script>London';
    const result = sanitizeString(input);
    expect(result).toBe('London');
  });

  it('should trim whitespace', () => {
    const input = '  New York  ';
    const result = sanitizeString(input);
    expect(result).toBe('New York');
  });

  it('should limit length', () => {
    const input = 'A'.repeat(200);
    const result = sanitizeString(input, 50);
    expect(result).toHaveLength(50);
  });

  it('should handle empty strings', () => {
    expect(sanitizeString('')).toBe('');
    expect(sanitizeString('   ')).toBe('');
  });

  it('should handle non-string input', () => {
    expect(sanitizeString(null as any)).toBe('');
    expect(sanitizeString(undefined as any)).toBe('');
    expect(sanitizeString(123 as any)).toBe('');
  });
});

describe('validateSearchQuery', () => {
  it('should validate correct queries', () => {
    const result = validateSearchQuery('London');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should reject empty queries', () => {
    const result = validateSearchQuery('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Search query is required');
  });

  it('should reject short queries', () => {
    const result = validateSearchQuery('A');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Search query must be at least 2 characters long');
  });

  it('should reject long queries', () => {
    const longQuery = 'A'.repeat(100);
    const result = validateSearchQuery(longQuery);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Search query must be less than 50 characters');
  });

  it('should handle special characters', () => {
    const result = validateSearchQuery('New York, NY');
    expect(result.isValid).toBe(true);
  });
});

describe('validateCoordinates', () => {
  it('should validate correct coordinates', () => {
    const result = validateCoordinates(40.7128, -74.0060);
    expect(result.isValid).toBe(true);
  });

  it('should reject invalid latitude', () => {
    const result = validateCoordinates(91, -74.0060);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Latitude must be between -90 and 90 degrees');
  });

  it('should reject invalid longitude', () => {
    const result = validateCoordinates(40.7128, 181);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Longitude must be between -180 and 180 degrees');
  });

  it('should handle edge cases', () => {
    expect(validateCoordinates(90, 180).isValid).toBe(true);
    expect(validateCoordinates(-90, -180).isValid).toBe(true);
    expect(validateCoordinates(0, 0).isValid).toBe(true);
  });
});

describe('validateAPIKey', () => {
  it('should validate correct OpenWeatherMap API key', () => {
    const validKey = 'a'.repeat(32);
    const result = validateAPIKey(validKey, 'openweathermap');
    expect(result.isValid).toBe(true);
    expect(result.strength).toBeDefined();
  });

  it('should reject invalid API key format', () => {
    const invalidKey = 'invalid-key';
    const result = validateAPIKey(invalidKey, 'openweathermap');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('OpenWeatherMap API key must be 32 alphanumeric characters');
  });

  it('should reject empty API key', () => {
    const result = validateAPIKey('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('API key is required');
  });

  it('should assess key strength', () => {
    const strongKey = 'AbC123XyZ789' + 'a'.repeat(20);
    const result = validateAPIKey(strongKey, 'openweathermap');
    expect(result.isValid).toBe(true);
    expect(['weak', 'medium', 'strong']).toContain(result.strength);
  });
});

describe('EnhancedRateLimiter', () => {
  let rateLimiter: EnhancedRateLimiter;

  beforeEach(() => {
    rateLimiter = new EnhancedRateLimiter(3, 1000, 100); // 3 requests per second, 100ms base backoff
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should allow requests within limit', () => {
    const result1 = rateLimiter.checkRequest('user1');
    const result2 = rateLimiter.checkRequest('user1');
    const result3 = rateLimiter.checkRequest('user1');

    expect(result1.allowed).toBe(true);
    expect(result2.allowed).toBe(true);
    expect(result3.allowed).toBe(true);
  });

  it('should block requests exceeding limit', () => {
    // Use up the limit
    rateLimiter.checkRequest('user1');
    rateLimiter.checkRequest('user1');
    rateLimiter.checkRequest('user1');

    // This should be blocked
    const result = rateLimiter.checkRequest('user1');
    expect(result.allowed).toBe(false);
    expect(result.retryAfter).toBeGreaterThan(0);
  });

  it('should implement exponential backoff', () => {
    // Exceed limit multiple times
    for (let i = 0; i < 6; i++) {
      rateLimiter.checkRequest('user1');
    }

    const result1 = rateLimiter.checkRequest('user1');
    expect(result1.allowed).toBe(false);

    // Advance time and try again (should still be blocked due to backoff)
    vi.advanceTimersByTime(200);
    const result2 = rateLimiter.checkRequest('user1');
    expect(result2.allowed).toBe(false);
    expect(result2.retryAfter).toBeGreaterThan(result1.retryAfter || 0);
  });

  it('should reset after window expires', () => {
    // Use up the limit
    rateLimiter.checkRequest('user1');
    rateLimiter.checkRequest('user1');
    rateLimiter.checkRequest('user1');

    // Should be blocked
    expect(rateLimiter.checkRequest('user1').allowed).toBe(false);

    // Advance time beyond window
    vi.advanceTimersByTime(1100);

    // Should be allowed again
    const result = rateLimiter.checkRequest('user1');
    expect(result.allowed).toBe(true);
  });

  it('should track different users separately', () => {
    // Use up limit for user1
    rateLimiter.checkRequest('user1');
    rateLimiter.checkRequest('user1');
    rateLimiter.checkRequest('user1');

    // user1 should be blocked
    expect(rateLimiter.checkRequest('user1').allowed).toBe(false);

    // user2 should still be allowed
    expect(rateLimiter.checkRequest('user2').allowed).toBe(true);
  });

  it('should provide remaining request count', () => {
    const result1 = rateLimiter.checkRequest('user1');
    expect(result1.remaining).toBe(2);

    const result2 = rateLimiter.checkRequest('user1');
    expect(result2.remaining).toBe(1);

    const result3 = rateLimiter.checkRequest('user1');
    expect(result3.remaining).toBe(0);
  });

  it('should clear data for specific identifier', () => {
    // Use up limit
    rateLimiter.checkRequest('user1');
    rateLimiter.checkRequest('user1');
    rateLimiter.checkRequest('user1');

    // Should be blocked
    expect(rateLimiter.checkRequest('user1').allowed).toBe(false);

    // Clear user1 data
    rateLimiter.clearIdentifier('user1');

    // Should be allowed again
    expect(rateLimiter.checkRequest('user1').allowed).toBe(true);
  });
});
