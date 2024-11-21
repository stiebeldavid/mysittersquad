import { useState } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { BabysitterForm } from "@/components/babysitter/BabysitterForm";
import { BabysitterCard } from "@/components/babysitter/BabysitterCard";
import { AddBabysitterCard } from "@/components/babysitter/AddBabysitterCard";
import { Babysitter } from "@/types/babysitter";
import { useAuthStore } from "@/store/authStore";
import { createBabysitter, updateBabysitter, fetchBabysitters, deleteBabysitter } from "@/lib/airtable";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const BabysitterList = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentBabysitter, setCurrentBabysitter] = useState<Babysitter | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const { data: babysitters = [], isLoading, error } = useQuery({
    queryKey: ['babysitters', user?.mobile],
    queryFn: () => {
      if (!user?.mobile) {
        return [];
      }
      return fetchBabysitters(user.mobile);
    },
    enabled: !!user?.mobile,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      if (!user?.mobile) {
        throw new Error('User not logged in');
      }

      if (currentBabysitter) {
        await updateBabysitter(
          currentBabysitter.id,
          formData.get("firstName") as string,
          formData.get("lastName") as string,
          formData.get("mobile") as string,
          formData.get("age") as string,
          formData.get("grade") as string,
          formData.get("rate") as string,
          formData.get("specialties") as string,
          formData.get("notes") as string,
          formData.get("email") as string
        );
        toast({
          title: "Babysitter Updated",
          description: "Babysitter has been updated successfully."
        });
      } else {
        await createBabysitter(
          formData.get("firstName") as string,
          formData.get("lastName") as string,
          formData.get("mobile") as string,
          user.mobile,
          formData.get("age") as string,
          formData.get("grade") as string,
          formData.get("rate") as string,
          formData.get("specialties") as string,
          formData.get("notes") as string,
          formData.get("email") as string
        );
        toast({
          title: "Babysitter Added",
          description: "New babysitter has been added successfully."
        });
      }

      queryClient.invalidateQueries({ queryKey: ['babysitters'] });
      setIsDialogOpen(false);
      setCurrentBabysitter(null);
    } catch (error) {
      toast({
        title: "Error",
        description: currentBabysitter 
          ? "Failed to update babysitter. Please try again."
          : "Failed to add babysitter. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBabysitter(id);
      queryClient.invalidateQueries({ queryKey: ['babysitters'] });
      toast({
        title: "Babysitter Deleted",
        description: "The babysitter has been removed successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete babysitter. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (babysitter: Babysitter) => {
    setCurrentBabysitter(babysitter);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setCurrentBabysitter(null);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon"
          asChild
        >
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Babysitters</h1>
        <div className="flex gap-2 ml-auto">
          <Button onClick={handleAdd} className="whitespace-nowrap">
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {babysitters.map((babysitter) => (
          <BabysitterCard
            key={babysitter.id}
            babysitter={babysitter}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
        <AddBabysitterCard onClick={handleAdd} />
      </div>

      <Dialog 
        open={isDialogOpen} 
        onOpenChange={(open) => {
          if (!open) {
            setCurrentBabysitter(null);
          }
          setIsDialogOpen(open);
        }}
      >
        <BabysitterForm
          onSubmit={handleSubmit}
          currentBabysitter={currentBabysitter}
        />
      </Dialog>
    </div>
  );
};

export default BabysitterList;