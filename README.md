# WeatherDash Pro 🌤️

A modern, enterprise-grade weather dashboard built with React, TypeScript, and Tailwind CSS. Experience real-time weather information with a beautiful, accessible, and responsive interface that adapts to your preferences.

![WeatherDash Pro](https://img.shields.io/badge/React-18.x-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-blue)
![Vite](https://img.shields.io/badge/Vite-5.x-purple)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Latest-green)

## ✨ Features

### 🌍 Weather Data & Location
- **Real-time Weather Data**: Current conditions with detailed metrics
- **5-Day Forecast**: Extended weather predictions with daily summaries
- **Global City Search**: Search for cities worldwide with intelligent autocomplete
- **Geolocation Support**: Automatic location detection with fallback options
- **Recent Searches**: Quick access to previously searched locations
- **Auto-refresh**: Weather data updates every 10 minutes automatically

### 🎨 User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme**: Seamless theme switching with system preference detection
- **Temperature Units**: Toggle between Celsius and Fahrenheit
- **Premium UI**: Modern design with subtle animations and professional styling
- **Accessibility**: Full ARIA support, keyboard navigation, and screen reader compatibility
- **Loading States**: Elegant skeleton loaders and smooth transitions

### ⚡ Performance & Reliability
- **Performance Optimized**: React.memo, intelligent caching, and code splitting
- **Error Handling**: Comprehensive error boundaries with user-friendly messages
- **Type Safety**: Full TypeScript implementation with strict typing
- **API Caching**: Smart caching system to reduce API calls and improve performance
- **Offline Resilience**: Graceful handling of network issues

### 🔧 Technical Features
- **Modern Architecture**: Clean separation of concerns with services, hooks, and utilities
- **Component Library**: Built with shadcn/ui for consistent, accessible components
- **State Management**: Efficient state handling with React hooks and context
- **Form Validation**: Robust input validation and sanitization
- **Environment Configuration**: Flexible configuration through environment variables

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher (or **yarn** 1.22.0+)
- **OpenWeatherMap API Key** - Get your free API key at [openweathermap.org](https://openweathermap.org/api)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/christianjeraldjutba/weather-dashboard-v1.git
   cd weather-dashboard-v1
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure your settings:
   ```env
   # Required: OpenWeatherMap API Configuration
   VITE_OPENWEATHER_API_KEY=your_openweathermap_api_key_here

   # Optional: Application Configuration
   VITE_APP_NAME=WeatherDash Pro
   VITE_APP_VERSION=1.0.0

   # Optional: API Configuration
   VITE_WEATHER_CACHE_DURATION=600000
   VITE_LOCATION_REQUEST_TIMEOUT=10000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080`

## 🏗️ Project Architecture

### Directory Structure

```
weather-dashboard/
├── public/                 # Static assets
│   ├── favicon.ico        # Application favicon
│   └── weather-bg.jpg     # Background image
├── src/
│   ├── api/               # API client layer
│   │   └── weatherAPI.ts  # OpenWeatherMap API client with error handling
│   ├── assets/            # Application assets
│   │   └── weather-bg.jpg # Weather background image
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui component library
│   │   │   ├── button.tsx, card.tsx, input.tsx, etc.
│   │   │   └── use-toast.ts # Toast notification hook
│   │   ├── APIKeySetup.tsx      # API key configuration component
│   │   ├── CurrentWeatherCard.tsx # Main weather display card
│   │   ├── ErrorBoundary.tsx    # Error boundary wrapper
│   │   ├── ErrorMessage.tsx     # Error display component
│   │   ├── ForecastCard.tsx     # 5-day forecast display
│   │   ├── Header.tsx           # Navigation header with search
│   │   ├── LoadingSpinner.tsx   # Loading indicator
│   │   ├── SearchBar.tsx        # City search with autocomplete
│   │   ├── SkeletonLoader.tsx   # Loading skeleton components
│   │   ├── WeatherDashboard.tsx # Main dashboard container
│   │   └── WeatherIcon.tsx      # Weather condition icons
│   ├── constants/         # Application constants
│   │   └── weather.ts     # API URLs, cache settings, defaults
│   ├── hooks/             # Custom React hooks
│   │   ├── use-mobile.tsx # Mobile device detection
│   │   ├── use-toast.ts   # Toast notification management
│   │   └── useWeatherAPI.ts # Weather API integration hook
│   ├── pages/             # Page components
│   │   ├── Index.tsx      # Main dashboard page
│   │   └── NotFound.tsx   # 404 error page
│   ├── services/          # Business logic layer
│   │   └── weatherService.ts # Weather data processing service
│   ├── types/             # TypeScript type definitions
│   │   ├── api.ts         # OpenWeatherMap API response types
│   │   └── weather.ts     # Application data types
│   ├── utils/             # Utility functions
│   │   ├── storage.ts     # Local storage management
│   │   ├── validation.ts  # Input validation helpers
│   │   └── weather.ts     # Weather data transformation
│   ├── App.tsx            # Root application component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles and Tailwind imports
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore rules
├── components.json       # shadcn/ui configuration
├── eslint.config.js      # ESLint configuration
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
├── tsconfig.node.json    # TypeScript Node configuration
└── vite.config.ts        # Vite build configuration
```

### Component Architecture

#### Core Components
- **WeatherDashboard**: Main container managing application state
- **Header**: Navigation with search, theme toggle, and unit controls
- **CurrentWeatherCard**: Displays current weather conditions with detailed metrics
- **ForecastCard**: Shows 5-day weather forecast with daily summaries
- **SearchBar**: Intelligent city search with autocomplete and recent searches

#### UI Components (shadcn/ui)
- **Card, Button, Input**: Base UI components with consistent styling
- **Toast**: Notification system for user feedback
- **Skeleton**: Loading state components
- **Switch, Select**: Form controls for settings

#### Utility Components
- **ErrorBoundary**: Catches and handles React errors gracefully
- **LoadingSpinner**: Centralized loading indicator
- **WeatherIcon**: Dynamic weather condition icons

## 🔧 Technology Stack

### Frontend Framework
- **React 18.3.1** - Modern React with hooks and concurrent features
- **TypeScript 5.5.3** - Type-safe JavaScript with strict typing
- **Vite 5.4.1** - Fast build tool and development server

### Styling & UI
- **Tailwind CSS 3.4.11** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible component library
- **Lucide React 0.462.0** - Beautiful, customizable icons
- **Tailwind Animate** - Smooth animations and transitions

### State Management & Data
- **React Query (TanStack) 5.56.2** - Server state management and caching
- **React Hook Form 7.53.0** - Performant form handling
- **Zod 3.23.8** - Runtime type validation

### Routing & Navigation
- **React Router DOM 6.26.2** - Client-side routing

### Development Tools
- **ESLint 9.9.0** - Code linting and quality
- **PostCSS 8.4.47** - CSS processing
- **Autoprefixer 10.4.20** - CSS vendor prefixing

### External APIs
- **OpenWeatherMap API** - Weather data and geocoding services

## 🚀 Available Scripts

```bash
# Development
npm run dev          # Start development server on http://localhost:8080
npm run build        # Build for production
npm run build:dev    # Build in development mode
npm run preview      # Preview production build locally
npm run lint         # Run ESLint code analysis

# Package Management
npm install          # Install all dependencies
npm update          # Update dependencies to latest versions
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Required Configuration
VITE_OPENWEATHER_API_KEY=your_openweathermap_api_key_here

# Optional Application Settings
VITE_APP_NAME=WeatherDash Pro
VITE_APP_VERSION=1.0.0

# Optional API Settings
VITE_WEATHER_CACHE_DURATION=600000      # Cache duration in milliseconds (10 minutes)
VITE_LOCATION_REQUEST_TIMEOUT=10000     # Geolocation timeout in milliseconds (10 seconds)
```

### API Key Setup

1. **Get OpenWeatherMap API Key**:
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Navigate to API Keys section
   - Generate a new API key

2. **Configure API Key**:
   - Copy `.env.example` to `.env`
   - Replace `your_openweathermap_api_key_here` with your actual API key
   - Restart the development server

### Tailwind Configuration

The project uses a custom Tailwind configuration with:
- **Custom Colors**: Extended color palette for weather themes
- **Typography Plugin**: Enhanced text styling options
- **Animations**: Custom keyframes for smooth transitions
- **Responsive Breakpoints**: Mobile-first responsive design

### TypeScript Configuration

Strict TypeScript configuration with:
- **Strict Mode**: Enabled for maximum type safety
- **Path Mapping**: `@/` alias for clean imports
- **Modern Target**: ES2020 for optimal performance
- **JSX**: React JSX transform

## 🏗️ Building for Production

### Production Build

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

### Build Output

The production build creates:
- **Optimized Assets**: Minified CSS, JS, and images
- **Code Splitting**: Automatic chunking for better loading
- **Tree Shaking**: Removes unused code
- **Asset Optimization**: Compressed images and fonts

### Deployment Options

#### Static Hosting (Recommended)
- **Vercel**: Zero-config deployment with automatic builds
- **Netlify**: Continuous deployment with form handling
- **GitHub Pages**: Free hosting for public repositories
- **AWS S3 + CloudFront**: Scalable cloud hosting

#### Server Deployment
- **Node.js Server**: Serve static files with Express
- **Docker**: Containerized deployment
- **CDN**: Global content delivery

## 🔒 Security & Performance

### Security Features
- **Environment Variable Protection**: API keys secured in environment variables
- **Input Validation**: All user inputs validated and sanitized
- **XSS Prevention**: React's built-in XSS protection
- **HTTPS Enforcement**: Secure API communications
- **Error Handling**: Sensitive information never exposed in errors

### Performance Optimizations
- **React.memo**: Prevents unnecessary re-renders
- **Code Splitting**: Lazy loading of components
- **API Caching**: Intelligent caching reduces API calls
- **Image Optimization**: Compressed and responsive images
- **Bundle Analysis**: Optimized bundle size
- **Skeleton Loading**: Improved perceived performance

### Accessibility Features
- **ARIA Labels**: Screen reader compatibility
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG 2.1 AA compliance
- **Focus Management**: Proper focus indicators
- **Semantic HTML**: Meaningful markup structure

## 🧪 Testing

### Testing Strategy
The application includes comprehensive testing approaches:

#### Unit Testing
- **Component Testing**: Individual component functionality
- **Hook Testing**: Custom hook behavior validation
- **Utility Testing**: Helper function verification

#### Integration Testing
- **API Integration**: Weather service integration tests
- **User Interactions**: Complete user workflow testing
- **Error Scenarios**: Error handling validation

#### Recommended Testing Setup
```bash
# Install testing dependencies
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom

# Add test scripts to package.json
"scripts": {
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest --coverage"
}
```

## 🐛 Troubleshooting

### Common Issues

#### API Key Issues
```
Error: Invalid API key
```
**Solution**: Verify your OpenWeatherMap API key in `.env` file

#### Location Access Denied
```
Error: Geolocation access denied
```
**Solution**: Enable location permissions in browser settings

#### Build Errors
```
Error: Module not found
```
**Solution**: Clear node_modules and reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Development Server Issues
```
Error: Port 8080 already in use
```
**Solution**: Kill existing process or use different port
```bash
# Kill process on port 8080
npx kill-port 8080

# Or start on different port
npm run dev -- --port 3000
```

### Performance Issues

#### Slow API Responses
- Check internet connection
- Verify API key quota limits
- Clear browser cache

#### High Memory Usage
- Close unnecessary browser tabs
- Restart development server
- Check for memory leaks in components

## 📚 API Documentation

### OpenWeatherMap Integration

#### Current Weather Endpoint
```
GET https://api.openweathermap.org/data/2.5/weather
Parameters:
- lat: Latitude coordinate
- lon: Longitude coordinate
- appid: API key
- units: metric (Celsius) or imperial (Fahrenheit)
```

#### Forecast Endpoint
```
GET https://api.openweathermap.org/data/2.5/forecast
Parameters:
- lat: Latitude coordinate
- lon: Longitude coordinate
- appid: API key
- units: metric or imperial
```

#### Geocoding Endpoint
```
GET https://api.openweathermap.org/geo/1.0/direct
Parameters:
- q: City name query
- limit: Maximum results (default: 5)
- appid: API key
```

### Data Models

#### WeatherData Interface
```typescript
interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temperature: number;
    feelsLike: number;
    condition: string;
    description: string;
    humidity: number;
    windSpeed: number;
    visibility: number;
    pressure: number;
    uvIndex: number;
    icon: string;
  };
  forecast: ForecastDay[];
  lastUpdated: string;
}
```

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test your changes**
5. **Commit with conventional commits**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
6. **Push to your fork**
7. **Create a Pull Request**

### Code Standards

- **TypeScript**: Strict typing, no `any` types
- **ESLint**: Follow configured linting rules
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Semantic commit messages
- **Component Structure**: Functional components with hooks
- **File Naming**: PascalCase for components, camelCase for utilities

### Pull Request Guidelines

- Clear description of changes
- Include screenshots for UI changes
- Update documentation if needed
- Ensure all tests pass
- Follow existing code patterns

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### MIT License Summary
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ❌ Liability
- ❌ Warranty

## 🙏 Acknowledgments

- **OpenWeatherMap** - Weather data API
- **shadcn/ui** - Beautiful component library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide** - Icon library
- **React Team** - Amazing framework
- **Vite Team** - Fast build tool

## 📞 Support

### Getting Help

- **Documentation**: Check this README for detailed information
- **Issues**: Report bugs via [GitHub Issues](https://github.com/christianjeraldjutba/weather-dashboard-v1/issues)
- **Discussions**: Join community discussions
- **Email**: Contact the maintainer for urgent issues

### Reporting Issues

When reporting issues, please include:
- Operating system and version
- Browser and version
- Node.js version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

---

**Made with ❤️ by [Christian Jerald Jutba](https://github.com/christianjeraldjutba)**

*WeatherDash Pro - Your gateway to beautiful weather information* 🌤️
