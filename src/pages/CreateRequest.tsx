import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { BabysitterSelector } from "@/components/create-request/BabysitterSelector";
import { AddressInput } from "@/components/create-request/AddressInput";
import { createRequest } from "@/lib/airtable";
import { useAuthStore } from "@/store/authStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { fetchBabysitters } from "@/lib/airtable";

const CreateRequest = () => {
  const [date, setDate] = useState<Date>();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedBabysitters, setSelectedBabysitters] = useState<string[]>([]);
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useAuthStore((state) => state.user);

  const { data: babysitters = [] } = useQuery({
    queryKey: ['babysitters', user?.mobile],
    queryFn: () => fetchBabysitters(user?.mobile || ''),
    enabled: !!user?.mobile,
  });

  const generateRequestGroupId = () => {
    return `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!date || !startTime || !endTime || selectedBabysitters.length === 0 || !user) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select at least one babysitter.",
        variant: "destructive",
      });
      return;
    }

    setShowPreview(true);
  };

  const handleSendRequests = async () => {
    try {
      const requestGroupId = generateRequestGroupId();
      // Create a request for each selected babysitter
      const requests = await Promise.all(
        selectedBabysitters.map(babysitterId =>
          createRequest(
            date!,
            startTime,
            endTime,
            babysitterId,
            user!.mobile,
            requestGroupId
          )
        )
      );

      toast({
        title: "Requests Created",
        description: `Successfully created ${requests.length} babysitting request(s).`,
      });
      navigate("/requests");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create requests. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getPreviewMessages = () => {
    if (!date) return [];
    
    const selectedBabysittersData = babysitters.filter(
      sitter => selectedBabysitters.includes(sitter.id)
    );

    const dayStr = format(date, "EEEE, MMMM d");
    const timeRange = `${startTime} to ${endTime}`;

    return selectedBabysittersData.map(sitter => ({
      babysitter: sitter,
      message: `Hi ${sitter.firstName},\n${user?.firstName} ${user?.lastName} would like to know if you can babysit ${dayStr}, ${timeRange}.`
    }));
  };

  return (
    <div className="page-container">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/requests">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Create Request</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Babysitting Request</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Date</Label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <AddressInput address={address} onAddressChange={setAddress} />
            
            <BabysitterSelector
              selectedBabysitters={selectedBabysitters}
              onBabysittersChange={setSelectedBabysitters}
            />

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions or requirements..."
                className="min-h-[100px]"
              />
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full">
                Create Request{selectedBabysitters.length > 1 ? 's' : ''}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <AlertDialog open={showPreview} onOpenChange={setShowPreview}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Preview Request Messages</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-4 mt-4">
                {getPreviewMessages().map((preview, index) => (
                  <div key={preview.babysitter.id} className="p-4 bg-muted rounded-lg whitespace-pre-line">
                    {preview.message}
                  </div>
                ))}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSendRequests}>
              Send Requests
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CreateRequest;