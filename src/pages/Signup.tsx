import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { createUser, findUserByMobile } from "@/lib/airtable";
import { useAuthStore } from "@/store/authStore";
import { PhoneNumberInput } from "@/components/ui/phone-input";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Calendar, Users } from "lucide-react";

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
      <div className="absolute inset-0 bg-black/70" />
      
      {/* Nav Bar */}
      <nav className="relative z-10 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-24">
            <Link to="/" className="flex items-center space-x-3">
              <span className="text-4xl font-bold text-white tracking-tight drop-shadow-lg">MySitterSquad</span>
            </Link>
            <Button variant="ghost" asChild className="text-white hover:bg-white/10">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Form */}
      <div className="container mx-auto px-4 pt-12 pb-24 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Headlines */}
          <div className="space-y-6">
            <h1 className="text-6xl font-bold text-white leading-tight drop-shadow-lg animate-fade-in">
              Schedule Your Babysitters Easier
            </h1>
            <p className="text-2xl text-white/90 drop-shadow-md animate-fade-in delay-100">
              Book child care in a snap, from your trusted circle of babysitters!
            </p>
          </div>

          {/* Right Column - Sign Up Form */}
          <div className="space-y-6">
            <Card className="backdrop-blur-sm bg-white/95 shadow-xl">
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
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 bg-black/40 backdrop-blur-sm py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center space-y-4 hover:bg-white/15 transition-colors">
              <Users className="w-12 h-12 text-white mx-auto" />
              <h3 className="text-2xl font-bold text-white drop-shadow-md">Your Trusted Network</h3>
              <p className="text-white/90 text-lg leading-relaxed">
                Interact and request babysitting from people you already know and trust. No strangers.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center space-y-4 hover:bg-white/15 transition-colors">
              <MessageSquare className="w-12 h-12 text-white mx-auto" />
              <h3 className="text-2xl font-bold text-white drop-shadow-md">One-Click Requests</h3>
              <p className="text-white/90 text-lg leading-relaxed">
                Send your request to multiple babysitters with one click. Avoid the messaging chaos.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center space-y-4 hover:bg-white/15 transition-colors">
              <Calendar className="w-12 h-12 text-white mx-auto" />
              <h3 className="text-2xl font-bold text-white drop-shadow-md">Easy Scheduling</h3>
              <p className="text-white/90 text-lg leading-relaxed">
                Create and manage babysitting requests effortlessly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;