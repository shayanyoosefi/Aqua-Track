import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import {
  Waves,
  LayoutDashboard,
  ClipboardList,
  Wrench,
  Users,
  BarChart3,
  LogOut,
  Menu,
  X,
  Home,
  History,
  Package,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      // Redirect clients to My Pool page if they try to access Dashboard
      if (currentUser.role !== 'admin' && 
          !currentUser.email?.includes('tech') && 
          location.pathname === createPageUrl("Dashboard")) {
        navigate(createPageUrl("ClientPool"));
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await User.logout();
  };

  const getNavigationItems = () => {
    if (!user) return [];
    
    const role = user.role;
    
    // Admin and Service Manager - Full access
    if (role === 'admin') {
      return [
        { title: "Dashboard", url: createPageUrl("Dashboard"), icon: LayoutDashboard },
        { title: "Service Requests", url: createPageUrl("ServiceRequests"), icon: ClipboardList },
        { title: "Pools", url: createPageUrl("Pools"), icon: Waves },
        { title: "Construction Status", url: createPageUrl("ConstructionStatus"), icon: Package },
        { title: "Technician Jobs", url: createPageUrl("TechnicianJobs"), icon: Wrench },
        { title: "Technicians", url: createPageUrl("Technicians"), icon: Users },
        { title: "Feedback", url: createPageUrl("FeedbackReview"), icon: MessageSquare },
        { title: "Analytics", url: createPageUrl("Analytics"), icon: BarChart3 }
      ];
    } 
    // Technician - Job focused view
    else if (user.email?.includes('tech') || role === 'technician') {
      return [
        { title: "My Jobs", url: createPageUrl("TechnicianJobs"), icon: Wrench },
        { title: "Job History", url: createPageUrl("JobHistory"), icon: History }
      ];
    } 
    // Client - Pool owner view
    else {
      return [
        { title: "My Pool", url: createPageUrl("ClientPool"), icon: Home },
        { title: "Request Service", url: createPageUrl("RequestService"), icon: ClipboardList },
        { title: "Service History", url: createPageUrl("ServiceHistory"), icon: History },
        { title: "Rate Technician", url: createPageUrl("TechnicianFeedback"), icon: MessageSquare }
      ];
    }
  };

  const navigationItems = getNavigationItems();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50">
      <style>{`
        :root {
          --primary: 200 100% 45%;
          --primary-foreground: 0 0% 100%;
          --accent: 190 95% 50%;
        }
      `}</style>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-cyan-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Waves className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Absolute Pools
                </h1>
                <p className="text-xs text-gray-500">Service Platform</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    location.pathname === item.url
                      ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                      : 'text-gray-700 hover:bg-cyan-50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-100">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.full_name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{user?.full_name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="hidden md:flex text-gray-500 hover:text-red-600"
              >
                <LogOut className="w-5 h-5" />
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-cyan-100">
              <nav className="flex flex-col gap-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.title}
                    to={item.url}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      location.pathname === item.url
                        ? 'bg-cyan-500 text-white'
                        : 'text-gray-700 hover:bg-cyan-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </div>
  );
}