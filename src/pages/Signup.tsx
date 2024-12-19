import { LogIn, User, MessageSquare, Calendar, Shield, ArrowUp, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { SignupForm } from "@/components/signup/SignupForm";
import { HowItWorks } from "@/components/signup/HowItWorks";

const Signup = () => {
  const navigate = useNavigate();

  const scrollToSignup = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative">
      {/* Navigation Bar */}
      <nav className="absolute top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-primary/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">MySitterSquad</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/login")}
              className="text-primary hover:text-accent hover:bg-primary/5"
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
          backgroundImage: "url('/lovable-uploads/3023de26-3051-4198-acf9-42d455f0c06b.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/20 to-white/40" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-6">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-12 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Headlines */}
            <div className="space-y-6 p-6 pt-3 sm:pt-6 rounded-lg bg-gradient-to-br from-primary/20 via-accent/10 to-white/30 backdrop-blur-sm">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight animate-slide-up text-shadow-lg">
                Coordinate Your Trusted Babysitters, All in One Place
              </h1>
              <p className="text-xl text-white text-shadow leading-relaxed">
                Stop juggling multiple text threads. MySitterSquad helps you quickly find available time slots from your existing, trusted babysitters.
              </p>
            </div>

            {/* Right Column - Sign Up Form */}
            <SignupForm />
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gradient-to-b from-white/95 to-primary/5 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {/* Feature Cards */}
              <div className="space-y-4 p-6 rounded-lg bg-white/80 hover:bg-white/90 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">Your Trusted Network</h3>
                <p className="text-gray-600">
                  Add your existing, trusted babysitters to your squad. No strangers, just the sitters your family already knows and loves.
                </p>
              </div>

              <div className="space-y-4 p-6 rounded-lg bg-white/80 hover:bg-white/90 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">One Request, Multiple Sitters</h3>
                <p className="text-gray-600">
                  Simply enter when you need care. MySitterSquad automatically reaches out to all your sitters at once, saving you time and hassle.
                </p>
              </div>

              <div className="space-y-4 p-6 rounded-lg bg-white/80 hover:bg-white/90 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">Seamless Communication</h3>
                <p className="text-gray-600">
                  Each sitter gets notified their preferred way - text, WhatsApp, or email. Their responses appear in one organized place for you to review.
                </p>
              </div>
            </div>

            {/* What MySitterSquad Is Not Section */}
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                What MySitterSquad Is Not
              </h2>
              <div className="space-y-6 bg-gradient-to-br from-white/90 to-primary/5 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-primary/10">
                <ul className="space-y-6">
                  <li className="flex items-start group transition-all">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed pt-3">
                      We're not a babysitter marketplace or matching service - we help you coordinate with your existing, trusted sitters
                    </p>
                  </li>
                  <li className="flex items-start group transition-all">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed pt-3">
                      We don't share your requests with anyone outside your trusted network of added sitters
                    </p>
                  </li>
                  <li className="flex items-start group transition-all">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed pt-3">
                      We don't replace your judgment in choosing and trusting sitters - we simply make it easier to coordinate with the ones you already trust
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <HowItWorks onGetStarted={scrollToSignup} />
      </div>
    </div>
  );
};

export default Signup;
