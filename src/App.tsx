
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateAgent from "./pages/CreateAgent";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/agents/create" element={<CreateAgent />} />
          <Route path="/crm" element={<CRM />} />
          <Route path="/conversations" element={<Conversations />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/channels/whatsapp" element={<WhatsAppConnection />} />
          <Route path="/channels/instagram" element={<InstagramConnection />} />
          <Route path="/channels/widget" element={<WidgetConnection />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/tutorial" element={<Profile />} />
          <Route path="/profile/subscription" element={<Profile />} />
          <Route path="/profile/account" element={<Profile />} />
          <Route path="/support" element={<Support />} />
          <Route path="/admin" element={<AdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
