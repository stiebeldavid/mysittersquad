```tsx
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchBabysitters } from "@/lib/airtable";
import { useAuthStore } from "@/store/authStore";
import { useFamilyStore } from "@/store/familyStore";
import AddBabysitterForm from "@/components/AddBabysitterForm";

const BabysitterList = () => {
  const user = useAuthStore((state) => state.user);
  const setBabysitters = useFamilyStore((state) => state.setBabysitters);
  const [showForm, setShowForm] = useState(false);

  const { data: babysitters } = useQuery({
    queryKey: ['babysitters', user?.mobile],
    queryFn: () => fetchBabysitters(user?.mobile || ''),
    enabled: !!user?.mobile,
  });

  useEffect(() => {
    if (babysitters) {
      setBabysitters(babysitters);
    }
  }, [babysitters, setBabysitters]);

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Your Babysitters</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Babysitter
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {babysitters?.map((babysitter) => (
          <Link key={babysitter.id} to={`/request/${babysitter.id}`}>
            <Card className="cursor-pointer card-hover">
              <CardHeader>
                <CardTitle>
                  {babysitter.firstName} {babysitter.lastName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">{babysitter.mobile}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {babysitters?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No babysitters added yet.</p>
          <p className="text-gray-500">Add your first babysitter to get started!</p>
        </div>
      )}

      <AddBabysitterForm open={showForm} onClose={() => setShowForm(false)} />
    </div>
  );
};

export default BabysitterList;
```