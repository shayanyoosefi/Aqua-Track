import React, { useState, useEffect } from "react";
import { ServiceRequest, Pool, ServiceReport, User } from "@/entities/all";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function JobHistory() {
  const [user, setUser] = useState(null);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const [requests, poolsData] = await Promise.all([
        ServiceRequest.list('-completion_date'),
        Pool.list()
      ]);

      const myCompleted = requests.filter(
        r => r.assigned_technician === currentUser.email && r.status === 'completed'
      );

      setCompletedJobs(myCompleted);
      setPools(poolsData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const getPoolAddress = (poolId) => {
    const pool = pools.find(p => p.id === poolId);
    return pool?.address || 'Address not found';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Job History
        </h1>
        <p className="text-gray-600">Your completed service jobs</p>
      </div>

      {completedJobs.length === 0 ? (
        <Card className="p-12 text-center border-none shadow-lg">
          <History className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No completed jobs yet</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {completedJobs.map((job) => (
            <Card key={job.id} className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 capitalize mb-2">
                      {job.service_type.replace(/_/g, ' ')}
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-cyan-500" />
                        <span>{getPoolAddress(job.pool_id)}</span>
                      </div>
                      {job.completion_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-green-500" />
                          <span>Completed: {format(new Date(job.completion_date), 'MMM d, yyyy')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    Completed
                  </Badge>
                </div>
                {job.description && (
                  <p className="text-sm text-gray-600 mt-3 p-3 bg-gray-50 rounded">
                    {job.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}