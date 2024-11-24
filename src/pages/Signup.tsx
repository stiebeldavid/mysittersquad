import { LogIn, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { SignupForm } from "@/components/signup/SignupForm";

const Signup = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative">
      {/* Navigation Bar */}
      <nav className="absolute top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold text-primary">MySitterSquad</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/login")}
              className="text-gray-600 hover:text-primary hover:bg-primary/5"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Button>
          </div>
        </div>
      </nav>

      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/lovable-uploads/174009da-8c34-4772-9bae-d734e0d5f625.png')",
        }}
      >
        <div className="absolute inset-0 bg-white/10" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-6">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-12 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Headlines */}
            <div className="space-y-6 p-6 pt-3 sm:pt-6 rounded-lg bg-black/10 backdrop-blur-sm">
              <h1 className="hidden sm:block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 text-shadow-lg">
                MySitterSquad
              </h1>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white leading-tight animate-slide-up text-shadow-lg">
                Book YOUR Trusted Babysitters in Seconds
              </h2>
              <p className="text-xl text-white text-shadow">
                Say goodbye to scheduling stress—arrange reliable child care in just a few clicks!
              </p>
            </div>

            {/* Right Column - Sign Up Form */}
            <SignupForm />
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white/80 py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="space-y-4 text-center p-6 rounded-lg hover:bg-white/80 transition-colors">
                <h3 className="text-2xl font-semibold text-gray-800">Your Trusted Network</h3>
                <p className="text-gray-600">
                  Interact and request babysitting from people you already know and trust. No strangers.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="space-y-4 text-center p-6 rounded-lg hover:bg-white/80 transition-colors">
                <h3 className="text-2xl font-semibold text-gray-800">One-Click Requests</h3>
                <p className="text-gray-600">
                  Send your request to multiple babysitters with one click. Avoid the messaging chaos.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="space-y-4 text-center p-6 rounded-lg hover:bg-white/80 transition-colors">
                <h3 className="text-2xl font-semibold text-gray-800">Easy Scheduling</h3>
                <p className="text-gray-600">
                  Create and manage babysitting requests effortlessly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;