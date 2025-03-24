import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { DarkModeToggle } from "@/components/dark-mode-toggle";
import { AvatarWithFallback } from "@/components/ui/avatar-with-fallback";
import { 
  LayoutDashboard,
  FileText,
  BarChart3,
  Users,
  Settings,
  AlertTriangle
} from "lucide-react";

export default function Sidebar() {
  const { user } = useAuth();
  const [location] = useLocation();

  if (!user) return null;

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, current: location === "/dashboard" },
    { name: "Incidents", href: "/incidents", icon: AlertTriangle, current: location === "/incidents" },
    { name: "Reports", href: "/reports", icon: BarChart3, current: location === "/reports" },
    { name: "Team", href: "/team", icon: Users, current: location === "/team" },
    { name: "Settings", href: "/settings", icon: Settings, current: location === "/settings" },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-200">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <AlertTriangle className="h-8 w-8 text-primary-600" />
          <span className="ml-2 text-xl font-semibold">IncidentTrack</span>
        </div>
      </div>
      
      {/* User Profile */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <AvatarWithFallback user={user} className="h-10 w-10" />
          <div className="ml-3">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => (
          <Link 
            key={item.name} 
            href={item.href}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
              item.current
                ? "text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-300"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            }`}
          >
            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
            {item.name}
          </Link>
        ))}
      </nav>
      
      {/* Dark Mode Toggle */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <DarkModeToggle />
      </div>
    </aside>
  );
}
