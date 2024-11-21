import { Card, CardContent } from "@/components/ui/card";

interface SuccessMessageProps {
  parent: {
    firstName: string;
    lastName: string;
  };
}

export const SuccessMessage = ({ parent }: SuccessMessageProps) => (
  <Card>
    <CardContent className="p-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-green-600">Thanks for your response!</h2>
        <p className="text-lg">
          {parent.firstName} {parent.lastName} has been notified.
        </p>
        <p className="text-gray-600">You can close this page now.</p>
      </div>
    </CardContent>
  </Card>
);