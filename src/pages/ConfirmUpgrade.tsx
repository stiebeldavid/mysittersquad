import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ConfirmUpgrade = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center p-4 pt-16">
      <Card className="w-full max-w-lg animate-slide-up">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            Thanks for Upgrading!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-gray-600 text-lg">
            Your new premium features should be unlocked soon.
          </p>
          <div className="flex justify-center">
            <Button 
              size="lg"
              onClick={() => navigate("/")}
            >
              Go to MySitterSquad portal
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmUpgrade;