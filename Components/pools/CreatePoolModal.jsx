import React, { useState } from 'react';
import { Pool } from "@/entities/Pool";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function CreatePoolModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    owner_email: '',
    address: '',
    pool_type: 'residential',
    size: '',
    service_frequency: 'weekly',
    status: 'good'
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await Pool.create(formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating pool:", error);
    }
    setSaving(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Pool</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Owner Email</Label>
            <Input
              type="email"
              value={formData.owner_email}
              onChange={(e) => setFormData({...formData, owner_email: e.target.value})}
              placeholder="owner@example.com"
              required
            />
          </div>

          <div>
            <Label>Address</Label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              placeholder="123 Main St, City"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Pool Type</Label>
              <Select
                value={formData.pool_type}
                onValueChange={(value) => setFormData({...formData, pool_type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Service Frequency</Label>
              <Select
                value={formData.service_frequency}
                onValueChange={(value) => setFormData({...formData, service_frequency: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Pool Size</Label>
            <Input
              value={formData.size}
              onChange={(e) => setFormData({...formData, size: e.target.value})}
              placeholder="e.g., 10m x 5m"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={saving}
              className="bg-gradient-to-r from-cyan-500 to-blue-600"
            >
              {saving ? 'Adding...' : 'Add Pool'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}