import React, { useState, useEffect } from "react";
import { Pool, ServiceRequest, ServiceReport, User } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, Calendar, User as UserIcon, FileText } from "lucide-react";
import { format } from "date-fns";
import PageHeader from "../Components/common/PageHeader";

export default function ServiceHistory() {
  const [user, setUser] = useState(null);
  const [myPool, setMyPool] = useState(null);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [serviceReports, setServiceReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const [pools, requests, reports] = await Promise.all([
        Pool.list(),
        ServiceRequest.list('-created_date'),
        ServiceReport.list('-created_date')
      ]);

      const userPool = pools.find(p => p.owner_email === currentUser.email);
      setMyPool(userPool);

      if (userPool) {
        const poolRequests = requests.filter(r => r.pool_id === userPool.id);
        setServiceRequests(poolRequests);

        const poolReports = reports.filter(r => r.pool_id === userPool.id);
        setServiceReports(poolReports);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    assigned: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <PageHeader
        title="Service History"
        subtitle="All service requests and reports for your pool"
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Service Requests */}
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Service Requests
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {serviceRequests.length === 0 ? (
              <div className="text-center py-8">
                <History className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">No service requests yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {serviceRequests.map((request) => (
                  <div key={request.id} className="p-4 bg-gradient-to-r from-white to-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 capitalize">
                          {request.service_type.replace(/_/g, ' ')}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {format(new Date(request.created_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <Badge className={statusColors[request.status]}>
                        {request.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    {request.description && (
                      <p className="text-sm text-gray-600 mb-2">"{request.description}"</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {request.scheduled_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(request.scheduled_date), 'MMM d')}
                        </span>
                      )}
                      {request.assigned_technician && (
                        <span className="flex items-center gap-1">
                          <UserIcon className="w-3 h-3" />
                          {request.assigned_technician.split('@')[0]}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Service Reports */}
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Service Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {serviceReports.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">No service reports yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {serviceReports.map((report) => (
                  <div key={report.id} className="p-4 bg-gradient-to-r from-white to-indigo-50 rounded-lg border border-indigo-100">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {format(new Date(report.created_date), 'MMM d, yyyy')}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          by {report.technician_email?.split('@')[0] || 'Technician'}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{report.work_performed}</p>
                    
                    {report.water_test_results && (
                      <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                        {report.water_test_results.ph && (
                          <div className="p-2 bg-blue-50 rounded">
                            <span className="text-gray-600">pH:</span>
                            <span className="font-semibold ml-1">{report.water_test_results.ph}</span>
                          </div>
                        )}
                        {report.water_test_results.chlorine && (
                          <div className="p-2 bg-green-50 rounded">
                            <span className="text-gray-600">Cl:</span>
                            <span className="font-semibold ml-1">{report.water_test_results.chlorine}</span>
                          </div>
                        )}
                        {report.water_test_results.temperature && (
                          <div className="p-2 bg-orange-50 rounded">
                            <span className="text-gray-600">Temp:</span>
                            <span className="font-semibold ml-1">{report.water_test_results.temperature}°C</span>
                          </div>
                        )}
                      </div>
                    )}

                    {report.after_photos && report.after_photos.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {report.after_photos.slice(0, 3).map((photo, idx) => (
                          <img
                            key={idx}
                            src={photo}
                            alt="Service photo"
                            className="w-full h-20 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}