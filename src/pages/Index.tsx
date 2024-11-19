import { Link } from "react-router-dom";
import { Plus, Calendar, Users, Baby } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFamilyStore } from "@/store/familyStore";
import { useQuery } from "@tanstack/react-query";
import { fetchBabysitters } from "@/lib/airtable";
import { useAuthStore } from "@/store/authStore";

const Index = () => {
  const { kids } = useFamilyStore();
  const user = useAuthStore((state) => state.user);
  
  const { data: babysitters = [] } = useQuery({
    queryKey: ['babysitters', user?.mobile],
    queryFn: () => fetchBabysitters(user?.mobile || ''),
    enabled: !!user?.mobile,
  });
  
  const setupActions = [
    {
      icon: Baby,
      title: "Set Up Family Profile",
      description: "Add your family details and kids' information",
      path: "/family",
      color: "bg-pink-500",
      isComplete: kids.length > 0,
    },
    {
      icon: Users,
      title: "Add Babysitters",
      description: "Import or add your trusted babysitters",
      path: "/babysitters",
      color: "bg-purple-500",
      isComplete: babysitters.length > 0,
      count: babysitters.length,
    },
  ];

  const mainActions = [
    {
      icon: Plus,
      title: "New Request",
      description: "Create a new babysitting request",
      path: "/create-request",
      color: "bg-primary",
      isComplete: true,
    },
    {
      icon: Calendar,
      title: "Request Dashboard",
      description: "View and manage your requests",
      path: "/requests",
      color: "bg-blue-500",
      isComplete: true,
    },
  ];

  return (
    <div className="page-container">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to MySitterSquad</h1>
        <p className="text-gray-600">
          Your personal babysitting coordinator
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Setup Required</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {setupActions.map(({ icon: Icon, title, description, path, color, isComplete, count }) => (
              <Link key={path} to={path}>
                <Card className={`card-hover cursor-pointer h-full ${isComplete ? 'border-green-500' : 'border-orange-500'}`}>
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="flex items-center justify-between">
                      <span>{title}</span>
                      <div className="flex items-center gap-2">
                        {count !== undefined && (
                          <Badge variant="secondary" className="text-xs">
                            {count} {count === 1 ? 'babysitter' : 'babysitters'}
                          </Badge>
                        )}
                        {isComplete && (
                          <span className="text-green-500 text-sm">✓</span>
                        )}
                      </div>
                    </CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Main Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mainActions.map(({ icon: Icon, title, description, path, color }) => (
              <Link key={path} to={path}>
                <Card className="card-hover cursor-pointer h-full">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {kids.length > 0 && babysitters.length > 0 && (
        <div className="mt-12 text-center">
          <Button asChild size="lg" className="animate-slide-up">
            <Link to="/create-request">
              Create New Request
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Index;