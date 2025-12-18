import React, { useState, useEffect } from "react";
import { ServiceRequest, Pool, User } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "../Components/common/PageHeader";

import ServiceRequestsList from "../components/requests/ServiceRequestsList";
import CreateServiceModal from "../components/requests/CreateServiceModal";

export default function ServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [pools, setPools] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [requestsData, poolsData, users] = await Promise.all([
      ServiceRequest.list('-created_date'),
      Pool.list(),
      User.list()
    ]);
    setRequests(requestsData);
    setPools(poolsData);
    setTechnicians(users.filter(u => u.role === 'technician' || u.email?.includes('tech')));
    setLoading(false);
  };

  const filteredRequests = filterStatus === 'all' 
    ? requests 
    : requests.filter(r => r.status === filterStatus);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Service Requests"
        subtitle="Manage all pool service requests"
        actions={(
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        )}
      />

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
        technicians={technicians}
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