import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ResponseFormProps {
  request: any;
  onSubmit: (response: string, comments: string) => void;
  isPending: boolean;
}

export const ResponseForm = ({ request, onSubmit, isPending }: ResponseFormProps) => {
  const [response, setResponse] = useState<"yes" | "no" | null>(null);
  const [comments, setComments] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!response) {
      toast.error("Please select a response");
      return;
    }
    onSubmit(response, comments);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <Label>Are you available?</Label>
        <RadioGroup
          value={response || ""}
          onValueChange={(value) => setResponse(value as "yes" | "no")}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="yes" />
            <Label htmlFor="yes">Yes, I can babysit then</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="no" />
            <Label htmlFor="no">No, I am not available then</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comments">Additional Comments (Optional)</Label>
        <Textarea
          id="comments"
          placeholder="Add any additional comments here..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={isPending}>
        Send Response
      </Button>
    </form>
  );
};