import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Agents from '@/pages/Agents';
import CreateAgent from '@/pages/CreateAgent';
import EditAgent from '@/pages/EditAgent';
import CRM from '@/pages/CRM';
import Conversations from '@/pages/Conversations';
import Integrations from '@/pages/Integrations';
import Profile from '@/pages/Profile';
import Support from '@/pages/Support';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Index from '@/pages/Index';
import AffiliatePanel from './pages/AffiliatePanel';

const queryClient = new QueryClient();

// Componente para proteger rotas que exigem autenticação
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user) {
    // Redireciona para a página de login se não estiver autenticado
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/agents" 
                element={
                  <ProtectedRoute>
                    <Agents />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/agents/create" 
                element={
                  <ProtectedRoute>
                    <CreateAgent />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/agents/edit/:id" 
                element={
                  <ProtectedRoute>
                    <EditAgent />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/crm" 
                element={
                  <ProtectedRoute>
                    <CRM />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/conversations" 
                element={
                  <ProtectedRoute>
                    <Conversations />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/integrations" 
                element={
                  <ProtectedRoute>
                    <Integrations />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile/*" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/support" 
                element={
                  <ProtectedRoute>
                    <Support />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/affiliate-panel" 
                element={
                  <ProtectedRoute>
                    <AffiliatePanel />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
