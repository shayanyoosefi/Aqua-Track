
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function ActiveServicesMap({ serviceRequests, pools }) {
  const activeServices = serviceRequests.filter(sr => 
    sr.status === 'in_progress' || sr.status === 'assigned'
  );

  const getPoolAddress = (poolId) => {
    const pool = pools.find(p => p.id === poolId);
    return pool?.address || 'Address not found';
  };

  const statusColors = {
    assigned: 'bg-blue-100 text-blue-800 border-blue-200',
    in_progress: 'bg-green-100 text-green-800 border-green-200'
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700'
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Active Services
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {activeServices.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No active services at the moment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeServices.map((service) => (
              <div 
                key={service.id}
                className="p-4 bg-gradient-to-br from-white to-cyan-50 rounded-lg border border-cyan-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={statusColors[service.status]}>
                        {service.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={priorityColors[service.priority]}>
                        {service.priority}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-gray-900 capitalize">
                      {service.service_type.replace(/_/g, ' ')}
                    </h4>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{getPoolAddress(service.pool_id)}</span>
                  </div>
                  {service.assigned_technician && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="w-4 h-4" />
                      <span>{service.assigned_technician}</span>
                    </div>
                  )}
                  {service.scheduled_date && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{format(new Date(service.scheduled_date), 'MMM d, yyyy')}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}