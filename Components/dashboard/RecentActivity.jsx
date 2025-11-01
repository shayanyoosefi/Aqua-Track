import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function RecentActivity({ serviceRequests, pools }) {
  const recentRequests = serviceRequests.slice(0, 8);

  const getPoolAddress = (poolId) => {
    const pool = pools.find(p => p.id === poolId);
    return pool?.address || 'Address not found';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    assigned: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-600" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentRequests.map((request) => (
            <div 
              key={request.id}
              className="flex items-center gap-4 p-3 bg-gradient-to-r from-white to-gray-50 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow"
            >
              {getStatusIcon(request.status)}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate capitalize">
                  {request.service_type.replace(/_/g, ' ')}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {getPoolAddress(request.pool_id)}
                </p>
              </div>
              <Badge className={`${statusColors[request.status]} text-xs`}>
                {request.status}
              </Badge>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {format(new Date(request.created_date), 'MMM d')}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}