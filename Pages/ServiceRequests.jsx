import React, { useState, useEffect } from "react";
import { ServiceRequest, Pool, User } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ServiceRequestsList from "../components/requests/ServiceRequestsList";
import CreateServiceModal from "../components/requests/CreateServiceModal";

export default function ServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [requestsData, poolsData] = await Promise.all([
      ServiceRequest.list('-created_date'),
      Pool.list()
    ]);
    setRequests(requestsData);
    setPools(poolsData);
    setLoading(false);
  };

  const filteredRequests = filterStatus === 'all' 
    ? requests 
    : requests.filter(r => r.status === filterStatus);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Service Requests
          </h1>
          <p className="text-gray-600 mt-1">Manage all pool service requests</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Request
        </Button>
      </div>

      <div className="mb-6">
        <Tabs value={filterStatus} onValueChange={setFilterStatus}>
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="assigned">Assigned</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ServiceRequestsList 
        requests={filteredRequests}
        pools={pools}
        loading={loading}
        onUpdate={loadData}
      />

      {showCreateModal && (
        <CreateServiceModal
          pools={pools}
          onClose={() => setShowCreateModal(false)}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}