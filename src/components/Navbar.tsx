import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Baby, Users, Calendar, Menu, LogOut, Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const { toast } = useToast();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "See you next time!",
    });
    navigate("/login");
  };

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/babysitters", icon: Users, label: "My Babysitters" },
    { path: "/requests", icon: Calendar, label: "My Requests" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">MySitterSquad</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                  isActive(path)
                    ? "text-primary bg-primary/10"
                    : "text-gray-600 hover:text-primary hover:bg-primary/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate('/create-request')}
              className="ml-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Request
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="ml-2 text-gray-600 hover:text-primary hover:bg-primary/5"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-white shadow-lg rounded-md border mt-2 z-[100]"
                sideOffset={5}
              >
                {navItems.map(({ path, icon: Icon, label }) => (
                  <DropdownMenuItem key={path} asChild>
                    <Link
                      to={path}
                      className={`flex items-center space-x-2 w-full px-3 py-2 ${
                        isActive(path) ? "text-primary bg-primary/10" : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem asChild>
                  <Link
                    to="/create-request"
                    className="flex items-center space-x-2 w-full px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Request</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-gray-600 hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;