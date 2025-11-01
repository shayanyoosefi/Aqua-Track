import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, User, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ServiceRequest } from "@/entities/ServiceRequest";
import { Button } from "@/components/ui/button";

export default function ServiceRequestsList({ requests, pools, loading, onUpdate }) {
  const getPoolInfo = (poolId) => {
    return pools.find(p => p.id === poolId);
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    assigned: 'bg-blue-100 text-blue-800 border-blue-200',
    in_progress: 'bg-green-100 text-green-800 border-green-200',
    completed: 'bg-gray-100 text-gray-800 border-gray-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200'
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700'
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    await ServiceRequest.update(requestId, { status: newStatus });
    onUpdate();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <Card className="p-12 text-center border-none shadow-lg">
        <div className="text-gray-400 mb-4">
          <Clock className="w-16 h-16 mx-auto opacity-50" />
        </div>
        <p className="text-gray-500">No service requests found</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {requests.map((request) => {
        const pool = getPoolInfo(request.pool_id);
        return (
          <Card key={request.id} className="p-6 border-none shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={statusColors[request.status]}>
                    {request.status.replace('_', ' ')}
                  </Badge>
                  <Badge className={priorityColors[request.priority]}>
                    {request.priority} priority
                  </Badge>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 capitalize">
                  {request.service_type.replace(/_/g, ' ')}
                </h3>

                <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-600">
                  {pool && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-cyan-500" />
                      <span>{pool.address}</span>
                    </div>
                  )}
                  {request.assigned_technician && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-500" />
                      <span>{request.assigned_technician}</span>
                    </div>
                  )}
                  {request.scheduled_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      <span>Scheduled: {format(new Date(request.scheduled_date), 'MMM d, yyyy')}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>Created: {format(new Date(request.created_date), 'MMM d, yyyy')}</span>
                  </div>
                </div>

                {request.description && (
                  <p className="mt-3 text-sm text-gray-600 italic">"{request.description}"</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {request.status === 'pending' && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusUpdate(request.id, 'assigned')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Assign
                  </Button>
                )}
                {request.status === 'assigned' && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusUpdate(request.id, 'in_progress')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Start
                  </Button>
                )}
                {request.status === 'in_progress' && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusUpdate(request.id, 'completed')}
                    className="bg-gray-600 hover:bg-gray-700"
                  >
                    Complete
                  </Button>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}