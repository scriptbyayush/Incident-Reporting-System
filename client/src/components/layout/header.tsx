import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { AvatarWithFallback } from "@/components/ui/avatar-with-fallback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Menu, 
  Search, 
  Bell,
  AlertTriangle
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateIncidentModal } from "@/components/incident/create-incident-modal";

type HeaderProps = {
  onOpenMobileMenu: () => void;
  title: string;
};

export default function Header({ onOpenMobileMenu, title }: HeaderProps) {
  const { user, logoutMutation } = useAuth();
  const [location, navigate] = useLocation();
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (!user) return null;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button 
            type="button" 
            className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            onClick={onOpenMobileMenu}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          {/* Mobile Logo */}
          <div className="md:hidden flex items-center">
            <AlertTriangle className="h-8 w-8 text-primary-600" />
            <span className="ml-2 text-xl font-semibold">IncidentTrack</span>
          </div>
          
          {/* Page Title (Desktop) */}
          <h1 className="text-xl font-semibold hidden md:block">{title}</h1>
          
          {/* Right Side Items */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 w-64"
              />
              <div className="absolute left-3 top-2.5">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            {/* Create New Button */}
            <Button onClick={() => setShowCreateModal(true)}>
              New Incident
            </Button>
            
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-destructive"></span>
            </Button>
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0">
                  <AvatarWithFallback user={user} className="h-8 w-8" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Create Incident Modal */}
      <CreateIncidentModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal} 
      />
    </header>
  );
}
