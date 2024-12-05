import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";
import Navbar from "../Navbar";
import FloatingActionButton from "../FloatingActionButton";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import BabysitterList from "@/pages/BabysitterList";
import MyFamily from "@/pages/MyFamily";
import CreateRequest from "@/pages/CreateRequest";
import RequestDashboard from "@/pages/RequestDashboard";
import BabysitterResponse from "@/pages/BabysitterResponse";
import Upgrade from "@/pages/Upgrade";
import ConfirmUpgrade from "@/pages/ConfirmUpgrade";
import FAQ from "@/pages/FAQ";
import { usePageTracking } from "@/hooks/usePageTracking";

export const AppRoutes = () => {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  const isResponsePage = location.pathname.startsWith('/r/');
  usePageTracking();

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      {user && !isResponsePage && <Navbar />}
      <div className="max-w-full">
        <Routes>
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } 
          />
          <Route path="/r/:requestId" element={<BabysitterResponse />} />
          <Route path="/confirm_upgrade" element={<ConfirmUpgrade />} />
          <Route path="/faq" element={<FAQ />} />
          <Route
            path="/"
            element={
              user ? (
                <Index />
              ) : (
                <Navigate to="/signup" replace />
              )
            }
          />
          <Route
            path="/upgrade"
            element={
              <PrivateRoute>
                <Upgrade />
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
      </div>
      {user && !isResponsePage && <FloatingActionButton />}
    </div>
  );
};