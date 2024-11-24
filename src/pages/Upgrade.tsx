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
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_live_51QOYlLEPoH8pgr0ZPC9fzwlS3KCiLto7lH8lFRhu31I4H2ayTmQ6G5VKMAhrYkvwxCnYiiNrMaCF7HEkFFP6V34k00VYu2IAGJ");

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

const Upgrade = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleUpgradeClick = async () => {
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Stripe failed to load. Please try again.",
        });
        return;
      }

      // Create a Checkout Session
      const response = await fetch(`${BACKEND_URL}/api/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: "price_1QOYz0EPoH8pgr0ZCIbLZXvd",
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const session = await response.json();

      // Redirect to Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again later.",
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
                "Edit messages before sending",
                "Priority support",
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