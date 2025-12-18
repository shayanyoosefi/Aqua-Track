import React, { useState, useEffect } from "react";
import { TechnicianFeedback, ServiceRequest, User } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function TechnicianFeedbackPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [rateableServices, setRateableServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    rating: 0,
    professionalism: 0,
    quality_of_work: 0,
    timeliness: 0,
    communication: 0,
    feedback_text: '',
    would_recommend: null
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const [requests, existingFeedbacks] = await Promise.all([
        ServiceRequest.list('-completion_date', 100),
        TechnicianFeedback.list()
      ]);
      const alreadyRatedIds = new Set(existingFeedbacks.map(f => f.service_request_id));
      const userRateable = requests.filter(r =>
        r.client_email === currentUser.email &&
        ['completed','in_progress','assigned'].includes(r.status) &&
        r.assigned_technician &&
        !alreadyRatedIds.has(r.id)
      );
      setRateableServices(userRateable);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedService || formData.rating === 0) return;

    setSubmitting(true);
    try {
      await TechnicianFeedback.create({
        technician_email: selectedService.assigned_technician,
        client_email: user.email,
        service_request_id: selectedService.id,
        rating: formData.rating,
        feedback_text: formData.feedback_text,
        categories: {
          professionalism: formData.professionalism,
          quality_of_work: formData.quality_of_work,
          timeliness: formData.timeliness,
          communication: formData.communication
        },
        would_recommend: formData.would_recommend
      });

      alert('Thank you for your feedback!');
      navigate(createPageUrl("ClientPool"));
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert('Failed to submit feedback. Please try again.');
    }
    setSubmitting(false);
  };

  const StarRating = ({ value, onChange, label }) => {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= value
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (rateableServices.length === 0) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <Card className="p-12 text-center border-none shadow-lg">
          <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Services to Rate</h2>
          <p className="text-gray-600">
            We couldn’t find any assigned/in‑progress/completed services without feedback.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Rate Your Technician
        </h1>
        <p className="text-gray-600">Share your experience with our service team</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Service Selection */}
        <Card className="lg:col-span-1 border-none shadow-lg">
          <CardHeader>
            <CardTitle>Select Service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rateableServices.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    selectedService?.id === service.id
                      ? 'border-cyan-500 bg-cyan-50'
                      : 'border-gray-200 hover:border-cyan-300'
                  }`}
                >
                  <p className="font-semibold text-sm capitalize">
                    {service.service_type.replace(/_/g, ' ')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {service.assigned_technician}
                  </p>
                  {service.completion_date && (
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(service.completion_date).toLocaleDateString()}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Feedback Form */}
        <Card className="lg:col-span-2 border-none shadow-lg">
          <CardHeader>
            <CardTitle>Your Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedService ? (
              <div className="text-center py-12 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Please select a service to rate</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Selected Technician & Service Info */}
                <div className="rounded-xl border border-gray-100 bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-gray-500">Service</p>
                      <p className="font-semibold capitalize">{selectedService.service_type.replace(/_/g, ' ')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Technician</p>
                      <p className="font-semibold">{selectedService.assigned_technician}</p>
                    </div>
                    {selectedService.completion_date && (
                      <div>
                        <p className="text-sm text-gray-500">Completed</p>
                        <p className="font-semibold">{new Date(selectedService.completion_date).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Overall Rating */}
                <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg">
                  <StarRating
                    label="Overall Rating *"
                    value={formData.rating}
                    onChange={(value) => setFormData({...formData, rating: value})}
                  />
                </div>

                {/* Detailed Ratings */}
                <div className="grid md:grid-cols-2 gap-6">
                  <StarRating
                    label="Professionalism"
                    value={formData.professionalism}
                    onChange={(value) => setFormData({...formData, professionalism: value})}
                  />
                  <StarRating
                    label="Quality of Work"
                    value={formData.quality_of_work}
                    onChange={(value) => setFormData({...formData, quality_of_work: value})}
                  />
                  <StarRating
                    label="Timeliness"
                    value={formData.timeliness}
                    onChange={(value) => setFormData({...formData, timeliness: value})}
                  />
                  <StarRating
                    label="Communication"
                    value={formData.communication}
                    onChange={(value) => setFormData({...formData, communication: value})}
                  />
                </div>

                {/* Would Recommend */}
                <div>
                  <Label>Would you recommend this technician?</Label>
                  <div className="flex gap-4 mt-2">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, would_recommend: true})}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                        formData.would_recommend === true
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <ThumbsUp className={`w-6 h-6 mx-auto ${
                        formData.would_recommend === true ? 'text-green-600' : 'text-gray-400'
                      }`} />
                      <p className="text-sm font-medium mt-2">Yes</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, would_recommend: false})}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                        formData.would_recommend === false
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-red-300'
                      }`}
                    >
                      <ThumbsDown className={`w-6 h-6 mx-auto ${
                        formData.would_recommend === false ? 'text-red-600' : 'text-gray-400'
                      }`} />
                      <p className="text-sm font-medium mt-2">No</p>
                    </button>
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <Label>Your Comments *</Label>
                  <Textarea
                    className="mt-2"
                    rows={6}
                    value={formData.feedback_text}
                    onChange={(e) => setFormData({...formData, feedback_text: e.target.value})}
                    placeholder="Please share your experience with this technician..."
                    required
                  />
                </div>

                {/* Submit Button */}
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
                    disabled={submitting || formData.rating === 0 || !formData.feedback_text}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  >
                    {submitting ? 'Submitting...' : 'Submit Feedback'}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}