import { LogIn, User, MessageSquare, Calendar, Shield, UserPlus, Clock, Check, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { SignupForm } from "@/components/signup/SignupForm";

const Signup = () => {
  const navigate = useNavigate();

  const scrollToSignup = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        <div className="bg-white/95 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {/* Feature 1 */}
              <div className="space-y-4 p-6 rounded-lg hover:bg-white/80 transition-colors">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">Your Trusted Network</h3>
                <p className="text-gray-600">
                  Add your existing, trusted babysitters to your squad. No strangers, just the sitters your family already knows and loves.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="space-y-4 p-6 rounded-lg hover:bg-white/80 transition-colors">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">One Request, Multiple Sitters</h3>
                <p className="text-gray-600">
                  Simply enter when you need care. MySitterSquad automatically reaches out to all your sitters at once, saving you time and hassle.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="space-y-4 p-6 rounded-lg hover:bg-white/80 transition-colors">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
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
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">What MySitterSquad Is Not</h2>
              <div className="space-y-4 bg-secondary/50 p-6 rounded-lg">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-primary font-bold mr-2">•</span>
                    <p className="text-gray-700">
                      We're not a babysitter marketplace or matching service - we help you coordinate with your existing, trusted sitters
                    </p>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary font-bold mr-2">•</span>
                    <p className="text-gray-700">
                      We don't share your requests with anyone outside your trusted network of added sitters
                    </p>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary font-bold mr-2">•</span>
                    <p className="text-gray-700">
                      We don't replace your judgment in choosing and trusting sitters - we simply make it easier to coordinate with the ones you already trust
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-white/95 py-16 mt-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">How MySitterSquad Works</h2>
              <p className="text-lg text-gray-600">Four simple steps to coordinate your childcare needs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {/* Step 1 */}
              <div className="space-y-4 p-6 rounded-lg hover:bg-white/80 transition-colors">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <UserPlus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Add Your Trusted Sitters</h3>
                <p className="text-gray-600">
                  Enter contact details for your existing babysitters - their phone for texts, WhatsApp, or email address.
                </p>
                <p className="text-sm text-gray-500 italic">
                  Each sitter's information is private and only visible to you.
                </p>
              </div>

              {/* Step 2 */}
              <div className="space-y-4 p-6 rounded-lg hover:bg-white/80 transition-colors">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Schedule a Request</h3>
                <p className="text-gray-600">
                  Select your date and time needed. That's it - we handle reaching out to all your sitters at once.
                </p>
                <p className="text-sm text-gray-500 italic">
                  No need to message each sitter individually anymore.
                </p>
              </div>

              {/* Step 3 */}
              <div className="space-y-4 p-6 rounded-lg hover:bg-white/80 transition-colors">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Get Quick Responses</h3>
                <p className="text-gray-600">
                  Sitters receive your request through their preferred channel and respond with their availability.
                </p>
                <p className="text-sm text-gray-500 italic">
                  All responses are organized in one place in your dashboard.
                </p>
              </div>

              {/* Step 4 */}
              <div className="space-y-4 p-6 rounded-lg hover:bg-white/80 transition-colors">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Confirm Your Sitter</h3>
                <p className="text-gray-600">
                  Review available sitters and confirm the one you want.
                </p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center space-y-6 bg-primary/5 py-12 px-4 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-800">
                Ready to simplify your babysitter coordination?
              </h3>
              <Button
                onClick={scrollToSignup}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-6 h-auto"
              >
                <ArrowUp className="h-5 w-5 mr-2" />
                Get Started Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
