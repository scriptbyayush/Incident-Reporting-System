import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  AlertTriangle,
  BarChart3,
  UserCircle,
  PlusCircle
} from "lucide-react";
import { useState } from "react";
import { CreateIncidentModal } from "@/components/incident/create-incident-modal";

export default function MobileNav() {
  const [location] = useLocation();
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3 z-10">
        <div className="flex justify-around">
          <Link href="/dashboard" className={`flex flex-col items-center ${location === "/dashboard" ? "text-primary-600 dark:text-primary-400" : "text-gray-500 dark:text-gray-400"}`}>
            <LayoutDashboard className="h-6 w-6" />
            <span className="text-xs mt-1">Dashboard</span>
          </Link>
          
          <Link href="/incidents" className={`flex flex-col items-center ${location === "/incidents" ? "text-primary-600 dark:text-primary-400" : "text-gray-500 dark:text-gray-400"}`}>
            <AlertTriangle className="h-6 w-6" />
            <span className="text-xs mt-1">Incidents</span>
          </Link>
          
          <button 
            type="button" 
            className="flex flex-col items-center bg-primary-600 text-white rounded-full w-16 h-16 flex items-center justify-center -mt-8"
            onClick={() => setShowCreateModal(true)}
          >
            <PlusCircle className="h-8 w-8" />
          </button>
          
          <Link href="/reports" className={`flex flex-col items-center ${location === "/reports" ? "text-primary-600 dark:text-primary-400" : "text-gray-500 dark:text-gray-400"}`}>
            <BarChart3 className="h-6 w-6" />
            <span className="text-xs mt-1">Reports</span>
          </Link>
          
          <Link href="/profile" className={`flex flex-col items-center ${location === "/profile" ? "text-primary-600 dark:text-primary-400" : "text-gray-500 dark:text-gray-400"}`}>
            <UserCircle className="h-6 w-6" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </nav>

      {/* Create Incident Modal */}
      <CreateIncidentModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal} 
      />
    </>
  );
}
