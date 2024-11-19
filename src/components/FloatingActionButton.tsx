import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const FloatingActionButton = () => {
  return (
    <Link to="/create-request">
      <Button
        size="lg"
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg hover:shadow-xl z-50"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </Link>
  );
};

export default FloatingActionButton;