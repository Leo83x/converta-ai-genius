import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateAgent from "./pages/CreateAgent";
import EditAgent from "./pages/EditAgent";
import WhatsAppConnection from "./pages/WhatsAppConnection";
import InstagramConnection from "./pages/InstagramConnection";
import WidgetConnection from "./pages/WidgetConnection";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Agents from "./pages/Agents";
import CRM from "./pages/CRM";
import Conversations from "./pages/Conversations";
import Integrations from "./pages/Integrations";
import Profile from "./pages/Profile";
import Support from "./pages/Support";
import AffiliateLanding from "./pages/AffiliateLanding";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>;
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={
      <PublicRoute>
        <Index />
      </PublicRoute>
    } />
    <Route path="/afiliados" element={<AffiliateLanding />} />
    <Route path="/login" element={
      <PublicRoute>
        <Login />
      </PublicRoute>
    } />
    <Route path="/dashboard" element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    } />
    <Route path="/agents" element={
      <ProtectedRoute>
        <Agents />
      </ProtectedRoute>
    } />
    <Route path="/agents/create" element={
      <ProtectedRoute>
        <CreateAgent />
      </ProtectedRoute>
    } />
    <Route path="/agents/edit/:id" element={
      <ProtectedRoute>
        <EditAgent />
      </ProtectedRoute>
    } />
    <Route path="/crm" element={
      <ProtectedRoute>
        <CRM />
      </ProtectedRoute>
    } />
    <Route path="/conversations" element={
      <ProtectedRoute>
        <Conversations />
      </ProtectedRoute>
    } />
    <Route path="/integrations" element={
      <ProtectedRoute>
        <Integrations />
      </ProtectedRoute>
    } />
    <Route path="/channels/whatsapp" element={
      <ProtectedRoute>
        <WhatsAppConnection />
      </ProtectedRoute>
    } />
    <Route path="/channels/instagram" element={
      <ProtectedRoute>
        <InstagramConnection />
      </ProtectedRoute>
    } />
    <Route path="/channels/widget" element={
      <ProtectedRoute>
        <WidgetConnection />
      </ProtectedRoute>
    } />
    <Route path="/profile" element={
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    } />
    <Route path="/profile/tutorial" element={
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    } />
    <Route path="/profile/subscription" element={
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    } />
    <Route path="/profile/account" element={
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    } />
    <Route path="/support" element={
      <ProtectedRoute>
        <Support />
      </ProtectedRoute>
    } />
    <Route path="/admin" element={
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    } />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
