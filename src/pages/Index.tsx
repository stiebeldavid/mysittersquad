import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Shield, Users, MessageCircle } from "lucide-react";
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
          {/* Place for authenticated user dashboard content */}
        </div>
        {/* Additional authenticated user features can go here */}
      </div>
    );
  }

  // Landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
          Your Personal Babysitting <span className="text-primary">Coordinator</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in">
          Simplify your family's childcare management. Connect with trusted babysitters, 
          schedule care, and keep your family organized - all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in">
          <Button asChild size="lg" className="text-lg">
            <Link to="/signup">Get Started Free</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-lg">
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
        <img
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
          alt="Family using MySitterSquad"
          className="rounded-xl shadow-2xl mx-auto max-w-4xl w-full animate-fade-in"
        />
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Manage Childcare</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="card-hover">
            <CardHeader>
              <Users className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Trusted Babysitters</CardTitle>
              <CardDescription>
                Manage your personal network of trusted babysitters in one place
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="card-hover">
            <CardHeader>
              <Calendar className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Easy Scheduling</CardTitle>
              <CardDescription>
                Create and manage babysitting requests with just a few clicks
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="card-hover">
            <CardHeader>
              <MessageCircle className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Quick Communication</CardTitle>
              <CardDescription>
                Communicate directly with your babysitters through the platform
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of families who trust MySitterSquad for their childcare needs
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg">
            <Link to="/signup">Create Free Account <ArrowRight className="ml-2" /></Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
