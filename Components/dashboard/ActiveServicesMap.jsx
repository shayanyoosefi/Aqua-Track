
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
    assigned: 'border border-blue-200 bg-blue-50 text-blue-600',
    in_progress: 'border border-emerald-200 bg-emerald-50 text-emerald-600'
  };

  const priorityColors = {
    low: 'border border-slate-200 bg-slate-50 text-slate-600',
    medium: 'border border-amber-200 bg-amber-50 text-amber-600',
    high: 'border border-orange-200 bg-orange-50 text-orange-600',
    urgent: 'border border-rose-200 bg-rose-50 text-rose-600'
  };

  return (
    <Card className="overflow-hidden rounded-3xl border border-slate-100 bg-white/95 shadow-sm backdrop-blur">
      <CardHeader className="flex flex-col gap-2 pb-5">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white">
            <MapPin className="h-4 w-4" />
          </span>
          Active Services
        </CardTitle>
        <p className="text-sm text-slate-500">
          Live view of in-progress and assigned service visits.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeServices.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-100 bg-slate-50 py-10 text-center text-slate-500">
            <MapPin className="mb-3 h-10 w-10 text-slate-300" />
            <p className="text-sm font-medium">No active services right now</p>
            <p className="mt-1 text-xs text-slate-400">Upcoming assignments will appear here once scheduled.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeServices.map((service) => (
              <div
                key={service.id}
                className="group rounded-3xl border border-cyan-100 bg-gradient-to-br from-white via-white to-cyan-50/40 p-5 shadow-sm transition-all hover:-translate-y-[2px] hover:border-cyan-200 hover:shadow-md"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={`${statusColors[service.status]} uppercase tracking-[0.2em] text-[0.65rem]`}> 
                    {service.status.replace('_', ' ')}
                  </Badge>
                  <Badge className={`${priorityColors[service.priority]} uppercase tracking-[0.2em] text-[0.65rem]`}>
                    {service.priority}
                  </Badge>
                </div>

                <div className="mt-4 space-y-3">
                  <h4 className="text-lg font-semibold capitalize text-slate-900">
                    {service.service_type.replace(/_/g, ' ')}
                  </h4>
                  <div className="grid gap-2 text-sm text-slate-600">
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-[2px] h-4 w-4 text-cyan-500" />
                      <span>{getPoolAddress(service.pool_id)}</span>
                    </div>
                    {service.assigned_technician && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-cyan-500" />
                        <span>{service.assigned_technician}</span>
                      </div>
                    )}
                    {service.scheduled_date && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-cyan-500" />
                        <span>{format(new Date(service.scheduled_date), 'MMM d, yyyy')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}