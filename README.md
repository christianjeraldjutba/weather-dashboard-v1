# WeatherDash Pro 🌤️

A modern, responsive weather dashboard built with React, TypeScript, and Tailwind CSS. Get real-time weather information with a beautiful, accessible interface.

![WeatherDash Pro](https://img.shields.io/badge/React-18.x-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-blue)
![Vite](https://img.shields.io/badge/Vite-5.x-purple)

## ✨ Features

- **Real-time Weather Data**: Current conditions and 5-day forecast
- **Location Search**: Search for cities worldwide with autocomplete
- **Geolocation Support**: Automatic location detection
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark/Light Theme**: Toggle between themes with smooth transitions
- **Temperature Units**: Switch between Celsius and Fahrenheit
- **Accessibility**: Full ARIA support and keyboard navigation
- **Performance Optimized**: React.memo, caching, and skeleton loading
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Type Safety**: Full TypeScript implementation with strict typing

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenWeatherMap API key (free at [openweathermap.org](https://openweathermap.org/api))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/christianjeraldjutba/sky-cast-explorer.git
   cd sky-cast-explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your OpenWeatherMap API key:
   ```env
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── api/                    # API client layer
│   └── weatherAPI.ts      # OpenWeatherMap API client
├── components/            # React components
│   ├── ui/               # Reusable UI components (shadcn/ui)
│   ├── CurrentWeatherCard.tsx
│   ├── ForecastCard.tsx
│   ├── Header.tsx
│   ├── SearchBar.tsx
│   ├── ErrorBoundary.tsx
│   └── SkeletonLoader.tsx
├── constants/            # Application constants
│   └── weather.ts       # Weather-related constants
├── hooks/               # Custom React hooks
│   └── useWeatherAPI.ts # Weather API hook
├── services/           # Business logic layer
│   └── weatherService.ts # Weather service
├── types/              # TypeScript type definitions
│   ├── api.ts         # API response types
│   └── weather.ts     # Application types
├── utils/              # Utility functions
│   ├── storage.ts     # Local storage utilities
│   ├── validation.ts  # Input validation
│   └── weather.ts     # Weather utilities
└── pages/              # Page components
    └── Index.tsx      # Main dashboard page
```

## 🔧 Technologies Used

- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **React 18** - UI library with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **Lucide React** - Beautiful icons
- **OpenWeatherMap API** - Weather data source

## 🏗️ Building for Production

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

## 🔒 Security & Performance Features

- Environment variable protection
- Input validation and sanitization
- React.memo optimization
- API response caching
- Error boundary protection
- Accessibility compliance

## 📄 License

This project is licensed under the MIT License.

---

Made with ❤️ by [Christian Jerald Jutba](https://github.com/christianjeraldjutba)
