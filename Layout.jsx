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
        { title: "Request Construction", url: createPageUrl("RequestConstruction"), icon: Package },
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

      <header className="sticky top-0 z-50 border-b border-cyan-100/70 bg-white/85 backdrop-blur">
        <div className="relative mx-auto grid w-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 justify-self-start">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-sm shadow-cyan-500/30">
              <Waves className="h-6 w-6" />
            </div>
            <div className="leading-tight">
              <div className="text-slate-900">
                <p className="text-lg font-semibold leading-5">Absolute</p>
                <p className="text-lg font-semibold leading-5">Pools</p>
              </div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-600">Service Platform</p>
            </div>
          </div>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center justify-center gap-1.5 rounded-full border border-cyan-100/70 bg-white px-1.5 py-1 shadow-sm shadow-cyan-100/40 md:flex">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`group flex h-11 items-center gap-2 rounded-full px-3 text-sm font-medium transition-all ${
                    isActive
                      ? 'border border-cyan-200 bg-cyan-50 text-cyan-700 shadow-sm shadow-cyan-100'
                      : 'border border-transparent text-slate-600 hover:bg-slate-50 hover:text-cyan-700 hover:border-cyan-200'
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0 text-current" />
                  <span className="whitespace-nowrap leading-5">
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 justify-self-end">
            <div className="hidden items-center gap-3 rounded-2xl border border-cyan-100/80 bg-cyan-50/60 px-3 py-2 transition-all md:flex">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-sm font-semibold">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-slate-900">{user?.full_name}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-600">{user?.role}</p>
              </div>
            </div>

            {user?.role === 'pool_owner' && (
              <Link
                to="/login"
                className="hidden items-center gap-2 rounded-md border border-cyan-200 px-3 py-2 text-sm font-medium text-cyan-700 hover:bg-cyan-50 md:flex"
              >
                Login
              </Link>
            )}

            <Button
              variant="outline"
              onClick={handleLogout}
              className="hidden items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 md:flex"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-cyan-100/60 bg-white/95 shadow-lg shadow-cyan-100/50 md:hidden">
            <nav className="flex flex-col divide-y divide-cyan-100/70">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-5 py-4 text-sm font-medium transition-colors ${
                    location.pathname === item.url
                      ? 'bg-cyan-50 text-cyan-700'
                      : 'text-slate-600 hover:bg-cyan-50 hover:text-cyan-600'
                  }`}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                    <item.icon className="h-4 w-4" />
                  </span>
                  {item.title}
                </Link>
              ))}
              {user?.role === 'pool_owner' && (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-5 py-4 text-sm font-medium text-cyan-700 hover:bg-cyan-50"
                >
                  Login
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-3 px-5 py-4 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <LogOut className="h-4 w-4" />
                </span>
                Logout
              </button>
            </nav>
          </div>
        )}
      </header>

      <main className="min-h-[calc(100vh-5rem)]">
        {children}
      </main>
    </div>
  );
}