import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { findUserByMobile } from "@/lib/airtable";
import { useAuthStore } from "@/store/authStore";

const Login = () => {
  const [mobile, setMobile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const record = await findUserByMobile(mobile);
      
      if (record) {
        setUser({
          id: record.id,
          firstName: record.fields['First Name'] as string,
          lastName: record.fields['Last Name'] as string,
          mobile: record.fields.Mobile as string,
        });
        navigate('/');
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No user found with this mobile number.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log in. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Login to MySitterSquad</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="tel"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <p className="text-center mt-4">
          Don't have an account?{" "}
          <Button variant="link" onClick={() => navigate("/signup")}>
            Sign up
          </Button>
        </p>
      </div>
    </div>
  );
};

export default Login;