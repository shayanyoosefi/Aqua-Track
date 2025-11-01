import React, { useState, useEffect } from "react";
import { Pool, ServiceRequest, User } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Waves, ClipboardList, Users, AlertTriangle, TrendingUp } from "lucide-react";
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

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back, {currentUser?.full_name || 'User'}! Real-time overview of all pool service operations
        </p>
      </div>

      <StatsOverview stats={stats} />

      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 space-y-6">
          <ActiveServicesMap serviceRequests={serviceRequests} pools={pools} />
          <RecentActivity serviceRequests={serviceRequests} pools={pools} />
        </div>
        
        <div className="space-y-6">
          <PoolHealthAlerts pools={pools} />
          
          <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-blue-600" />
                Technician Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {technicians.length === 0 ? (
                <div className="text-center py-6">
                  <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm text-gray-500">No technicians available</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {technicians.slice(0, 5).map((tech) => (
                      <div key={tech.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {tech.full_name?.charAt(0) || 'T'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{tech.full_name}</p>
                            <p className="text-xs text-gray-500">{tech.technician_zone || 'All zones'}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tech.status === 'available' ? 'bg-green-100 text-green-700' :
                          tech.status === 'busy' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {tech.status || 'available'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Link to={createPageUrl("Technicians")}>
                    <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      View All Technicians
                    </button>
                  </Link>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}