import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/authStore";
import { findUserByMobile } from "@/lib/airtable";

const Upgrade = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuthStore();

  const handleUpgradeClick = async () => {
    if (!user?.mobile) {
      toast({
        title: "Error",
        description: "Please log in to upgrade your subscription",
        variant: "destructive",
      });
      return;
    }

    try {
      const userRecord = await findUserByMobile(user.mobile);
      
      if (!userRecord) {
        toast({
          title: "Error",
          description: "User not found",
          variant: "destructive",
        });
        return;
      }

      const subscription = userRecord.fields['Subscription'] as string;

      if (subscription === "Premium") {
        toast({
          title: "Already Premium",
          description: "You already have a Premium subscription!",
        });
        navigate("/");
        return;
      }

      // Remove the '+' from the mobile number for Stripe
      const clientReferenceId = user.mobile.replace('+', '');
      
      // Open Stripe checkout in new tab
      window.open(`https://buy.stripe.com/7sI8zr30U7eS8OQ9AA?client_reference_id=${clientReferenceId}`, '_blank');
    } catch (error) {
      console.error('Error checking subscription:', error);
      toast({
        title: "Error",
        description: "Failed to process upgrade request",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="page-container">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Upgrade to Premium</h1>
        <p className="text-muted-foreground">
          Unlock all features and get the most out of MySitterSquad
        </p>
      </div>

      <div className="grid gap-8 items-start">
        <Card className="relative overflow-hidden border-primary">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm">
            Best Value
          </div>
          <CardHeader>
            <CardTitle className="text-2xl">Premium Plan</CardTitle>
            <CardDescription>
              <span className="text-3xl font-bold">$8</span>
              <span className="text-muted-foreground">/month</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              {[
                "Save unlimited babysitters",
                "Send unlimited requests",
                "Edit messages before sending (Coming Soon)",
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 text-left"
                >
                  <Check className="w-4 h-4 text-primary" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              size="lg"
              className="w-full"
              onClick={handleUpgradeClick}
            >
              Upgrade Now
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Upgrade;