import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { ContactPickerButton } from "@/components/babysitter/ContactPickerButton";
import { BabysitterForm } from "@/components/babysitter/BabysitterForm";
import { BabysitterCard } from "@/components/babysitter/BabysitterCard";
import { Babysitter } from "@/types/babysitter";

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

  const handleContactsSelected = (newBabysitters: Babysitter[]) => {
    setBabysitters(prev => [...prev, ...newBabysitters]);
  };

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Babysitters</h1>
        <div className="flex gap-2">
          <ContactPickerButton onContactsSelected={handleContactsSelected} />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setCurrentBabysitter(null)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Babysitter
              </Button>
            </DialogTrigger>
            <BabysitterForm
              onSubmit={handleSubmit}
              currentBabysitter={currentBabysitter}
            />
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {babysitters.map((babysitter) => (
          <BabysitterCard
            key={babysitter.id}
            babysitter={babysitter}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {babysitters.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No babysitters added yet.</p>
          <p className="text-gray-500">
            Click the "Add Babysitter" button to get started!
          </p>
        </div>
      )}
    </div>
  );
};

export default BabysitterList;