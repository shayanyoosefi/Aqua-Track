import React, { useState, useEffect } from "react";
import { ServiceRequest, Pool, ServiceReport } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Clock, DollarSign } from "lucide-react";

export default function Analytics() {
  const [requests, setRequests] = useState([]);
  const [pools, setPools] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [requestsData, poolsData, reportsData] = await Promise.all([
      ServiceRequest.list(),
      Pool.list(),
      ServiceReport.list()
    ]);
    setRequests(requestsData);
    setPools(poolsData);
    setReports(reportsData);
    setLoading(false);
  };

  const stats = {
    totalServices: requests.length,
    completedServices: requests.filter(r => r.status === 'completed').length,
    avgResponseTime: '2.5 hours',
    customerSatisfaction: '4.8/5'
  };

  const serviceTypeBreakdown = requests.reduce((acc, req) => {
    acc[req.service_type] = (acc[req.service_type] || 0) + 1;
    return acc;
  }, {});

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
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Analytics & Reports
        </h1>
        <p className="text-gray-600">Performance insights and service metrics</p>
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
                      style={{ width: `${(count / requests.length) * 100}%` }}
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
                  {pools.filter(p => p.status === 'good').length}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg">
                <span className="font-medium">Needs Attention</span>
                <span className="text-2xl font-bold text-yellow-600">
                  {pools.filter(p => p.status === 'needs_attention').length}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                <span className="font-medium">Critical</span>
                <span className="text-2xl font-bold text-red-600">
                  {pools.filter(p => p.status === 'critical').length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}