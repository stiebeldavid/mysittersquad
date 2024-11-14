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

interface Kid {
  id: string;
  firstName: string;
  age: number;
  notes?: string;
  tags: string[];
}

const KidProfiles = () => {
  const [kids, setKids] = useState<Kid[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentKid, setCurrentKid] = useState<Kid | null>(null);
  const { toast } = useToast();

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
      notes: formData.get("notes") as string,
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

  const handleDelete = (id: string) => {
    setKids(prev => prev.filter(k => k.id !== id));
    toast({
      title: "Profile Removed",
      description: "The profile has been removed.",
      variant: "destructive",
    });
  };

  const handleEdit = (kid: Kid) => {
    setCurrentKid(kid);
    setIsDialogOpen(true);
  };

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Kid Profiles</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setCurrentKid(null)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Kid Profile
            </Button>
          </DialogTrigger>
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
                <Label htmlFor="tags">
                  Tags (comma-separated, e.g., "Asleep, Potty trained")
                </Label>
                <Input
                  id="tags"
                  name="tags"
                  defaultValue={currentKid?.tags.join(", ")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  name="notes"
                  defaultValue={currentKid?.notes}
                />
              </div>
              <Button type="submit" className="w-full">
                {currentKid ? "Update" : "Add"} Profile
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {kids.map((kid) => (
          <Card key={kid.id} className="card-hover">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{kid.firstName}</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(kid)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(kid.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Age:</span> {kid.age}
                </p>
                {kid.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {kid.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {kid.notes && (
                  <p className="text-sm">
                    <span className="font-medium">Notes:</span> {kid.notes}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {kids.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No kid profiles added yet.</p>
          <p className="text-gray-500">Click the "Add Kid Profile" button to get started!</p>
        </div>
      )}
    </div>
  );
};

export default KidProfiles;