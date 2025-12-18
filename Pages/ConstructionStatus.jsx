import React, { useState, useEffect } from "react";
import { Pool, User } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    // Optimistic UI: update only this pool locally
    setPools(prev => prev.map(p => p.id === poolId ? { ...p, construction_status: newStatus } : p));
    try {
      await Pool.update(poolId, { construction_status: newStatus });
    } catch (e) {
      // On failure, revert by reloading
      console.error('Update failed, reverting...', e);
      loadData();
    }
  };

  const handlePriceUpdate = async (poolId, newPriceRaw) => {
    const newPrice = newPriceRaw === "" ? null : Number(newPriceRaw);
    setPools(prev => prev.map(p => p.id === poolId ? { ...p, estimated_price: newPrice } : p));
    try {
      await Pool.update(poolId, { estimated_price: newPrice });
    } catch (e) {
      console.error('Price update failed, reverting...', e);
      loadData();
    }
  };

  const statusConfig = {
    not_started: { label: 'Planning', color: 'bg-gray-100 text-gray-800', icon: Package },
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
            const status = pool.construction_status || 'planning';
            const safeKey = statusConfig[status] ? status : 'planning';
            const config = statusConfig[safeKey];
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

                    <div className="pt-3 border-t border-gray-100 text-xs text-gray-500 space-y-1">
                      <p><span className="font-medium">Type:</span> {pool.pool_type || '-'}</p>
                      {pool.size && <p><span className="font-medium">Size:</span> {pool.size}</p>}
                      {pool.depth && <p><span className="font-medium">Depth:</span> {pool.depth}</p>}
                      {pool.shape && <p><span className="font-medium">Shape:</span> {pool.shape}</p>}
                      {pool.color && <p><span className="font-medium">Color:</span> {pool.color}</p>}
                      {pool.sanitization_tech && <p><span className="font-medium">Sanitization:</span> {pool.sanitization_tech}</p>}
                      {pool.notes && <p className="line-clamp-2"><span className="font-medium">Notes:</span> {pool.notes}</p>}
                    </div>

                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Estimated Price: </span>
                          {pool.estimated_price != null ? `$${pool.estimated_price.toLocaleString()}` : 'Not set'}
                        </p>
                      </div>
                      {isAdmin && (
                        <div className="mt-2">
                          <Label className="text-xs text-gray-500">Set/Update Estimate</Label>
                          <div className="flex gap-2 mt-1">
                            <Input
                              type="number"
                              placeholder="e.g., 25000"
                              defaultValue={pool.estimated_price ?? ""}
                              onBlur={(e) => handlePriceUpdate(pool.id, e.target.value)}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={(e) => {
                                const input = (e.currentTarget.previousSibling);
                                if (input && input.value !== undefined) {
                                  handlePriceUpdate(pool.id, input.value);
                                }
                              }}
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      )}
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