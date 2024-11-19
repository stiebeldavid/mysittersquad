import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Edit } from "lucide-react";
import { Kid } from "@/types/kid";

interface KidListProps {
  kids: Kid[];
  onEdit: (kid: Kid) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

export const KidList = ({ kids, onEdit, onDelete, onAddNew }: KidListProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Children</h2>
        <Button onClick={onAddNew} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Child
        </Button>
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
                    onClick={() => onEdit(kid)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(kid.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Age:</span> {kid.age}
                </p>
                {kid.allergies && (
                  <p className="text-sm">
                    <span className="font-medium">Allergies:</span> {kid.allergies}
                  </p>
                )}
                {kid.medicalInfo && (
                  <p className="text-sm">
                    <span className="font-medium">Medical Info:</span> {kid.medicalInfo}
                  </p>
                )}
                {kid.tags && kid.tags.length > 0 && (
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};