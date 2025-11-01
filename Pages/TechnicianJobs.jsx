import React, { useState, useEffect } from "react";
import { ServiceRequest, Pool, User, ServiceReport } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, MapPin, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

import TechJobCard from "../components/technician/TechJobCard";
import CompleteJobModal from "../components/technician/CompleteJobModal";

export default function TechnicianJobs() {
  const [user, setUser] = useState(null);
  const [myJobs, setMyJobs] = useState([]);
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const [allRequests, poolsData] = await Promise.all([
        ServiceRequest.list('-created_date'),
        Pool.list()
      ]);

      const myRequests = allRequests.filter(
        r => r.assigned_technician === currentUser.email && 
        (r.status === 'assigned' || r.status === 'in_progress')
      );
      
      setMyJobs(myRequests);
      setPools(poolsData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const handleStartJob = async (jobId) => {
    await ServiceRequest.update(jobId, { status: 'in_progress' });
    loadData();
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
          My Jobs
        </h1>
        <p className="text-gray-600">Today's scheduled pool services</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card className="border-none shadow-lg bg-gradient-to-br from-cyan-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Jobs</p>
                <p className="text-3xl font-bold text-cyan-600">{myJobs.length}</p>
              </div>
              <Wrench className="w-10 h-10 text-cyan-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">In Progress</p>
                <p className="text-3xl font-bold text-green-600">
                  {myJobs.filter(j => j.status === 'in_progress').length}
                </p>
              </div>
              <Clock className="w-10 h-10 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Assigned</p>
                <p className="text-3xl font-bold text-purple-600">
                  {myJobs.filter(j => j.status === 'assigned').length}
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-purple-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {myJobs.length === 0 ? (
        <Card className="p-12 text-center border-none shadow-lg">
          <Wrench className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No jobs assigned yet</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {myJobs.map((job) => (
            <TechJobCard
              key={job.id}
              job={job}
              pool={pools.find(p => p.id === job.pool_id)}
              onStart={() => handleStartJob(job.id)}
              onComplete={() => setSelectedJob(job)}
            />
          ))}
        </div>
      )}

      {selectedJob && (
        <CompleteJobModal
          job={selectedJob}
          pool={pools.find(p => p.id === selectedJob.pool_id)}
          onClose={() => setSelectedJob(null)}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}