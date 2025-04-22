import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Incident } from "@shared/schema";

const statusColorMap: Record<string, string> = {
  pending: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  in_progress: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  closed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  reopened: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
};

const priorityColorMap: Record<string, string> = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
};

function formatDate(dateString: string | Date) {
  return new Date(dateString).toISOString().split('T')[0];
}

export function RecentIncidentsTable() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("7");
  const { toast } = useToast();

  const { data: incidents, isLoading } = useQuery<Incident[]>({
    queryKey: ["/api/incidents"],
  });

  const filteredIncidents = incidents?.filter(incident => {
    // Status filter
    if (statusFilter !== "all" && incident.status !== statusFilter) {
      return false;
    }
    
    // Time filter
    const daysAgo = parseInt(timeFilter);
    const timeLimit = new Date();
    timeLimit.setDate(timeLimit.getDate() - daysAgo);
    
    return new Date(incident.createdAt) >= timeLimit;
  });

  const assignIncidentMutation = useMutation({
    mutationFn: async ({ id, userId }: { id: number; userId: number }) => {
      const res = await apiRequest("PUT", `/api/incidents/${id}`, {
        assignedTo: userId,
        status: "in_progress"
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/incidents"] });
      toast({
        title: "Incident assigned",
        description: "The incident has been assigned successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to assign incident",
        variant: "destructive",
      });
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Incidents</CardTitle>
          <CardDescription>Latest reported issues</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <CardTitle>Recent Incidents</CardTitle>
          <CardDescription>Latest reported issues</CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select defaultValue={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Reported By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredIncidents && filteredIncidents.length > 0 ? (
              filteredIncidents.slice(0, 5).map((incident) => (
                <TableRow key={incident.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <TableCell className="font-medium">INC-{incident.id.toString().padStart(4, '0')}</TableCell>
                  <TableCell>{incident.title}</TableCell>
                  <TableCell className="text-gray-500 dark:text-gray-400">User #{incident.reportedBy}</TableCell>
                  <TableCell>
                    <Badge className={statusColorMap[incident.status]}>
                      {incident.status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={priorityColorMap[incident.priority]}>
                      {incident.priority.replace(/\b\w/g, c => c.toUpperCase())}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500 dark:text-gray-400">
                    {formatDate(incident.createdAt)}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => assignIncidentMutation.mutate({ id: incident.id, userId: 1 })}
                    >
                      Will Assign
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No incidents found matching your filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="py-2 px-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">...</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </Card>
  );
}
