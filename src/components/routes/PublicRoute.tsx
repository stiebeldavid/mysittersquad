import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  return user ? <Navigate to="/" /> : <>{children}</>;
};