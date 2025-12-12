import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Suspense, lazy } from 'react';

// ----------------------------------------------------------------------
// 1. LAZY IMPORTS (Performance Optimization)
// ----------------------------------------------------------------------
// Public Pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));

// Layouts
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));

// User Pages
const Marketplace = lazy(() => import('./pages/Marketplace'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const DownloadsPage = lazy(() => import('./pages/DownloadsPage'));
const FAQPage = lazy(() => import('./pages/FaqPage'));
const RulesPage = lazy(() => import('./pages/RulesPage')); // <--- 1. NEW IMPORT

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// ----------------------------------------------------------------------
// 2. UTILS
// ----------------------------------------------------------------------
const LoadingScreen = () => (
  <div className="min-h-screen bg-[#06070a] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" />;
  return children;
};

// ----------------------------------------------------------------------
// 3. MAIN APP ROUTER
// ----------------------------------------------------------------------
function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>

          {/* === PUBLIC ROUTES === */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* === DASHBOARD ROUTES (User & General) === */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>

            {/* Default: Marketplace Grid */}
            <Route index element={<Marketplace />} />

            {/* User Assets: My Downloads */}
            <Route path="downloads" element={<DownloadsPage />} />

            {/* Help Center Routes */}
            <Route path="faq" element={<FAQPage />} />
            <Route path="rules" element={<RulesPage />} /> {/* <--- 2. NEW ROUTE */}

            {/* Dynamic Categories (Must be below specific paths like 'rules' or 'faq') */}
            {/* Handles /dashboard/accounts, /dashboard/banks, etc. */}
            <Route path=":section" element={<CategoryPage />} />

            {/* Placeholders */}
            <Route path="settings" element={<div className="text-white p-10">Settings Coming Soon</div>} />
            <Route path="profile" element={<div className="text-white p-10">User Profile Coming Soon</div>} />
            <Route path="telegram" element={<div className="text-white p-10">Telegram Sync Coming Soon</div>} />
            <Route path="billing" element={<div className="text-white p-10">Billing History Coming Soon</div>} />

          </Route>

          {/* === ADMIN ROUTES === */}
          {/* Points to the Unified Command Center */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
          </Route>

          {/* === FALLBACK === */}
          <Route path="*" element={<Navigate to="/dashboard" />} />

        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;