import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/main-layout";
import { RecentIncidentsTable } from "@/components/dashboard/recent-incidents-table";
import { CreateIncidentModal } from "@/components/incident/create-incident-modal";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";

export default function IncidentsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: incidents, isLoading } = useQuery({
    queryKey: ["/api/incidents"],
  });

  return (
    <MainLayout title="Incidents">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Manage Incidents</h1>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Incident
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <RecentIncidentsTable />
        )}
      </div>
      
      <CreateIncidentModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal} 
      />
    </MainLayout>
  );
}
