
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Demo from "./pages/Demo";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Agents from "./pages/Agents";
import CreateAgent from "./pages/CreateAgent";
import EditAgent from "./pages/EditAgent";
import CRM from "./pages/CRM";
import Conversations from "./pages/Conversations";
import WhatsAppConnection from "./pages/WhatsAppConnection";
import InstagramConnection from "./pages/InstagramConnection";
import WidgetConnection from "./pages/WidgetConnection";
import Integrations from "./pages/Integrations";
import Profile from "./pages/Profile";
import Support from "./pages/Support";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import AffiliateLanding from "./pages/AffiliateLanding";
import ConfirmationPage from "./pages/ConfirmationPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/login" element={<Login />} />
              <Route path="/afiliados" element={<AffiliateLanding />} />
              <Route path="/confirmado" element={<ConfirmationPage />} />
              
              {/* Protected routes with Layout */}
              <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
              <Route path="/agents" element={<Layout><Agents /></Layout>} />
              <Route path="/agents/create" element={<Layout><CreateAgent /></Layout>} />
              <Route path="/agents/edit/:id" element={<Layout><EditAgent /></Layout>} />
              <Route path="/crm" element={<Layout><CRM /></Layout>} />
              <Route path="/conversations" element={<Layout><Conversations /></Layout>} />
              <Route path="/whatsapp" element={<Layout><WhatsAppConnection /></Layout>} />
              <Route path="/instagram" element={<Layout><InstagramConnection /></Layout>} />
              <Route path="/widget" element={<Layout><WidgetConnection /></Layout>} />
              <Route path="/integrations" element={<Layout><Integrations /></Layout>} />
              <Route path="/profile" element={<Layout><Profile /></Layout>} />
              <Route path="/support" element={<Layout><Support /></Layout>} />
              <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
