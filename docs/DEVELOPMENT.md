# Development Guide

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Git for version control
- VS Code (recommended) with extensions:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter
  - ESLint

### Development Setup

1. **Clone and install dependencies**
   ```bash
   git clone https://github.com/christianjeraldjutba/sky-cast-explorer.git
   cd sky-cast-explorer
   npm install
   ```

2. **Environment configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your OpenWeatherMap API key
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## Project Architecture

### Folder Structure

```
src/
├── api/           # API client layer
├── components/    # React components
│   ├── ui/       # Reusable UI components
│   └── ...       # Feature components
├── constants/     # Application constants
├── hooks/         # Custom React hooks
├── services/      # Business logic layer
├── types/         # TypeScript definitions
├── utils/         # Utility functions
└── pages/         # Page components
```

### Architecture Principles

1. **Separation of Concerns**: Clear separation between UI, business logic, and data
2. **Type Safety**: Comprehensive TypeScript usage
3. **Component Composition**: Reusable, composable components
4. **Performance**: Optimized with React.memo and caching
5. **Accessibility**: ARIA labels and semantic HTML

## Development Workflow

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for React and TypeScript
- **Prettier**: Automatic code formatting
- **Naming Conventions**:
  - Components: PascalCase (`WeatherCard`)
  - Functions: camelCase (`convertTemperature`)
  - Constants: UPPER_SNAKE_CASE (`API_KEY`)
  - Files: kebab-case (`weather-service.ts`)

### Component Development

1. **Create component file**
   ```typescript
   // src/components/MyComponent.tsx
   import React from 'react';
   
   interface MyComponentProps {
     title: string;
     onAction: () => void;
   }
   
   export const MyComponent = React.memo<MyComponentProps>(({ title, onAction }) => {
     return (
       <div role="button" aria-label={title} onClick={onAction}>
         {title}
       </div>
     );
   });
   
   MyComponent.displayName = 'MyComponent';
   ```

2. **Add to index file** (if needed)
   ```typescript
   // src/components/index.ts
   export { MyComponent } from './MyComponent';
   ```

### Service Development

1. **Create service class**
   ```typescript
   // src/services/myService.ts
   /**
    * Service for handling specific functionality
    */
   export class MyService {
     /**
      * Method description
      * @param param - Parameter description
      * @returns Return value description
      */
     static async myMethod(param: string): Promise<string> {
       // Implementation
     }
   }
   ```

2. **Add validation and error handling**
   ```typescript
   import { validateInput } from '@/utils/validation';
   
   static async myMethod(param: string): Promise<string> {
     const validation = validateInput(param);
     if (!validation.isValid) {
       throw new Error(validation.error);
     }
     
     try {
       // API call or business logic
     } catch (error) {
       throw new Error(`Service error: ${error.message}`);
     }
   }
   ```

### Utility Development

1. **Create utility functions**
   ```typescript
   // src/utils/myUtils.ts
   /**
    * Utility function description
    * @param input - Input parameter
    * @returns Processed output
    */
   export const myUtility = (input: string): string => {
     // Implementation
   };
   ```

2. **Add comprehensive JSDoc**
   ```typescript
   /**
    * Complex utility function
    * 
    * @param param1 - First parameter description
    * @param param2 - Second parameter description
    * @returns Return value description
    * 
    * @example
    * ```typescript
    * const result = myUtility('input', 42);
    * console.log(result); // Expected output
    * ```
    */
   ```

## Testing Strategy

### Unit Testing

```typescript
// src/utils/__tests__/weather.test.ts
import { convertTemperature } from '../weather';

describe('convertTemperature', () => {
  it('converts celsius to fahrenheit correctly', () => {
    expect(convertTemperature(0, 'fahrenheit')).toBe(32);
    expect(convertTemperature(20, 'fahrenheit')).toBe(68);
  });
  
  it('returns celsius unchanged', () => {
    expect(convertTemperature(20, 'celsius')).toBe(20);
  });
});
```

### Component Testing

```typescript
// src/components/__tests__/WeatherCard.test.tsx
import { render, screen } from '@testing-library/react';
import { WeatherCard } from '../WeatherCard';

const mockWeatherData = {
  // Mock data structure
};

describe('WeatherCard', () => {
  it('renders weather information correctly', () => {
    render(<WeatherCard data={mockWeatherData} unit="celsius" />);
    
    expect(screen.getByText('20°')).toBeInTheDocument();
    expect(screen.getByText('Clear sky')).toBeInTheDocument();
  });
});
```

## Performance Optimization

### React.memo Usage

```typescript
// Memoize components that receive stable props
export const ExpensiveComponent = React.memo<Props>(({ data }) => {
  // Component implementation
});

// Add display name for debugging
ExpensiveComponent.displayName = 'ExpensiveComponent';
```

### Caching Strategy

```typescript
// Service-level caching
const cache = new Map<string, CacheEntry>();

const getCachedData = <T>(key: string): T | null => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }
  return null;
};
```

### Bundle Optimization

- **Code Splitting**: Use dynamic imports for large components
- **Tree Shaking**: Import only needed functions
- **Asset Optimization**: Optimize images and fonts

## Debugging

### Development Tools

1. **React Developer Tools**: Component inspection
2. **Redux DevTools**: State management debugging
3. **Network Tab**: API request monitoring
4. **Console Logging**: Strategic logging for debugging

### Common Issues

1. **API Key Issues**
   ```typescript
   // Check API key configuration
   if (!import.meta.env.VITE_OPENWEATHER_API_KEY) {
     console.error('API key not configured');
   }
   ```

2. **CORS Issues**
   ```typescript
   // Ensure proper API endpoint usage
   const response = await fetch(url, {
     headers: {
       'Content-Type': 'application/json',
     },
   });
   ```

3. **Type Errors**
   ```typescript
   // Use proper type assertions
   const data = response.json() as WeatherData;
   ```

## Deployment

### Build Process

```bash
# Production build
npm run build

# Preview build locally
npm run preview
```

### Environment Variables

```env
# Production environment
VITE_OPENWEATHER_API_KEY=production_api_key
VITE_APP_NAME=WeatherDash Pro
VITE_APP_VERSION=1.0.0
```

### Performance Checklist

- [ ] Bundle size optimized
- [ ] Images compressed
- [ ] API responses cached
- [ ] Error boundaries implemented
- [ ] Accessibility tested
- [ ] Performance metrics measured

## Contributing

### Pull Request Process

1. Create feature branch from `main`
2. Implement changes with tests
3. Update documentation
4. Submit pull request with description
5. Address review feedback
6. Merge after approval

### Code Review Checklist

- [ ] TypeScript types are correct
- [ ] Components are properly memoized
- [ ] Error handling is comprehensive
- [ ] Accessibility attributes are present
- [ ] JSDoc comments are complete
- [ ] Tests cover new functionality

## Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [OpenWeatherMap API](https://openweathermap.org/api)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
