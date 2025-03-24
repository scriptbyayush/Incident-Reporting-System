import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/main-layout";
import { IncidentsChart } from "@/components/dashboard/incidents-chart";
import { IncidentTypesChart } from "@/components/dashboard/incident-types-chart";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, Download, CalendarDays } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("30");
  const [reportType, setReportType] = useState("incidents");
  
  const { data: statsData, isLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  const handleExport = () => {
    // In a real implementation, this would generate and download a report
    alert("This would download a report in a production environment");
  };

  if (isLoading) {
    return (
      <MainLayout title="Reports">
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Reports & Analytics">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Reports & Analytics</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Analyze incident data and export detailed reports
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <IncidentsChart data={statsData?.trends || { weeks: [], newIncidents: [], resolvedIncidents: [] }} />
              <IncidentTypesChart data={statsData?.typeDistribution || {}} />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Incident Summary</CardTitle>
                <CardDescription>Overview of incident status distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                    <p className="text-2xl font-semibold">{statsData?.overview.total || 0}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                    <p className="text-2xl font-semibold">{statsData?.overview.pending || 0}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
                    <p className="text-2xl font-semibold">{statsData?.overview.inProgress || 0}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Resolved</p>
                    <p className="text-2xl font-semibold">{statsData?.overview.resolved || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trends" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Incident Trends Over Time</CardTitle>
                <CardDescription>
                  Analysis of incident reporting and resolution patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  This section would contain more detailed trend analysis including seasonal variations,
                  day-of-week patterns, and response time metrics.
                </p>
                <div className="h-[400px] flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-gray-400">Advanced trend analysis charts would appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Response Performance</CardTitle>
                <CardDescription>
                  Metrics on incident response time and resolution efficiency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  This section would display key performance indicators such as average time to first response,
                  average resolution time, and efficiency metrics by team or individual.
                </p>
                <div className="h-[400px] flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-gray-400">Performance metrics and team comparisons would appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
