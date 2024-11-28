import { Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchBabysitters } from "@/lib/airtable";
import { useAuthStore } from "@/store/authStore";

const FloatingActionButton = () => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  
  const { data: babysitters = [] } = useQuery({
    queryKey: ['babysitters', user?.mobile],
    queryFn: () => fetchBabysitters(user?.mobile || ''),
    enabled: !!user?.mobile,
  });

  // Hide the button if we're on the create-request page or if there are no babysitters
  if (location.pathname === '/create-request' || babysitters.length === 0) {
    return null;
  }

  return (
    <Link to="/create-request">
      <Button
        size="lg"
        className="fixed bottom-6 right-6 rounded-full shadow-lg hover:shadow-xl z-50 px-6"
      >
        <Plus className="h-6 w-6 mr-2" />
        Create Request
      </Button>
    </Link>
  );
};

export default FloatingActionButton;