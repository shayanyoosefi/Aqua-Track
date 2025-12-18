import React, { useState, useEffect } from "react";
import { Pool, ServiceRequest, User } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Waves, ClipboardList, Users, AlertTriangle, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import StatsOverview from "../Components/dashboard/StatsOverview";
import ActiveServicesMap from "../Components/dashboard/ActiveServicesMap";
import RecentActivity from "../Components/dashboard/RecentActivity";
import PoolHealthAlerts from "../Components/dashboard/PoorHealthAlerts";

export default function Dashboard() {
  const [pools, setPools] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);

      const [poolsData, requestsData, usersData] = await Promise.all([
        Pool.list('-updated_date'),
        ServiceRequest.list('-created_date', 50),
        User.list()
      ]);
      
      setPools(poolsData);
      setServiceRequests(requestsData);
      setTechnicians(usersData.filter(u => u.email?.includes('tech') || u.role === 'technician'));
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setLoading(false);
  };

  const stats = {
    totalPools: pools.length,
    activeServices: serviceRequests.filter(sr => sr.status === 'in_progress').length,
    pendingRequests: serviceRequests.filter(sr => sr.status === 'pending').length,
    availableTechs: technicians.filter(t => t.status === 'available').length,
    poolsNeedingAttention: pools.filter(p => p.status === 'needs_attention' || p.status === 'critical').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  const spotlightMetrics = [
    {
      label: "Active services",
      value: stats.activeServices,
      badgeClasses: "border border-emerald-200/60 bg-emerald-50/60 text-emerald-600"
    },
    {
      label: "Pending requests",
      value: stats.pendingRequests,
      badgeClasses: "border border-amber-200/60 bg-amber-50/60 text-amber-600"
    },
    {
      label: "Pools needing attention",
      value: stats.poolsNeedingAttention,
      badgeClasses: "border border-rose-200/60 bg-rose-50/70 text-rose-600"
    }
  ];

  const quickLinks = [
    {
      title: "Service Requests",
      description: "Track and prioritise incoming work",
      to: createPageUrl("ServiceRequests"),
      icon: ClipboardList
    },
    {
      title: "Technician Jobs",
      description: "Assign or review technicians",
      to: createPageUrl("TechnicianJobs"),
      icon: Users
    },
    {
      title: "Pools",
      description: "Monitor pool inventory and status",
      to: createPageUrl("Pools"),
      icon: Waves
    }
  ];

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 lg:px-10 xl:px-12">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
        <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 text-white shadow-xl shadow-cyan-900/30">
          <div className="absolute -left-12 top-10 h-36 w-36 rounded-full bg-cyan-400/30 blur-3xl" />
          <div className="absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-indigo-500/40 blur-3xl" />
          <div className="relative flex h-full flex-col justify-between gap-8 p-6 sm:p-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
                Dashboard
              </span>
              <div>
                <h1 className="text-3xl font-semibold sm:text-4xl">
                  Welcome back, {currentUser?.full_name || "User"}
                </h1>
                <p className="mt-3 max-w-xl text-sm text-white/80 sm:text-base">
                  Monitor service performance, technician load, and pool health from a single, polished overview.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {spotlightMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-white/25 bg-white/10 px-4 py-4 backdrop-blur-sm"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 rounded-3xl border border-cyan-100/60 bg-white/90 p-6 shadow-xl shadow-cyan-100/40 backdrop-blur">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-xl font-semibold">
              {currentUser?.full_name?.charAt(0) || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-base font-semibold text-slate-900">
                {currentUser?.full_name || "Admin user"}
              </p>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-600">
                {currentUser?.role || "administrator"}
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.title}
                to={link.to}
                className="group flex items-center gap-4 rounded-2xl border border-cyan-100/70 bg-white px-4 py-3 transition-all hover:-translate-y-[2px] hover:border-cyan-200 hover:shadow-md"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100 text-cyan-700">
                  <link.icon className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">{link.title}</p>
                  <p className="text-xs text-slate-500">{link.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-cyan-500 transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
            <Button
              onClick={() => User.logout()}
              variant="outline"
              className="mt-1 rounded-2xl border-red-200 text-red-600 hover:bg-red-50"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <section className="mt-10 space-y-8">
        <StatsOverview stats={stats} />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)]">
          <div className="space-y-6">
            <ActiveServicesMap serviceRequests={serviceRequests} pools={pools} />
            <RecentActivity serviceRequests={serviceRequests} pools={pools} />
          </div>
          <div className="space-y-6">
            <PoolHealthAlerts pools={pools} />

            <Card className="overflow-hidden rounded-3xl border border-slate-100 bg-white/90 shadow-sm backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
                  <Users className="h-5 w-5 text-cyan-600" />
                  Technician Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {technicians.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 py-8 text-center text-slate-500">
                    <Users className="mb-3 h-10 w-10 text-slate-300" />
                    <p className="text-sm font-medium">No technicians available</p>
                    <p className="mt-1 text-xs text-slate-400">
                      New technicians will appear here as they join the schedule.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {technicians.slice(0, 5).map((tech) => (
                        <div
                          key={tech.id}
                          className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white px-3 py-3 shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-sm font-semibold">
                              {tech.full_name?.charAt(0) || "T"}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-900 truncate">{tech.full_name}</p>
                              <p className="text-xs text-slate-500 truncate">{tech.technician_zone || "All zones"}</p>
                            </div>
                          </div>
                          <span
                            className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${
                              tech.status === "available"
                                ? "bg-emerald-50 text-emerald-600"
                                : tech.status === "busy"
                                ? "bg-amber-50 text-amber-600"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {tech.status || "available"}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Link
                      to={createPageUrl("Technicians")}
                      className="group flex items-center justify-center gap-2 rounded-2xl border border-cyan-100 bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-cyan-200/40"
                    >
                      View all technicians
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}