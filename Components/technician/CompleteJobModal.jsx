import React, { useState } from 'react';
import { ServiceRequest, ServiceReport, Pool } from "@/entities/all";
import { User } from "@/entities/User";
import { UploadFile } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Camera, Upload } from "lucide-react";

export default function CompleteJobModal({ job, pool, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    work_performed: '',
    issues_found: '',
    recommendations: '',
    water_test_results: {
      ph: pool?.ph_level || '',
      chlorine: pool?.chlorine_level || '',
      temperature: pool?.water_temperature || ''
    }
  });
  const [beforePhotos, setBeforePhotos] = useState([]);
  const [afterPhotos, setAfterPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handlePhotoUpload = async (files, type) => {
    setUploading(true);
    const uploadedUrls = [];
    
    for (const file of files) {
      try {
        const { file_url } = await UploadFile({ file });
        uploadedUrls.push(file_url);
      } catch (error) {
        console.error("Error uploading photo:", error);
      }
    }
    
    if (type === 'before') {
      setBeforePhotos([...beforePhotos, ...uploadedUrls]);
    } else {
      setAfterPhotos([...afterPhotos, ...uploadedUrls]);
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const user = await User.me();
      
      await ServiceReport.create({
        service_request_id: job.id,
        pool_id: job.pool_id,
        technician_email: user.email,
        work_performed: formData.work_performed,
        issues_found: formData.issues_found,
        recommendations: formData.recommendations,
        water_test_results: formData.water_test_results,
        before_photos: beforePhotos,
        after_photos: afterPhotos,
        time_started: job.updated_date,
        time_completed: new Date().toISOString()
      });

      await ServiceRequest.update(job.id, {
        status: 'completed',
        completion_date: new Date().toISOString()
      });

      await Pool.update(job.pool_id, {
        ph_level: parseFloat(formData.water_test_results.ph) || pool.ph_level,
        chlorine_level: parseFloat(formData.water_test_results.chlorine) || pool.chlorine_level,
        water_temperature: parseFloat(formData.water_test_results.temperature) || pool.water_temperature,
        last_service_date: new Date().toISOString().split('T')[0],
        status: 'good'
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error completing job:", error);
    }
    setSaving(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Service Report</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>Work Performed *</Label>
            <Textarea
              value={formData.work_performed}
              onChange={(e) => setFormData({...formData, work_performed: e.target.value})}
              placeholder="Describe the work completed..."
              rows={4}
              required
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label>pH Level</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.water_test_results.ph}
                onChange={(e) => setFormData({
                  ...formData,
                  water_test_results: {...formData.water_test_results, ph: e.target.value}
                })}
              />
            </div>
            <div>
              <Label>Chlorine (ppm)</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.water_test_results.chlorine}
                onChange={(e) => setFormData({
                  ...formData,
                  water_test_results: {...formData.water_test_results, chlorine: e.target.value}
                })}
              />
            </div>
            <div>
              <Label>Temperature (°C)</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.water_test_results.temperature}
                onChange={(e) => setFormData({
                  ...formData,
                  water_test_results: {...formData.water_test_results, temperature: e.target.value}
                })}
              />
            </div>
          </div>

          <div>
            <Label>Before Photos</Label>
            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handlePhotoUpload(Array.from(e.target.files), 'before')}
                className="hidden"
                id="before-photos"
              />
              <label htmlFor="before-photos">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-cyan-500 transition-colors">
                  <Camera className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Upload before photos</p>
                </div>
              </label>
              {beforePhotos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {beforePhotos.map((url, idx) => (
                    <img key={idx} src={url} alt="Before" className="w-full h-20 object-cover rounded" />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <Label>After Photos</Label>
            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handlePhotoUpload(Array.from(e.target.files), 'after')}
                className="hidden"
                id="after-photos"
              />
              <label htmlFor="after-photos">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-cyan-500 transition-colors">
                  <Camera className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Upload after photos</p>
                </div>
              </label>
              {afterPhotos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {afterPhotos.map((url, idx) => (
                    <img key={idx} src={url} alt="After" className="w-full h-20 object-cover rounded" />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <Label>Issues Found</Label>
            <Textarea
              value={formData.issues_found}
              onChange={(e) => setFormData({...formData, issues_found: e.target.value})}
              placeholder="Any issues or concerns discovered..."
              rows={3}
            />
          </div>

          <div>
            <Label>Recommendations</Label>
            <Textarea
              value={formData.recommendations}
              onChange={(e) => setFormData({...formData, recommendations: e.target.value})}
              placeholder="Future maintenance recommendations..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={saving || uploading || !formData.work_performed}
              className="bg-gradient-to-r from-cyan-500 to-blue-600"
            >
              {saving ? 'Submitting...' : 'Complete Service'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}