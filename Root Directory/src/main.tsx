import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';

// Pages
import Dashboard from '@/pages/Dashboard';
import LoginPage from '@/pages/LoginPage';
import NotFound from '@/pages/NotFound';
import Index from '@/pages/Index';
import RegisterPage from '@/pages/RegisterPage';

// Styles
import './index.css';

const App = () => {
  return (
    <Router>
      <div className="flex min-h-screen">
        {/* Main App Content */}
        <div className="flex-grow">
          <Routes>
            {/* 👇 Set LoginPage as the default route */}
            <Route path="/" element={<Index />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />it s
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/app" element={<App />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
