import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { createUser, findUserByMobile } from "@/lib/airtable";
import { useAuthStore } from "@/store/authStore";
import { PhoneNumberInput } from "@/components/ui/phone-input";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, Calendar } from "lucide-react";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const existingUser = await findUserByMobile(formData.mobile);
      if (existingUser) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "A user with this mobile number already exists.",
        });
        return;
      }

      const record = await createUser(
        formData.firstName,
        formData.lastName,
        formData.mobile
      );

      if (record) {
        setUser({
          id: record.id,
          firstName: record.fields['First Name'] as string,
          lastName: record.fields['Last Name'] as string,
          mobile: record.fields.Mobile as string,
        });
        navigate('/');
        toast({
          title: "Welcome to MySitterSquad!",
          description: "Your account has been created successfully.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create account. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/lovable-uploads/df45466e-43ed-4173-8426-0112c7ee8a9b.png')",
      }}
    >
      <div className="absolute inset-0 bg-black/60" /> {/* Darker overlay for better readability */}
      
      {/* Nav Bar with larger brand name */}
      <nav className="relative z-10 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-white tracking-tight">MySitterSquad</span>
            </Link>
            <Button variant="ghost" asChild className="text-white hover:bg-white/10">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 text-white animate-fade-in drop-shadow-lg">
              Create Your Account
            </h1>
            <p className="text-xl text-white/95 animate-fade-in drop-shadow-md font-medium">
              Join MySitterSquad to start managing your childcare needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card className="backdrop-blur-sm bg-white/95"> {/* Increased opacity for better readability */}
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({ ...formData, firstName: e.target.value })
                        }
                        required
                      />
                      <Input
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <PhoneNumberInput
                        value={formData.mobile}
                        onChange={(value) =>
                          setFormData({ ...formData, mobile: value || "" })
                        }
                        placeholder="Mobile Number"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <p className="text-center text-white drop-shadow-md font-medium">
                Already have an account?{" "}
                <Link to="/login" className="text-primary-foreground hover:underline font-semibold">
                  Sign in
                </Link>
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-6 bg-black/40 backdrop-blur-sm p-8 rounded-lg">
                <div className="flex items-start space-x-4">
                  <Shield className="w-8 h-8 text-white flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-white text-xl mb-2 drop-shadow-md">Trusted Network</h3>
                    <p className="text-white/95 text-lg drop-shadow-sm">Manage your personal network of trusted babysitters</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Calendar className="w-8 h-8 text-white flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-white text-xl mb-2 drop-shadow-md">Easy Scheduling</h3>
                    <p className="text-white/95 text-lg drop-shadow-sm">Create and manage babysitting requests effortlessly</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Users className="w-8 h-8 text-white flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-white text-xl mb-2 drop-shadow-md">Family Management</h3>
                    <p className="text-white/95 text-lg drop-shadow-sm">Keep your family's information organized in one place</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;