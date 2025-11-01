import React, { useState, useEffect } from "react";
import { Pool, User } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Factory, CheckCircle, Truck, Home, MapPin } from "lucide-react";

export default function ConstructionStatus() {
  const [pools, setPools] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);

      const poolsData = await Pool.list('-updated_date');
      setPools(poolsData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (poolId, newStatus) => {
    await Pool.update(poolId, { construction_status: newStatus });
    loadData();
  };

  const statusConfig = {
    planning: { label: 'Planning', color: 'bg-gray-100 text-gray-800', icon: Package },
    in_factory: { label: 'In Factory', color: 'bg-blue-100 text-blue-800', icon: Factory },
    manufacturing: { label: 'Manufacturing', color: 'bg-indigo-100 text-indigo-800', icon: Factory },
    quality_check: { label: 'Quality Check', color: 'bg-purple-100 text-purple-800', icon: CheckCircle },
    ready_for_delivery: { label: 'Ready for Delivery', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    in_transit: { label: 'In Transit', color: 'bg-yellow-100 text-yellow-800', icon: Truck },
    delivered: { label: 'Delivered', color: 'bg-teal-100 text-teal-800', icon: Home },
    installed: { label: 'Installed', color: 'bg-cyan-100 text-cyan-800', icon: Home },
    operational: { label: 'Operational', color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle }
  };

  const filteredPools = filterStatus === 'all' 
    ? pools 
    : pools.filter(p => p.construction_status === filterStatus);

  const isAdmin = currentUser?.role === 'admin';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Construction & Delivery Status
        </h1>
        <p className="text-gray-600">Track pool construction and delivery progress</p>
      </div>

      {/* Status Filter */}
      <Card className="mb-6 border-none shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Filter by status:</span>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="in_factory">In Factory</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="quality_check">Quality Check</SelectItem>
                <SelectItem value="ready_for_delivery">Ready for Delivery</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="installed">Installed</SelectItem>
                <SelectItem value="operational">Operational</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {Object.entries(statusConfig).map(([key, config]) => {
          const count = pools.filter(p => p.construction_status === key).length;
          const Icon = config.icon;
          return (
            <Card key={key} className="border-none shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-8 h-8 text-gray-400" />
                  <span className="text-2xl font-bold text-gray-900">{count}</span>
                </div>
                <p className="text-sm font-medium text-gray-600">{config.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pools List */}
      {filteredPools.length === 0 ? (
        <Card className="p-12 text-center border-none shadow-lg">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No pools found with this status</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPools.map((pool) => {
            const status = pool.construction_status || 'operational';
            const config = statusConfig[status];
            const Icon = config.icon;

            return (
              <Card key={pool.id} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-cyan-500" />
                        <h3 className="font-semibold text-gray-900 truncate">{pool.address}</h3>
                      </div>
                      <p className="text-sm text-gray-500">{pool.owner_email}</p>
                    </div>
                    <Icon className="w-8 h-8 text-gray-400" />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Current Status</p>
                      <Badge className={`${config.color} text-sm`}>
                        {config.label}
                      </Badge>
                    </div>

                    {isAdmin && (
                      <div>
                        <p className="text-xs text-gray-500 mb-2">Update Status</p>
                        <Select
                          value={status}
                          onValueChange={(value) => handleStatusUpdate(pool.id, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="planning">Planning</SelectItem>
                            <SelectItem value="in_factory">In Factory</SelectItem>
                            <SelectItem value="manufacturing">Manufacturing</SelectItem>
                            <SelectItem value="quality_check">Quality Check</SelectItem>
                            <SelectItem value="ready_for_delivery">Ready for Delivery</SelectItem>
                            <SelectItem value="in_transit">In Transit</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="installed">Installed</SelectItem>
                            <SelectItem value="operational">Operational</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="pt-3 border-t border-gray-100 text-xs text-gray-500">
                      <p><span className="font-medium">Type:</span> {pool.pool_type}</p>
                      {pool.size && <p><span className="font-medium">Size:</span> {pool.size}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}