import { useState } from "react";
import { Plus, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface Babysitter {
  id: string;
  firstName: string;
  lastName: string;
  mobile: string;
  home?: string;
  age?: number;
  rate?: number;
  specialties?: string;
  notes?: string;
}

const BabysitterList = () => {
  const [babysitters, setBabysitters] = useState<Babysitter[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentBabysitter, setCurrentBabysitter] = useState<Babysitter | null>(null);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newBabysitter = {
      id: currentBabysitter?.id || Date.now().toString(),
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      mobile: formData.get("mobile") as string,
      home: formData.get("home") as string,
      age: Number(formData.get("age")) || undefined,
      rate: Number(formData.get("rate")) || undefined,
      specialties: formData.get("specialties") as string,
      notes: formData.get("notes") as string,
    };

    if (currentBabysitter) {
      setBabysitters(prev =>
        prev.map(b => (b.id === currentBabysitter.id ? newBabysitter : b))
      );
      toast({
        title: "Babysitter Updated",
        description: "The babysitter's information has been updated successfully.",
      });
    } else {
      setBabysitters(prev => [...prev, newBabysitter]);
      toast({
        title: "Babysitter Added",
        description: "New babysitter has been added successfully.",
      });
    }
    setIsDialogOpen(false);
    setCurrentBabysitter(null);
  };

  const handleDelete = (id: string) => {
    setBabysitters(prev => prev.filter(b => b.id !== id));
    toast({
      title: "Babysitter Removed",
      description: "The babysitter has been removed from your list.",
      variant: "destructive",
    });
  };

  const handleEdit = (babysitter: Babysitter) => {
    setCurrentBabysitter(babysitter);
    setIsDialogOpen(true);
  };

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Babysitters</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setCurrentBabysitter(null)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Babysitter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {currentBabysitter ? "Edit Babysitter" : "Add New Babysitter"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    defaultValue={currentBabysitter?.firstName}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    defaultValue={currentBabysitter?.lastName}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  defaultValue={currentBabysitter?.mobile}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="home">Home Number (Optional)</Label>
                <Input
                  id="home"
                  name="home"
                  type="tel"
                  defaultValue={currentBabysitter?.home}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    defaultValue={currentBabysitter?.age}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate">Hourly Rate ($)</Label>
                  <Input
                    id="rate"
                    name="rate"
                    type="number"
                    step="0.01"
                    defaultValue={currentBabysitter?.rate}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialties">Specialties</Label>
                <Input
                  id="specialties"
                  name="specialties"
                  defaultValue={currentBabysitter?.specialties}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  name="notes"
                  defaultValue={currentBabysitter?.notes}
                />
              </div>
              <Button type="submit" className="w-full">
                {currentBabysitter ? "Update" : "Add"} Babysitter
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {babysitters.map((babysitter) => (
          <Card key={babysitter.id} className="card-hover">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>
                  {babysitter.firstName} {babysitter.lastName}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(babysitter)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(babysitter.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Mobile:</span> {babysitter.mobile}
                </p>
                {babysitter.home && (
                  <p className="text-sm">
                    <span className="font-medium">Home:</span> {babysitter.home}
                  </p>
                )}
                {babysitter.age && (
                  <p className="text-sm">
                    <span className="font-medium">Age:</span> {babysitter.age}
                  </p>
                )}
                {babysitter.rate && (
                  <p className="text-sm">
                    <span className="font-medium">Rate:</span> ${babysitter.rate}/hour
                  </p>
                )}
                {babysitter.specialties && (
                  <p className="text-sm">
                    <span className="font-medium">Specialties:</span>{" "}
                    {babysitter.specialties}
                  </p>
                )}
                {babysitter.notes && (
                  <p className="text-sm">
                    <span className="font-medium">Notes:</span> {babysitter.notes}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {babysitters.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No babysitters added yet.</p>
          <p className="text-gray-500">Click the "Add Babysitter" button to get started!</p>
        </div>
      )}
    </div>
  );
};

export default BabysitterList;