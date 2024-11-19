import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { BabysitterForm } from "@/components/babysitter/BabysitterForm";
import { BabysitterCard } from "@/components/babysitter/BabysitterCard";
import { ContactPickerButton } from "@/components/babysitter/ContactPickerButton";
import { Babysitter } from "@/types/babysitter";
import { useFamilyStore } from "@/store/familyStore";
import { useAuthStore } from "@/store/authStore";
import { createBabysitter, fetchBabysitters } from "@/lib/airtable";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const BabysitterList = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentBabysitter, setCurrentBabysitter] = useState<Babysitter | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { user } = useAuthStore();
  const { setBabysitters } = useFamilyStore();

  const { data: babysitters = [], isLoading } = useQuery({
    queryKey: ['babysitters', user?.mobile],
    queryFn: () => fetchBabysitters(user?.mobile || ''),
    enabled: !!user?.mobile,
    onSuccess: (data) => {
      setBabysitters(data);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      if (!user?.mobile) {
        throw new Error('User not logged in');
      }

      await createBabysitter(
        formData.get("firstName") as string,
        formData.get("lastName") as string,
        formData.get("mobile") as string,
        user.mobile
      );

      queryClient.invalidateQueries({ queryKey: ['babysitters'] });
      
      toast({
        title: "Babysitter Added",
        description: "New babysitter has been added successfully."
      });
      
      setIsDialogOpen(false);
      setCurrentBabysitter(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add babysitter. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = (id: string) => {
    setBabysitters(babysitters.filter(b => b.id !== id));
    toast({
      title: "Babysitter Removed",
      description: "The babysitter has been removed successfully.",
      variant: "destructive"
    });
  };

  const handleEdit = (babysitter: Babysitter) => {
    setCurrentBabysitter(babysitter);
    setIsDialogOpen(true);
  };

  const handleContactsSelected = (newBabysitters: Babysitter[]) => {
    setBabysitters([...babysitters, ...newBabysitters]);
  };

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Babysitters</h1>
        <div className="flex gap-2">
          <ContactPickerButton onContactsSelected={handleContactsSelected} />
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Babysitter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {babysitters.map((babysitter) => (
          <BabysitterCard
            key={babysitter.id}
            babysitter={babysitter}
            onEdit={() => handleEdit(babysitter)}
            onDelete={() => handleDelete(babysitter.id)}
          />
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <BabysitterForm
          onSubmit={handleSubmit}
          currentBabysitter={currentBabysitter}
        />
      </Dialog>
    </div>
  );
};

export default BabysitterList;