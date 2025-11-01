import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Droplets, ThermometerSun, Calendar, Edit } from "lucide-react";
import { format } from "date-fns";

import EditPoolsParametersModal from "./EditPoolsParametersModal";

export default function PoolsGrid({ pools, loading, onUpdate }) {
  const [editingPool, setEditingPool] = useState(null);

  const statusColors = {
    good: 'bg-green-100 text-green-800 border-green-200',
    needs_attention: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    critical: 'bg-red-100 text-red-800 border-red-200'
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (pools.length === 0) {
    return (
      <Card className="p-12 text-center border-none shadow-lg">
        <div className="text-gray-400 mb-4">
          <Droplets className="w-16 h-16 mx-auto opacity-50" />
        </div>
        <p className="text-gray-500">No pools registered yet</p>
      </Card>
    );
  }

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pools.map((pool) => (
          <Card key={pool.id} className="border-none shadow-lg hover:shadow-xl transition-all overflow-hidden">
            <div className={`h-2 ${
              pool.status === 'good' ? 'bg-green-500' :
              pool.status === 'needs_attention' ? 'bg-yellow-500' :
              'bg-red-500'
            }`} />
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-cyan-500" />
                    <h3 className="font-semibold text-gray-900 truncate">{pool.address}</h3>
                  </div>
                  <Badge className={statusColors[pool.status]}>
                    {pool.status.replace('_', ' ')}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingPool(pool)}
                  className="text-gray-400 hover:text-cyan-600"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-2 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
                    <ThermometerSun className="w-4 h-4 text-orange-500" />
                    <div>
                      <p className="text-xs text-gray-600">Temperature</p>
                      <p className="font-semibold text-sm">
                        {pool.water_temperature ? `${pool.water_temperature}°C` : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="text-xs text-gray-600">pH Level</p>
                      <p className="font-semibold text-sm">{pool.ph_level || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {pool.chlorine_level !== null && pool.chlorine_level !== undefined && (
                  <div className="flex items-center justify-between p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                    <span className="text-xs text-gray-600">Chlorine</span>
                    <span className="font-semibold text-sm">{pool.chlorine_level} ppm</span>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {pool.last_service_date ? (
                      <span>Last service: {format(new Date(pool.last_service_date), 'MMM d, yyyy')}</span>
                    ) : (
                      <span>No service history</span>
                    )}
                  </div>
                  {pool.next_service_date && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>Next: {format(new Date(pool.next_service_date), 'MMM d, yyyy')}</span>
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                  <p>Owner: {pool.owner_email}</p>
                  <p className="capitalize">Type: {pool.pool_type} • {pool.service_frequency}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingPool && (
        <EditPoolsParametersModal
          pool={editingPool}
          onClose={() => setEditingPool(null)}
          onSuccess={() => {
            setEditingPool(null);
            onUpdate();
          }}
        />
      )}
    </>
  );
}