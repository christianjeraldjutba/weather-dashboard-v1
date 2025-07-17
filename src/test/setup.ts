/**
 * Test setup configuration
 */

import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Mock environment variables
vi.mock('import.meta', () => ({
  env: {
    VITE_OPENWEATHER_API_KEY: 'test-api-key',
    VITE_APP_NAME: 'WeatherDash Pro Test',
    VITE_APP_VERSION: '1.0.0-test',
    DEV: true,
    PROD: false,
  },
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
vi.stubGlobal('localStorage', localStorageMock);

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
vi.stubGlobal('sessionStorage', sessionStorageMock);

// Mock fetch
global.fetch = vi.fn();

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
vi.stubGlobal('IntersectionObserver', mockIntersectionObserver);

// Mock ResizeObserver
const mockResizeObserver = vi.fn();
mockResizeObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
vi.stubGlobal('ResizeObserver', mockResizeObserver);

// Mock PerformanceObserver
const mockPerformanceObserver = vi.fn();
mockPerformanceObserver.mockReturnValue({
  observe: () => null,
  disconnect: () => null,
});
vi.stubGlobal('PerformanceObserver', mockPerformanceObserver);

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: vi.fn(),
  watchPosition: vi.fn(),
  clearWatch: vi.fn(),
};
vi.stubGlobal('navigator', {
  ...navigator,
  geolocation: mockGeolocation,
});

// Mock crypto for secure storage
const mockCrypto = {
  getRandomValues: vi.fn((arr) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = Math.floor(Math.random() * 256);
    }
    return arr;
  }),
};
vi.stubGlobal('crypto', mockCrypto);

// Mock IndexedDB
const mockIndexedDB = {
  open: vi.fn(),
  deleteDatabase: vi.fn(),
  cmp: vi.fn(),
};
vi.stubGlobal('indexedDB', mockIndexedDB);

// Mock performance API
const mockPerformance = {
  now: vi.fn(() => Date.now()),
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByType: vi.fn(() => []),
  getEntriesByName: vi.fn(() => []),
  clearMarks: vi.fn(),
  clearMeasures: vi.fn(),
};
vi.stubGlobal('performance', mockPerformance);

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock console methods for cleaner test output
const originalConsole = { ...console };
vi.stubGlobal('console', {
  ...originalConsole,
  warn: vi.fn(),
  error: vi.fn(),
  log: vi.fn(),
});

// Custom matchers
expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

// Test utilities
export const createMockWeatherData = () => ({
  location: {
    name: 'Test City',
    country: 'TC',
    lat: 40.7128,
    lon: -74.0060,
  },
  current: {
    temperature: 20,
    feelsLike: 22,
    humidity: 65,
    pressure: 1013,
    visibility: 10,
    uvIndex: 5,
    windSpeed: 10,
    windDirection: 180,
    description: 'Clear sky',
    icon: '01d',
  },
  forecast: [
    {
      date: '2024-01-01',
      high: 25,
      low: 15,
      description: 'Sunny',
      icon: '01d',
      humidity: 60,
      windSpeed: 8,
      precipitation: 0,
    },
  ],
  lastUpdated: Date.now(),
});

export const createMockSearchResult = () => ({
  name: 'Test City',
  country: 'TC',
  state: 'Test State',
  lat: 40.7128,
  lon: -74.0060,
});

// Mock API responses
export const mockAPIResponses = {
  weather: {
    coord: { lon: -74.0060, lat: 40.7128 },
    weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
    main: {
      temp: 20,
      feels_like: 22,
      temp_min: 18,
      temp_max: 24,
      pressure: 1013,
      humidity: 65,
    },
    visibility: 10000,
    wind: { speed: 10, deg: 180 },
    sys: { country: 'TC', sunrise: 1640995200, sunset: 1641031200 },
    name: 'Test City',
  },
  forecast: {
    list: [
      {
        dt: 1640995200,
        main: { temp: 25, temp_min: 15, temp_max: 25, humidity: 60 },
        weather: [{ description: 'sunny', icon: '01d' }],
        wind: { speed: 8 },
        pop: 0,
      },
    ],
  },
  geocoding: [
    {
      name: 'Test City',
      country: 'TC',
      state: 'Test State',
      lat: 40.7128,
      lon: -74.0060,
    },
  ],
};

// Setup fetch mock responses
export const setupFetchMock = () => {
  (global.fetch as any).mockImplementation((url: string) => {
    if (url.includes('/weather')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockAPIResponses.weather),
      });
    }
    if (url.includes('/forecast')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockAPIResponses.forecast),
      });
    }
    if (url.includes('/direct')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockAPIResponses.geocoding),
      });
    }
    return Promise.reject(new Error('Unknown URL'));
  });
};
