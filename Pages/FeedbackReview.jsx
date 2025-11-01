import React, { useState, useEffect } from "react";
import { TechnicianFeedback, User } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";

export default function FeedbackReview() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTech, setSelectedTech] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [feedbackData, usersData] = await Promise.all([
        TechnicianFeedback.list('-created_date'),
        User.list()
      ]);

      setFeedbacks(feedbackData);
      const techs = usersData.filter(u => u.email?.includes('tech') || u.role === 'technician');
      setTechnicians(techs);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const filteredFeedbacks = selectedTech === 'all'
    ? feedbacks
    : feedbacks.filter(f => f.technician_email === selectedTech);

  const getTechnicianStats = (techEmail) => {
    const techFeedbacks = feedbacks.filter(f => f.technician_email === techEmail);
    if (techFeedbacks.length === 0) return null;

    const avgRating = techFeedbacks.reduce((sum, f) => sum + f.rating, 0) / techFeedbacks.length;
    const recommendCount = techFeedbacks.filter(f => f.would_recommend).length;
    const recommendPercent = (recommendCount / techFeedbacks.length) * 100;

    return {
      count: techFeedbacks.length,
      avgRating: avgRating.toFixed(1),
      recommendPercent: recommendPercent.toFixed(0)
    };
  };

  const StarDisplay = ({ rating }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
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

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Technician Feedback
        </h1>
        <p className="text-gray-600">Customer reviews and ratings</p>
      </div>

      {/* Technician Stats Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {technicians.map((tech) => {
          const stats = getTechnicianStats(tech.email);
          if (!stats) return null;

          return (
            <Card
              key={tech.id}
              className={`border-none shadow-lg cursor-pointer transition-all ${
                selectedTech === tech.email ? 'ring-2 ring-cyan-500' : ''
              }`}
              onClick={() => setSelectedTech(selectedTech === tech.email ? 'all' : tech.email)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {tech.full_name?.charAt(0) || 'T'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{tech.full_name}</h3>
                      <p className="text-sm text-gray-500">{tech.email}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Average Rating</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900">{stats.avgRating}</span>
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Would Recommend</span>
                    <span className="text-2xl font-bold text-green-600">{stats.recommendPercent}%</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Total Reviews</span>
                    <span className="text-2xl font-bold text-blue-600">{stats.count}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Feedback List */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Customer Reviews</span>
            {selectedTech !== 'all' && (
              <button
                onClick={() => setSelectedTech('all')}
                className="text-sm font-normal text-cyan-600 hover:text-cyan-700"
              >
                View All
              </button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredFeedbacks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No feedback available</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredFeedbacks.map((feedback) => (
                <div key={feedback.id} className="p-6 bg-gradient-to-r from-white to-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <StarDisplay rating={feedback.rating} />
                        <Badge className="bg-gray-100 text-gray-700">
                          {feedback.rating} stars
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Technician: <span className="font-medium">{feedback.technician_email}</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Client: {feedback.client_email}
                      </p>
                    </div>
                    <div className="text-right">
                      {feedback.would_recommend !== null && (
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${
                          feedback.would_recommend
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {feedback.would_recommend ? (
                            <>
                              <ThumbsUp className="w-4 h-4" />
                              <span className="text-xs font-medium">Recommended</span>
                            </>
                          ) : (
                            <>
                              <ThumbsDown className="w-4 h-4" />
                              <span className="text-xs font-medium">Not Recommended</span>
                            </>
                          )}
                        </div>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(feedback.created_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 italic">"{feedback.feedback_text}"</p>

                  {feedback.categories && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                      {feedback.categories.professionalism > 0 && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Professionalism</p>
                          <StarDisplay rating={feedback.categories.professionalism} />
                        </div>
                      )}
                      {feedback.categories.quality_of_work > 0 && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Quality</p>
                          <StarDisplay rating={feedback.categories.quality_of_work} />
                        </div>
                      )}
                      {feedback.categories.timeliness > 0 && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Timeliness</p>
                          <StarDisplay rating={feedback.categories.timeliness} />
                        </div>
                      )}
                      {feedback.categories.communication > 0 && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Communication</p>
                          <StarDisplay rating={feedback.categories.communication} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}