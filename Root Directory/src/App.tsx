import React, { Suspense, lazy } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate 
} from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { LoaderCircle } from 'lucide-react';
import Header from '@/components/Header';

// Lazy load pages for better performance
const Index = lazy(() => import('@/pages/Index'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const PromptGenerator = lazy(() => import('@/components/PromptGenerator'));
const MovieList = lazy(() => import('@/components/MovieList'));

// Mock authentication context (you'll replace this with actual auth logic)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Replace this with actual authentication check
  const isAuthenticated = false; 

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace />
  );
};

// Loading fallback component
const Loader = () => (
  <div className="flex justify-center items-center min-h-screen bg-background">
    <LoaderCircle 
      className="animate-spin text-accent" 
      size={48} 
    />
  </div>
);

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <div className="min-h-screen flex flex-col">
          {/* Conditionally render Header based on route */}
          <Routes>
            <Route 
              path="/dashboard" 
              element={<Header />} 
            />
            <Route 
              path="/movies" 
              element={<Header />} 
            />
            <Route 
              path="/generator" 
              element={<Header />} 
            />
          </Routes>

          <Suspense fallback={<Loader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/movies" 
                element={
                  <ProtectedRoute>
                    <MovieList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/generator" 
                element={
                  <ProtectedRoute>
                    <PromptGenerator />
                  </ProtectedRoute>
                } 
              />

              {/* 404 Not Found Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>

          {/* Toast Notifications */}
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
