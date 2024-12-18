import { useState, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import { BabysitterSelector } from "@/components/create-request/BabysitterSelector";
import { AddressInput } from "@/components/create-request/AddressInput";
import { PreviewDialog } from "@/components/create-request/PreviewDialog";
import { TimeInput } from "@/components/create-request/TimeInput";
import { createRequest } from "@/lib/airtable";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import { fetchBabysitters } from "@/lib/airtable";

const CreateRequest = () => {
  const [date, setDate] = useState<Date>();
  const [startTime, setStartTime] = useState("18:00");
  const [endTime, setEndTime] = useState("21:00");
  const [selectedBabysitters, setSelectedBabysitters] = useState<string[]>([]);
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

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
    
    if (!date || !startTime || !endTime || selectedBabysitters.length === 0 || !user?.mobile) {
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
      if (!date || !user?.mobile) {
        throw new Error("Missing required fields");
      }

      const requestGroupId = generateRequestGroupId();
      console.log('Creating requests with:', {
        date,
        startTime,
        endTime,
        selectedBabysitters,
        parentMobile: user.mobile,
        requestGroupId,
        notes
      });

      // Find the selected babysitters' full information including their babysitterId
      const selectedBabysittersInfo = babysitters.filter(sitter => 
        selectedBabysitters.includes(sitter.id)
      );

      const requests = await Promise.all(
        selectedBabysittersInfo.map(babysitter =>
          createRequest(
            date,
            startTime,
            endTime,
            babysitter.babysitterId || '', // Use the babysitterId from Airtable
            user.mobile,
            requestGroupId,
            notes
          )
        )
      );

      toast({
        title: "Requests Created",
        description: `Successfully created ${requests.length} babysitting request(s).`,
      });
      navigate("/requests");
    } catch (error) {
      console.error('Error creating request:', error);
      toast({
        title: "Error",
        description: "Failed to create requests. Please try again.",
        variant: "destructive",
      });
    }
  };

  const endTimeHourRef = useRef<HTMLInputElement>(null);
  const endTimeMinutesRef = useRef<HTMLInputElement>(null);

  return (
    <div className="page-container">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/">
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
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="startTime" className="mb-2 block">Start Time</Label>
                  <TimeInput
                    id="startTime"
                    value={startTime}
                    onChange={setStartTime}
                    onTabFromMinutes={() => endTimeHourRef.current?.focus()}
                  />
                </div>

                <div>
                  <Label htmlFor="endTime" className="mb-2 block">End Time</Label>
                  <TimeInput
                    id="endTime"
                    value={endTime}
                    onChange={setEndTime}
                    onTabFromMinutes={() => endTimeMinutesRef.current?.focus()}
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
                Preview Request{selectedBabysitters.length > 1 ? 's' : ''} before Sending
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <PreviewDialog
        open={showPreview}
        onOpenChange={setShowPreview}
        date={date}
        startTime={startTime}
        endTime={endTime}
        selectedBabysitters={babysitters.filter(sitter => selectedBabysitters.includes(sitter.id))}
        userName={`${user?.firstName} ${user?.lastName}`}
        onConfirm={handleSendRequests}
        notes={notes}
      />
    </div>
  );
};

export default CreateRequest;