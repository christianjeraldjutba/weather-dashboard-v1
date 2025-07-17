import { useEffect, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { initializeSecurity } from "@/utils/security";
import { initializeLazyLoading } from "@/utils/lazyLoading";
import { initializePerformanceMonitoring } from "@/utils/performance";
import { initializeAccessibility } from "@/utils/accessibility";
import { initializeNotifications } from "@/utils/notifications";
import { initializeSEO } from "@/utils/seo";
import { initializeAnalytics } from "@/utils/analytics";
import { initializeEnvironment } from "@/utils/environment";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const App = () => {
  useEffect(() => {
    // Initialize all systems on app startup
    const initializeApp = async () => {
      try {
        // Core systems
        initializeEnvironment();
        initializeSecurity();
        initializeAccessibility();

        // Performance and optimization
        initializeLazyLoading();
        initializePerformanceMonitoring();

        // User experience
        await initializeNotifications();
        initializeSEO();
        await initializeAnalytics();

        if (!import.meta.env.PROD) {
          console.log('✅ WeatherDash Pro initialized successfully');
        }
      } catch (error) {
        console.error('❌ Failed to initialize WeatherDash Pro:', error);
      }
    };

    initializeApp();
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Index />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
