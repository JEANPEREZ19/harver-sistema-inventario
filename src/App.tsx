import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useThemeStore } from './stores/themeStore';

// Layout
import Layout from './components/layout/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Catalog from './pages/Catalog';
import BooksByCareer from './pages/BooksByCareer';
import BookForm from './pages/BookForm';
import LoanRegistry from './pages/LoanRegistry';
import LoanRecords from './pages/LoanRecords';
import Students from './pages/Students';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { theme } = useThemeStore();
  const location = useLocation();

  useEffect(() => {
    // Apply theme class to body
    document.body.className = theme === 'dark' ? 'dark' : '';
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname, theme]);

  return (
    <div className={theme}>
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
        />
        
        <Route
          path="/"
          element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
        >
          <Route index element={<Dashboard />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="catalog/:career" element={<BooksByCareer />} />
          <Route path="catalog/add" element={<BookForm />} />
          <Route path="catalog/edit/:id" element={<BookForm />} />
          <Route path="loans/register" element={<LoanRegistry />} />
          <Route path="loans/register/:bookId" element={<LoanRegistry />} />
          <Route path="loans/records" element={<LoanRecords />} />
          <Route path="students" element={<Students />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;