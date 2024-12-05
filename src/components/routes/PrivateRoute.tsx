import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const SESSION_TIMEOUT = 1000 * 60 * 60; // 1 hour

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { toast } = useToast();
  
  useEffect(() => {
    if (!user) return;

    const loginTime = localStorage.getItem('loginTime');
    const now = Date.now();
    const isRecentLogin = loginTime && (now - parseInt(loginTime) < 5000);
    
    if (isRecentLogin) {
      return;
    }

    const lastActivity = localStorage.getItem('lastActivity');
    if (lastActivity && (now - parseInt(lastActivity) > SESSION_TIMEOUT)) {
      toast({
        title: "Session Expired",
        description: "Please log in again for security reasons.",
        variant: "destructive",
      });
      logout();
      return;
    }
    
    localStorage.setItem('lastActivity', now.toString());
    
    const updateActivity = () => {
      localStorage.setItem('lastActivity', Date.now().toString());
    };
    
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    
    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
    };
  }, [user, logout, toast]);
  
  return user ? <>{children}</> : <Navigate to="/login" />;
};