import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import BabysitterList from "./pages/BabysitterList";
import MyFamily from "./pages/MyFamily";
import CreateRequest from "./pages/CreateRequest";
import RequestDashboard from "./pages/RequestDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/babysitters" element={<BabysitterList />} />
            <Route path="/family" element={<MyFamily />} />
            <Route path="/create-request" element={<CreateRequest />} />
            <Route path="/requests" element={<RequestDashboard />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;