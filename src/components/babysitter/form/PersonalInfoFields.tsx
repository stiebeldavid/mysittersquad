import { Input } from "@/components/ui/input";

interface PersonalInfoFieldsProps {
  currentBabysitter?: {
    age?: string | number;
    grade?: string;
    rate?: string | number;
    specialties?: string;
    notes?: string;
  } | null;
}

export const PersonalInfoFields = ({ currentBabysitter }: PersonalInfoFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="age">Age</label>
          <Input
            id="age"
            name="age"
            type="number"
            defaultValue={currentBabysitter?.age}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="grade">Grade/Year</label>
          <Input
            id="grade"
            name="grade"
            defaultValue={currentBabysitter?.grade}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="rate">Rate ($/hr)</label>
        <Input
          id="rate"
          name="rate"
          type="number"
          step="0.01"
          defaultValue={currentBabysitter?.rate}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="specialties">Specialties</label>
        <Input
          id="specialties"
          name="specialties"
          defaultValue={currentBabysitter?.specialties}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="notes">Notes</label>
        <Input
          id="notes"
          name="notes"
          defaultValue={currentBabysitter?.notes}
        />
      </div>
    </>
  );
};