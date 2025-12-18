import React, { useState, useEffect } from "react";
import { Pool, ServiceRequest, User } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ClipboardList, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import PageHeader from "../Components/common/PageHeader";

export default function RequestService() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myPool, setMyPool] = useState(null);
  const [creatingPool, setCreatingPool] = useState(false);
  const [newPool, setNewPool] = useState({
    address: '',
    pool_type: '',
    size: ''
  });
  const [formData, setFormData] = useState({
    service_type: 'cleaning',
    priority: 'medium',
    description: '',
    scheduled_date: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const pools = await Pool.list();
      const userPool = pools.find(p => p.owner_email === currentUser.email);
      setMyPool(userPool);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!myPool) return;

    setSubmitting(true);
    try {
      await ServiceRequest.create({
        pool_id: myPool.id,
        client_email: user.email,
        ...formData,
        status: 'pending'
      });
      setSubmitted(true);
      setTimeout(() => {
        navigate(createPageUrl("ClientPool"));
      }, 2000);
    } catch (error) {
      console.error("Error creating service request:", error);
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (!myPool) {
    return (
      <div className="p-4 md:p-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Register Your Pool
          </h1>
          <p className="text-gray-600">Add your pool to submit a service request.</p>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
            <CardTitle>Pool Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-5">
              <div>
                <Label>Address *</Label>
                <Input
                  className="mt-2"
                  value={newPool.address}
                  onChange={(e) => setNewPool({ ...newPool, address: e.target.value })}
                  placeholder="123 Ocean View Dr"
                  required
                />
              </div>

              <div>
                <Label>Pool Type</Label>
                <Input
                  className="mt-2"
                  value={newPool.pool_type}
                  onChange={(e) => setNewPool({ ...newPool, pool_type: e.target.value })}
                  placeholder="e.g., in-ground, above-ground"
                />
              </div>

              <div>
                <Label>Size</Label>
                <Input
                  className="mt-2"
                  value={newPool.size}
                  onChange={(e) => setNewPool({ ...newPool, size: e.target.value })}
                  placeholder="e.g., 8m x 4m"
                />
              </div>

              <div className="pt-2">
                <Button
                  onClick={async () => {
                    if (!newPool.address) return;
                    setCreatingPool(true);
                    try {
                      const created = await Pool.create({
                        ...newPool,
                        owner_email: user?.email,
                        status: 'good',
                        construction_status: 'planning'
                      });
                      setMyPool(created);
                    } catch (e) {
                      console.error('Create pool failed', e);
                    }
                    setCreatingPool(false);
                  }}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  disabled={creatingPool}
                >
                  {creatingPool ? 'Saving...' : 'Create Pool & Continue'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="p-4 md:p-8 max-w-2xl mx-auto">
        <Card className="p-12 text-center border-none shadow-lg">
          <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Request Submitted!</h2>
          <p className="text-gray-600 mb-4">
            Your service request has been received. We'll assign a technician soon.
          </p>
          <p className="text-sm text-gray-500">Redirecting to your pool dashboard...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <PageHeader
        title="Request Service"
        subtitle="Submit a service request for your pool"
      />

      <Card className="border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
          <CardTitle>New Service Request</CardTitle>
          <p className="text-sm text-cyan-50 mt-1">Pool: {myPool.address}</p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Service Type *</Label>
              <Select
                value={formData.service_type}
                onValueChange={(value) => setFormData({...formData, service_type: value})}
                required
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cleaning">Regular Cleaning</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="chemical_check">Chemical Check</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                  <SelectItem value="filter_change">Filter Change</SelectItem>
                  <SelectItem value="deep_cleaning">Deep Cleaning</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({...formData, priority: value})}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Can wait</SelectItem>
                  <SelectItem value="medium">Medium - Standard</SelectItem>
                  <SelectItem value="high">High - Important</SelectItem>
                  <SelectItem value="urgent">Urgent - Immediate attention</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Preferred Date (Optional)</Label>
              <Input
                type="date"
                className="mt-2"
                value={formData.scheduled_date}
                onChange={(e) => setFormData({...formData, scheduled_date: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                className="mt-2"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Please describe the service needed or any issues you're experiencing..."
                rows={5}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate(createPageUrl("ClientPool"))}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}