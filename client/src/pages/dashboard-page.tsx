import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/main-layout";
import { OverviewCard } from "@/components/dashboard/overview-card";
import { IncidentsChart } from "@/components/dashboard/incidents-chart";
import { IncidentTypesChart } from "@/components/dashboard/incident-types-chart";
import { RecentIncidentsTable } from "@/components/dashboard/recent-incidents-table";
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  AlertOctagon 
} from "lucide-react";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { data: statsData, isLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  if (isLoading) {
    return (
      <MainLayout title="Dashboard">
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Dashboard">
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <OverviewCard
            title="Total Incidents"
            value={statsData?.overview.total || 0}
            percentChange={12.8}
            icon={<AlertTriangle />}
            iconBgClass="bg-primary-100 dark:bg-primary-900"
            iconTextClass="text-primary-600 dark:text-primary-400"
          />
          
          <OverviewCard
            title="Pending"
            value={statsData?.overview.pending || 0}
            percentChange={-3.5}
            icon={<Clock />}
            iconBgClass="bg-amber-100 dark:bg-amber-900/20"
            iconTextClass="text-amber-600 dark:text-amber-400"
          />
          
          <OverviewCard
            title="Resolved"
            value={statsData?.overview.resolved || 0}
            percentChange={18.2}
            icon={<CheckCircle />}
            iconBgClass="bg-green-100 dark:bg-green-900/20"
            iconTextClass="text-green-600 dark:text-green-400"
          />
          
          <OverviewCard
            title="Urgent"
            value={statsData?.overview.urgent || 0}
            percentChange={-5.1}
            icon={<AlertOctagon />}
            iconBgClass="bg-red-100 dark:bg-red-900/20"
            iconTextClass="text-red-600 dark:text-red-400"
          />
        </div>
        
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IncidentsChart data={statsData?.trends || { weeks: [], newIncidents: [], resolvedIncidents: [] }} />
          <IncidentTypesChart data={statsData?.typeDistribution || {}} />
        </div>
        
        {/* Recent Incidents Table */}
        <RecentIncidentsTable />
      </div>
    </MainLayout>
  );
}
