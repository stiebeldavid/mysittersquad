import { useState } from "react";
import { Plus, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { KidList } from "@/components/my-family/KidList";
import { FamilyAddress } from "@/components/my-family/FamilyAddress";
import { EmergencyContacts } from "@/components/my-family/EmergencyContacts";
import { Kid } from "@/types/kid";

const MyFamily = () => {
  const [kids, setKids] = useState<Kid[]>([]);
  const [address, setAddress] = useState("123 Main St, Anytown, CA 12345");
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentKid, setCurrentKid] = useState<Kid | null>(null);
  const { toast } = useToast();

  const handleAddressChange = (newAddress: string) => {
    setAddress(newAddress);
    toast({
      title: "Address Updated",
      description: "Your home address has been updated successfully.",
    });
  };

  const handleContactsChange = (newContacts: EmergencyContact[]) => {
    setEmergencyContacts(newContacts);
    toast({
      title: "Emergency Contacts Updated",
      description: "Your emergency contacts have been updated successfully.",
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const tags = (formData.get("tags") as string)
      .split(",")
      .map(tag => tag.trim())
      .filter(Boolean);

    const newKid = {
      id: currentKid?.id || Date.now().toString(),
      firstName: formData.get("firstName") as string,
      age: Number(formData.get("age")),
      allergies: formData.get("allergies") as string,
      medicalInfo: formData.get("medicalInfo") as string,
      tags,
    };

    if (currentKid) {
      setKids(prev =>
        prev.map(k => (k.id === currentKid.id ? newKid : k))
      );
      toast({
        title: "Kid Profile Updated",
        description: "The profile has been updated successfully.",
      });
    } else {
      setKids(prev => [...prev, newKid]);
      toast({
        title: "Kid Profile Added",
        description: "New profile has been added successfully.",
      });
    }
    setIsDialogOpen(false);
    setCurrentKid(null);
  };

  const handleDeleteKid = (id: string) => {
    setKids(prev => prev.filter(k => k.id !== id));
    toast({
      title: "Profile Removed",
      description: "The profile has been removed.",
      variant: "destructive",
    });
  };

  const handleEditKid = (kid: Kid) => {
    setCurrentKid(kid);
    setIsDialogOpen(true);
  };

  const handleAddNewKid = () => {
    setCurrentKid(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">My Family</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FamilyAddress 
          address={address} 
          onAddressChange={handleAddressChange} 
        />
        <EmergencyContacts 
          contacts={emergencyContacts}
          onContactsChange={handleContactsChange}
        />
      </div>

      <KidList
        kids={kids}
        onEdit={handleEditKid}
        onDelete={handleDeleteKid}
        onAddNew={handleAddNewKid}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentKid ? "Edit Profile" : "Add New Profile"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                defaultValue={currentKid?.firstName}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                defaultValue={currentKid?.age}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies</Label>
              <Input
                id="allergies"
                name="allergies"
                defaultValue={currentKid?.allergies}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medicalInfo">Medical Information</Label>
              <Input
                id="medicalInfo"
                name="medicalInfo"
                defaultValue={currentKid?.medicalInfo}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">
                Tags (comma-separated, e.g., "Asleep, Potty trained")
              </Label>
              <Input
                id="tags"
                name="tags"
                defaultValue={currentKid?.tags?.join(", ")}
              />
            </div>
            <Button type="submit" className="w-full">
              {currentKid ? "Update" : "Add"} Profile
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyFamily;