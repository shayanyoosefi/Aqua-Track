import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pool, User } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle } from "lucide-react";
import { createPageUrl } from "@/utils";
import PageHeader from "../Components/common/PageHeader";

export default function RequestConstruction() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    address: "",
    pool_type: "in-ground",
    size: "",
    depth: "",
    color: "blue",
    sanitization_tech: "chlorine",
    shape: "rectangle",
    notes: ""
  });

  useEffect(() => {
    (async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (e) {
        console.error("Load user failed", e);
      }
      setLoading(false);
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.address) return;
    setSubmitting(true);
    try {
      await Pool.create({
        ...formData,
        owner_email: user?.email,
        status: "good",
        construction_status: "planning",
        estimated_price: null
      });
      setSubmitted(true);
      setTimeout(() => {
        navigate(createPageUrl("ClientPool"));
      }, 1400);
    } catch (err) {
      console.error("Create construction request failed", err);
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

  if (submitted) {
    return (
      <div className="p-4 md:p-8 max-w-2xl mx-auto">
        <Card className="p-12 text-center border-none shadow-lg">
          <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Construction Request Sent!</h2>
          <p className="text-gray-600 mb-4">
            Your pool build request has been submitted. Our team will review and provide a price estimate.
          </p>
          <p className="text-sm text-gray-500">Redirecting to your pool...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <PageHeader
        title="Request Pool Construction"
        subtitle="Submit specifications for a new pool build"
      />

      <Card className="border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
          <CardTitle>New Construction Request</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Address *</Label>
              <Input
                className="mt-2"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="789 Blue Lagoon Rd"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Pool Type</Label>
                <Select
                  value={formData.pool_type}
                  onValueChange={(value) => setFormData({ ...formData, pool_type: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-ground">In-ground</SelectItem>
                    <SelectItem value="above-ground">Above-ground</SelectItem>
                    <SelectItem value="fiberglass">Fiberglass</SelectItem>
                    <SelectItem value="concrete">Concrete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Shape</Label>
                <Select
                  value={formData.shape}
                  onValueChange={(value) => setFormData({ ...formData, shape: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rectangle">Rectangle</SelectItem>
                    <SelectItem value="kidney">Kidney</SelectItem>
                    <SelectItem value="round">Round</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Size (L × W)</Label>
                <Input
                  className="mt-2"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  placeholder="8m × 4m"
                />
              </div>
              <div>
                <Label>Depth</Label>
                <Input
                  className="mt-2"
                  value={formData.depth}
                  onChange={(e) => setFormData({ ...formData, depth: e.target.value })}
                  placeholder="1.6m"
                />
              </div>
              <div>
                <Label>Color</Label>
                <Select
                  value={formData.color}
                  onValueChange={(value) => setFormData({ ...formData, color: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="teal">Teal</SelectItem>
                    <SelectItem value="sand">Sand</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Sanitization Technology</Label>
                <Select
                  value={formData.sanitization_tech}
                  onValueChange={(value) => setFormData({ ...formData, sanitization_tech: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chlorine">Chlorine</SelectItem>
                    <SelectItem value="saltwater">Saltwater</SelectItem>
                    <SelectItem value="uv">UV</SelectItem>
                    <SelectItem value="ozone">Ozone</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Additional Notes</Label>
                <Textarea
                  className="mt-2"
                  rows={4}
                  placeholder="E.g., heating, lights, spa section, decking..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="w-full md:flex-1"
                onClick={() => navigate(createPageUrl("ClientPool"))}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full md:flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 whitespace-normal text-center"
              >
                {submitting ? "Submitting..." : "Submit Construction Request"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


