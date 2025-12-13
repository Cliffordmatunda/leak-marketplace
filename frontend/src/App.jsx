
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Suspense, lazy } from 'react';

// --- LAZY IMPORTS ---
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const DownloadsPage = lazy(() => import('./pages/DownloadsPage'));

// ✅ CRITICAL: Make sure these file names match EXACTLY in your folder
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// --- LOADING SPINNER ---
const LoadingScreen = () => (
  <div className="min-h-screen bg-[#06070a] flex items-center justify-center text-white">
    Loading...
  </div>
);

// --- PROTECTED ROUTE WRAPPER ---
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Dashboard */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            {/* 1. Main Market */}
            <Route index element={<Marketplace />} />

            {/* 2. Admin Panel */}
            <Route path="admin" element={<AdminDashboard />} />

            {/* 3. ✅ PRODUCT DETAILS (The one that wasn't working) */}
            <Route path="product/:id" element={<ProductDetailsPage />} />

            {/* 4. Categories (Keep this LAST) */}
            <Route path=":section" element={<CategoryPage />} />

            {/* 5. User Assets */}
            <Route path="downloads" element={<DownloadsPage />} />

          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;