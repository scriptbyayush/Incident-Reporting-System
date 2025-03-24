import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  AlertTriangle, 
  BarChart3, 
  Clock, 
  MessageSquare, 
  Shield, 
  Bell
} from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-semibold">IncidentTrack</span>
            </div>
            <div>
              {user ? (
                <Button asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <div className="space-x-2">
                  <Button variant="ghost" asChild>
                    <Link href="/auth">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/auth?tab=register">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-primary-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              Quickly Report & Resolve Incidents
            </h1>
            <p className="text-lg md:text-xl mb-8">
              IncidentTrack helps your organization streamline incident management with real-time tracking, analytics, and collaborative resolution tools.
            </p>
            <Button size="lg" asChild className="bg-white text-primary-600 hover:bg-gray-100">
              <Link href="/auth">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Our platform is designed to make incident reporting and management simple and efficient
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Report Incidents</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Quickly submit detailed incident reports with evidence attachments and location data
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor incident status in real-time with automatic updates and resolution tracking
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analyze Data</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Generate comprehensive reports and analytics to improve response times and identify trends
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              IncidentTrack is packed with powerful features to help you manage incidents effectively
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex">
              <div className="flex-shrink-0 mr-4">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Different permissions for administrators, employees, and public users to ensure proper access control
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mr-4">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <Bell className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Smart Notifications</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Real-time alerts and updates on incident status changes and important developments
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mr-4">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Comprehensive dashboards and reports to analyze trends and improve response strategies
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mr-4">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Collaborative Tools</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Comment systems and assignee tracking to facilitate team collaboration on incident resolution
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="/auth">Get Started Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <AlertTriangle className="h-6 w-6 text-primary-400" />
              <span className="ml-2 text-lg font-semibold">IncidentTrack</span>
            </div>
            <div>
              <p className="text-gray-400 text-sm">
                © 2023 IncidentTrack. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
