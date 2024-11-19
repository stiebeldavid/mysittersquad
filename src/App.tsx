import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import Navbar from "./components/Navbar";
import FloatingActionButton from "./components/FloatingActionButton";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BabysitterList from "./pages/BabysitterList";
import MyFamily from "./pages/MyFamily";
import CreateRequest from "./pages/CreateRequest";
import RequestDashboard from "./pages/RequestDashboard";

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const App = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            {user && <Navbar />}
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Index />
                  </PrivateRoute>
                }
              />
              <Route
                path="/babysitters"
                element={
                  <PrivateRoute>
                    <BabysitterList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/family"
                element={
                  <PrivateRoute>
                    <MyFamily />
                  </PrivateRoute>
                }
              />
              <Route
                path="/create-request"
                element={
                  <PrivateRoute>
                    <CreateRequest />
                  </PrivateRoute>
                }
              />
              <Route
                path="/requests"
                element={
                  <PrivateRoute>
                    <RequestDashboard />
                  </PrivateRoute>
                }
              />
            </Routes>
            {user && <FloatingActionButton />}
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;