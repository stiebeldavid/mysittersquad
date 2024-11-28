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
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

const Upgrade = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useAuthStore((state) => state.user);

  const { data: userRecord, isLoading, error } = useQuery({
    queryKey: ['userSubscription', user?.mobile],
    queryFn: async () => {
      if (!user?.mobile) {
        throw new Error('No mobile number found');
      }
      const record = await findUserByMobile(user.mobile);
      if (!record) {
        throw new Error('User record not found');
      }
      return record;
    },
    enabled: !!user?.mobile,
  });

  const handleUpgradeClick = () => {
    if (!user?.mobile) {
      toast({
        title: "Error",
        description: "Unable to process upgrade. Please try logging in again.",
        variant: "destructive",
      });
      return;
    }

    if (userRecord?.fields['Subscription'] === "Premium") {
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
  };

  if (error) {
    toast({
      title: "Error",
      description: "Unable to load subscription information. Please try again later.",
      variant: "destructive",
    });
    return null;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
        <div className="max-w-md mx-auto">
          <Card className="relative">
            <CardHeader>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Upgrade to Premium</h1>
        <p className="text-muted-foreground">
          Unlock all features and get the most out of MySitterSquad
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <Card className="relative">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm">
            Best Value
          </div>
          <CardHeader>
            <CardTitle>Premium Plan</CardTitle>
            <CardDescription>
              <span className="text-3xl font-bold">$8</span>
              <span className="text-muted-foreground">/month</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                "Save unlimited babysitters",
                "Send unlimited requests",
                "Edit messages before sending (Coming Soon)",
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2"
                >
                  <Check className="h-4 w-4 text-primary" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleUpgradeClick}
              className="w-full"
              size="lg"
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