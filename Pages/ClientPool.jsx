import React, { useState, useEffect } from "react";
import { ServiceRequest, Pool, ServiceReport, User } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Clock, DollarSign, MapPin, Package, Factory, CheckCircle, Truck, Home, LogOut } from "lucide-react";

export default function ClientPool() {
  const [currentUser, setCurrentUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [pools, setPools] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [user, requestsData, poolsData, reportsData] = await Promise.all([
      User.me(),
      ServiceRequest.list(),
      Pool.list(),
      ServiceReport.list()
    ]);
    setCurrentUser(user);
    setRequests(requestsData);
    setPools(poolsData);
    setReports(reportsData);
    setLoading(false);
  };

  const myPools = currentUser ? pools.filter(p => p.owner_email === currentUser.email) : [];
  const myPoolIds = new Set(myPools.map(p => p.id));
  const myRequests = requests.filter(r => myPoolIds.has(r.pool_id));

  const stats = {
    totalServices: myRequests.length,
    completedServices: myRequests.filter(r => r.status === 'completed').length,
    avgResponseTime: '2.5 hours',
    customerSatisfaction: '4.8/5'
  };

  const serviceTypeBreakdown = myRequests.reduce((acc, req) => {
    acc[req.service_type] = (acc[req.service_type] || 0) + 1;
    return acc;
  }, {});

  const statusConfig = {
    planning: { label: 'Planning', icon: Package, color: 'bg-gray-100 text-gray-800' },
    in_factory: { label: 'In Factory', icon: Factory, color: 'bg-blue-100 text-blue-800' },
    manufacturing: { label: 'Manufacturing', icon: Factory, color: 'bg-indigo-100 text-indigo-800' },
    quality_check: { label: 'Quality Check', icon: CheckCircle, color: 'bg-purple-100 text-purple-800' },
    ready_for_delivery: { label: 'Ready for Delivery', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
    in_transit: { label: 'In Transit', icon: Truck, color: 'bg-yellow-100 text-yellow-800' },
    delivered: { label: 'Delivered', icon: Home, color: 'bg-teal-100 text-teal-800' },
    installed: { label: 'Installed', icon: Home, color: 'bg-cyan-100 text-cyan-800' },
    operational: { label: 'Operational', icon: CheckCircle, color: 'bg-emerald-100 text-emerald-800' },
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
            My Pool
          </h1>
          <p className="text-gray-600">Overview of your pools, construction status and service history</p>
        </div>
        <Button
          onClick={() => User.logout()}
          variant="outline"
          className="hidden md:inline-flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-10 h-10 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalServices}</p>
            <p className="text-sm text-gray-600">Total Services</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-10 h-10 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.completedServices}</p>
            <p className="text-sm text-gray-600">Completed</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-10 h-10 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.avgResponseTime}</p>
            <p className="text-sm text-gray-600">Avg Response Time</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-10 h-10 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.customerSatisfaction}</p>
            <p className="text-sm text-gray-600">Satisfaction</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>Service Type Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(serviceTypeBreakdown).map(([type, count]) => (
                <div key={type}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium capitalize">{type.replace(/_/g, ' ')}</span>
                    <span className="text-sm text-gray-600">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(count / Math.max(1, myRequests.length)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>Pool Health Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <span className="font-medium">Good Condition</span>
                <span className="text-2xl font-bold text-green-600">
                  {myPools.filter(p => p.status === 'good').length}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg">
                <span className="font-medium">Needs Attention</span>
                <span className="text-2xl font-bold text-yellow-600">
                  {myPools.filter(p => p.status === 'needs_attention').length}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                <span className="font-medium">Critical</span>
                <span className="text-2xl font-bold text-red-600">
                  {myPools.filter(p => p.status === 'critical').length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Pools & Construction Status */}
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myPools.map((pool) => {
          const statusKey = pool.construction_status || 'planning';
          const meta = statusConfig[statusKey] || statusConfig['planning'];
          const Icon = meta.icon;
          return (
            <Card key={pool.id} className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="w-4 h-4 text-cyan-600" />
                  {pool.address}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500">Owner</span><div className="font-medium">{pool.owner_email}</div></div>
                  {pool.pool_type && (<div><span className="text-gray-500">Type</span><div className="font-medium">{pool.pool_type}</div></div>)}
                  {pool.size && (<div><span className="text-gray-500">Size</span><div className="font-medium">{pool.size}</div></div>)}
                  {pool.water_temperature !== undefined && (<div><span className="text-gray-500">Water Temp</span><div className="font-medium">{pool.water_temperature}°C</div></div>)}
                  {pool.ph_level !== undefined && (<div><span className="text-gray-500">pH</span><div className="font-medium">{pool.ph_level}</div></div>)}
                </div>

                <div>
                  <p className="mb-2 text-xs text-gray-500">Construction Status</p>
                  <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${meta.color}`}>
                    <Icon className="w-4 h-4" />
                    {meta.label}
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <p className="mb-1 text-xs text-gray-500">Estimated Price</p>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium">
                      {pool.estimated_price != null ? `$${pool.estimated_price.toLocaleString()}` : 'Awaiting estimate'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}