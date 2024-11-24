import { Link } from "react-router-dom";
import { ArrowRight, Shield, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const user = useAuthStore((state) => state.user);

  // If user is authenticated, show the existing dashboard
  if (user) {
    return (
      <div className="page-container">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to MySitterSquad</h1>
          <p className="text-gray-600">Your personal babysitting coordinator</p>
        </div>
        {/* Place for authenticated user dashboard content */}
      </div>
    );
  }

  // Modern landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-24 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in leading-tight">
            Welcome to <span className="text-primary">MySitterSquad</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 animate-fade-in max-w-2xl mx-auto leading-relaxed">
            Your personal babysitting coordinator
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in">
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/signup">Get Started Free</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="card-hover border-0 shadow-lg">
              <CardHeader className="text-center">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-xl mb-2">Your Trusted Network</CardTitle>
                <CardDescription className="text-gray-600">
                  Interact and request babysitting from people you already know and trust. No strangers.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover border-0 shadow-lg">
              <CardHeader className="text-center">
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-xl mb-2">One-Click Requests</CardTitle>
                <CardDescription className="text-gray-600">
                  Send your request to multiple babysitters with one click. Avoid the messaging chaos.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover border-0 shadow-lg">
              <CardHeader className="text-center">
                <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-xl mb-2">Easy Scheduling</CardTitle>
                <CardDescription className="text-gray-600">
                  Create and manage babysitting requests effortlessly.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of families who trust MySitterSquad for their childcare needs
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg">
            <Link to="/signup">
              Create Free Account <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;