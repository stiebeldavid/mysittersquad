import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
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
  const [startHours, setStartHours] = useState("09");
  const [startMinutes, setStartMinutes] = useState("00");
  const [startAmPm, setStartAmPm] = useState<"AM" | "PM">("AM");
  const [endHours, setEndHours] = useState("11");
  const [endMinutes, setEndMinutes] = useState("30");
  const [endAmPm, setEndAmPm] = useState<"AM" | "PM">("AM");
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

  const formatTimeForSubmission = (hours: string, minutes: string, ampm: "AM" | "PM") => {
    let hour = parseInt(hours);
    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, '0')}:${minutes}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const startTime = formatTimeForSubmission(startHours, startMinutes, startAmPm);
    const endTime = formatTimeForSubmission(endHours, endMinutes, endAmPm);
    
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
      const startTime = formatTimeForSubmission(startHours, startMinutes, startAmPm);
      const endTime = formatTimeForSubmission(endHours, endMinutes, endAmPm);
      
      const requests = await Promise.all(
        selectedBabysitters.map(babysitterId =>
          createRequest(
            date!,
            startTime,
            endTime,
            babysitterId,
            user!.mobile,
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
      toast({
        title: "Error",
        description: "Failed to create requests. Please try again.",
        variant: "destructive",
      });
    }
  };

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
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <TimeInput
                    hours={startHours}
                    minutes={startMinutes}
                    ampm={startAmPm}
                    onHoursChange={setStartHours}
                    onMinutesChange={setStartMinutes}
                    onAmPmChange={setStartAmPm}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <TimeInput
                    hours={endHours}
                    minutes={endMinutes}
                    ampm={endAmPm}
                    onHoursChange={setEndHours}
                    onMinutesChange={setEndMinutes}
                    onAmPmChange={setEndAmPm}
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

      <PreviewDialog
        open={showPreview}
        onOpenChange={setShowPreview}
        date={date}
        startTime={formatTimeForSubmission(startHours, startMinutes, startAmPm)}
        endTime={formatTimeForSubmission(endHours, endMinutes, endAmPm)}
        selectedBabysitters={babysitters.filter(sitter => selectedBabysitters.includes(sitter.id))}
        userName={`${user?.firstName} ${user?.lastName}`}
        onConfirm={handleSendRequests}
        notes={notes}
      />
    </div>
  );
};

export default CreateRequest;
