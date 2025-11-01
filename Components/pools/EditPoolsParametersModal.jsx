import React, { useState } from 'react';
import { Pool } from "@/entities/Pool";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Droplets, ThermometerSun, Activity } from "lucide-react";

export default function EditPoolParametersModal({ pool, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    water_temperature: pool.water_temperature || '',
    ph_level: pool.ph_level || '',
    chlorine_level: pool.chlorine_level || '',
    status: pool.status || 'good'
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updateData = {
        water_temperature: formData.water_temperature ? parseFloat(formData.water_temperature) : null,
        ph_level: formData.ph_level ? parseFloat(formData.ph_level) : null,
        chlorine_level: formData.chlorine_level ? parseFloat(formData.chlorine_level) : null,
        status: formData.status
      };
      
      await Pool.update(pool.id, updateData);
      onSuccess();
    } catch (error) {
      console.error("Error updating pool parameters:", error);
    }
    setSaving(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Pool Parameters</DialogTitle>
          <p className="text-sm text-gray-500 mt-1">{pool.address}</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="flex items-center gap-2">
              <ThermometerSun className="w-4 h-4 text-orange-500" />
              Water Temperature (°C)
            </Label>
            <Input
              type="number"
              step="0.1"
              value={formData.water_temperature}
              onChange={(e) => setFormData({...formData, water_temperature: e.target.value})}
              placeholder="e.g., 28.5"
              className="mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">Typical range: 25-30°C</p>
          </div>

          <div>
            <Label className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-500" />
              pH Level
            </Label>
            <Input
              type="number"
              step="0.1"
              value={formData.ph_level}
              onChange={(e) => setFormData({...formData, ph_level: e.target.value})}
              placeholder="e.g., 7.4"
              className="mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">Ideal range: 7.2-7.6</p>
          </div>

          <div>
            <Label className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-green-500" />
              Chlorine Level (ppm)
            </Label>
            <Input
              type="number"
              step="0.1"
              value={formData.chlorine_level}
              onChange={(e) => setFormData({...formData, chlorine_level: e.target.value})}
              placeholder="e.g., 2.5"
              className="mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">Ideal range: 1-3 ppm</p>
          </div>

          <div>
            <Label className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-500" />
              Pool Status
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({...formData, status: value})}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="good">Good Condition</SelectItem>
                <SelectItem value="needs_attention">Needs Attention</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
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
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}