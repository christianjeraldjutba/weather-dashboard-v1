/**
 * Security utilities for Content Security Policy and other security measures
 */

/**
 * Content Security Policy configuration
 */
export const CSP_CONFIG = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for Vite in development
    "'unsafe-eval'", // Required for Vite in development
    'https://api.openweathermap.org',
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for styled-components and CSS-in-JS
    'https://fonts.googleapis.com',
  ],
  'font-src': [
    "'self'",
    'https://fonts.gstatic.com',
    'data:',
  ],
  'img-src': [
    "'self'",
    'https://openweathermap.org',
    'https://api.openweathermap.org',
    'data:',
    'blob:',
  ],
  'connect-src': [
    "'self'",
    'https://api.openweathermap.org',
    'https://openweathermap.org',
  ],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': [],
};

/**
 * Generate CSP header string
 */
export const generateCSPHeader = (config = CSP_CONFIG): string => {
  return Object.entries(config)
    .map(([directive, sources]) => {
      if (sources.length === 0) return directive;
      return `${directive} ${sources.join(' ')}`;
    })
    .join('; ');
};

/**
 * Apply CSP meta tag to document head
 */
export const applyCSPMetaTag = (config = CSP_CONFIG): void => {
  // Remove existing CSP meta tag
  const existingTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (existingTag) {
    existingTag.remove();
  }

  // Create config without frame-ancestors for meta tag (not supported)
  const metaConfig = { ...config };
  delete metaConfig['frame-ancestors'];

  // Create new CSP meta tag
  const metaTag = document.createElement('meta');
  metaTag.setAttribute('http-equiv', 'Content-Security-Policy');
  metaTag.setAttribute('content', generateCSPHeader(metaConfig));

  document.head.appendChild(metaTag);
};

/**
 * Security headers configuration for production
 */
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
};

/**
 * Validate if current environment supports CSP
 */
export const supportsCSP = (): boolean => {
  return typeof document !== 'undefined' && 'createElement' in document;
};

/**
 * Initialize security measures
 */
export const initializeSecurity = (): void => {
  if (!supportsCSP()) return;

  // Apply CSP in development/client-side
  if (import.meta.env.DEV) {
    applyCSPMetaTag();
  }

  // Additional security measures
  preventClickjacking();
  preventMimeSniffing();
};

/**
 * Prevent clickjacking attacks
 */
const preventClickjacking = (): void => {
  if (window.self !== window.top) {
    // If page is in iframe, redirect to top level
    window.top!.location = window.self.location;
  }
};

/**
 * Prevent MIME type sniffing
 */
const preventMimeSniffing = (): void => {
  // This is typically handled by server headers, but we can add client-side checks
  const scripts = document.querySelectorAll('script[src]');
  scripts.forEach((script) => {
    const src = (script as HTMLScriptElement).src;
    if (src && !src.startsWith(window.location.origin) && !src.startsWith('https://')) {
      console.warn('Potentially unsafe script source detected:', src);
    }
  });
};

/**
 * Sanitize external URLs before navigation
 */
export const sanitizeExternalURL = (url: string): string | null => {
  try {
    const parsedURL = new URL(url);
    
    // Only allow HTTPS URLs
    if (parsedURL.protocol !== 'https:') {
      return null;
    }
    
    // Whitelist of allowed domains
    const allowedDomains = [
      'api.openweathermap.org',
      'openweathermap.org',
    ];
    
    if (!allowedDomains.includes(parsedURL.hostname)) {
      return null;
    }
    
    return parsedURL.toString();
  } catch {
    return null;
  }
};

/**
 * Generate nonce for inline scripts (for future use)
 */
export const generateNonce = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
};

/**
 * Validate script integrity (for future use with SRI)
 */
export const validateScriptIntegrity = (script: HTMLScriptElement): boolean => {
  const integrity = script.getAttribute('integrity');
  if (!integrity) return false;
  
  // Basic integrity format validation
  return /^(sha256|sha384|sha512)-[A-Za-z0-9+/]+=*$/.test(integrity);
};
