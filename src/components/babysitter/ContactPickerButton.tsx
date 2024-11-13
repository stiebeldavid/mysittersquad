import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Babysitter } from "@/types/babysitter";

// Add type definitions for the Contact Picker API
declare global {
  interface Navigator {
    contacts?: {
      select: (properties: string[], options?: { multiple?: boolean }) => Promise<any>;
    };
  }
  interface Window {
    ContactsManager?: any;
  }
}

interface ContactPickerProps {
  onContactsSelected: (contacts: Babysitter[]) => void;
}

export const ContactPickerButton = ({ onContactsSelected }: ContactPickerProps) => {
  const [isSupported, setIsSupported] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsSupported('contacts' in navigator && 'ContactsManager' in window);
  }, []);

  const handleSelectContacts = async () => {
    try {
      const properties = ['name', 'tel'];
      const contacts = await navigator.contacts?.select(properties, { multiple: true });
      
      if (!contacts) return;

      const babysitters = contacts.map((contact: any) => ({
        id: Date.now().toString() + Math.random(),
        firstName: contact.name[0]?.split(' ')[0] || '',
        lastName: contact.name[0]?.split(' ').slice(1).join(' ') || '',
        mobile: contact.tel[0] || '',
      }));

      onContactsSelected(babysitters);
      
      toast({
        title: "Contacts Added",
        description: `Successfully added ${contacts.length} contact(s) as babysitter(s).`
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to access contacts. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!isSupported) return null;

  return (
    <Button 
      onClick={handleSelectContacts}
      variant="outline"
      className="flex items-center gap-2"
    >
      <UserPlus className="w-4 h-4" />
      Add from Contacts
    </Button>
  );
};