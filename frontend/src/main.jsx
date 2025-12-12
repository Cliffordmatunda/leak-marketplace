import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx';
// 1. IMPORT REACT QUERY
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 2. CREATE THE CLIENT (The Cache Engine)
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 3. WRAP THE ENTIRE APP HERE */}
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);