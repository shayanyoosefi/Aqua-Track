
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Droplets, ThermometerSun, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function PoolHealthAlerts({ pools }) {
  const criticalPools = pools.filter(p => p.status === 'critical');
  const needsAttention = pools.filter(p => p.status === 'needs_attention');

  const getHealthIcon = (status) => {
    if (status === 'critical') {
      return <AlertTriangle className="w-5 h-5 text-red-500" />;
    }
    return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
  };

  const alertPools = [...criticalPools, ...needsAttention].slice(0, 5);

  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-red-50 to-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          Pool Health Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alertPools.length === 0 ? (
          <div className="text-center py-6">
            <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500 opacity-50" />
            <p className="text-sm text-gray-500">All pools are in good condition</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alertPools.map((pool) => (
              <div 
                key={pool.id}
                className={`p-3 rounded-lg border ${
                  pool.status === 'critical' 
                    ? 'bg-red-100 border-red-200' 
                    : 'bg-yellow-100 border-yellow-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {getHealthIcon(pool.status)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">
                      {pool.address}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      {pool.ph_level && (
                        <div className="flex items-center gap-1">
                          <Droplets className="w-3 h-3" />
                          <span>pH: {pool.ph_level}</span>
                        </div>
                      )}
                      {pool.water_temperature && (
                        <div className="flex items-center gap-1">
                          <ThermometerSun className="w-3 h-3" />
                          <span>{pool.water_temperature}°C</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <Link to={createPageUrl("Pools")}>
          <button className="w-full mt-4 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
            View All Pools
          </button>
        </Link>
      </CardContent>
    </Card>
  );
}
