import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

interface EmergencyContactsProps {
  contacts: EmergencyContact[];
  onContactsChange: (contacts: EmergencyContact[]) => void;
}

export const EmergencyContacts = ({ contacts, onContactsChange }: EmergencyContactsProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newContact, setNewContact] = useState<Partial<EmergencyContact>>({});

  const handleAdd = () => {
    if (newContact.name && newContact.phone && newContact.relation) {
      onContactsChange([
        ...contacts,
        { ...newContact, id: Date.now().toString() } as EmergencyContact,
      ]);
      setNewContact({});
      setIsAdding(false);
    }
  };

  const handleDelete = (id: string) => {
    onContactsChange(contacts.filter((contact) => contact.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Emergency Contacts</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <div className="space-y-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newContact.name || ""}
                onChange={(e) =>
                  setNewContact({ ...newContact, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={newContact.phone || ""}
                onChange={(e) =>
                  setNewContact({ ...newContact, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="relation">Relation</Label>
              <Input
                id="relation"
                value={newContact.relation || ""}
                onChange={(e) =>
                  setNewContact({ ...newContact, relation: e.target.value })
                }
              />
            </div>
            <Button onClick={handleAdd}>Save Contact</Button>
          </div>
        )}
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="flex justify-between items-center p-2 border rounded"
            >
              <div>
                <p className="font-medium">{contact.name}</p>
                <p className="text-sm text-gray-600">{contact.phone}</p>
                <p className="text-sm text-gray-600">{contact.relation}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(contact.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};