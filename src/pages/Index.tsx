import { Link } from "react-router-dom";
import { Plus, Calendar, Users, Baby } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Index = () => {
  const quickActions = [
    {
      icon: Plus,
      title: "New Request",
      description: "Create a new babysitting request",
      path: "/create-request",
      color: "bg-primary",
    },
    {
      icon: Users,
      title: "Babysitters",
      description: "Manage your babysitter contacts",
      path: "/babysitters",
      color: "bg-purple-500",
    },
    {
      icon: Baby,
      title: "Kids",
      description: "Update your children's profiles",
      path: "/kids",
      color: "bg-pink-500",
    },
    {
      icon: Calendar,
      title: "Requests",
      description: "View and manage your requests",
      path: "/requests",
      color: "bg-blue-500",
    },
  ];

  return (
    <div className="page-container">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to SitterSync</h1>
        <p className="text-gray-600">
          Manage your babysitting needs with ease
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quickActions.map(({ icon: Icon, title, description, path, color }) => (
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

      <div className="mt-12 text-center">
        <Button asChild size="lg" className="animate-slide-up">
          <Link to="/create-request">
            Create New Request
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;