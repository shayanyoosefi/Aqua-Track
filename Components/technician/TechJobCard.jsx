import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Calendar, Play, CheckCircle } from "lucide-react";
import { format } from "date-fns";

export default function TechJobCard({ job, pool, onStart, onComplete }) {
  const priorityColors = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700'
  };

  return (
    <Card className="p-6 border-none shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Badge className={priorityColors[job.priority]}>
              {job.priority} priority
            </Badge>
            <Badge variant="outline" className="capitalize">
              {job.status.replace('_', ' ')}
            </Badge>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-4 capitalize">
            {job.service_type.replace(/_/g, ' ')}
          </h3>

          {pool && (
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg">
                <MapPin className="w-5 h-5 text-cyan-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{pool.address}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {pool.pool_type} pool • {pool.size || 'Size not specified'}
                  </p>
                </div>
              </div>

              {job.scheduled_date && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    Scheduled: {format(new Date(job.scheduled_date), 'EEEE, MMM d, yyyy')}
                  </span>
                </div>
              )}

              {job.estimated_duration && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    Estimated time: {job.estimated_duration} hours
                  </span>
                </div>
              )}
            </div>
          )}

          {job.description && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Notes:</span> {job.description}
              </p>
            </div>
          )}
        </div>

        <div className="flex md:flex-col gap-2">
          {job.status === 'assigned' && (
            <Button
              onClick={onStart}
              className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Start Job
            </Button>
          )}
          {job.status === 'in_progress' && (
            <Button
              onClick={onComplete}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Complete
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}