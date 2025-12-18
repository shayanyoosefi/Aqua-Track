export function createPageUrl(pageName) {
  const routes = {
    'Dashboard': '/dashboard',
    'ServiceRequests': '/service-requests',
    'Pools': '/pools',
    'ConstructionStatus': '/construction-status',
    'RequestConstruction': '/request-construction',
    'TechnicianJobs': '/technician-jobs',
    'Technicians': '/technicians',
    'FeedbackReview': '/feedback-review',
    'Analytics': '/analytics',
    'ClientPool': '/client-pool',
    'RequestService': '/request-service',
    'ServiceHistory': '/service-history',
    'TechnicianFeedback': '/technician-feedback',
    'JobHistory': '/job-history',
  };
  return routes[pageName] || '/';
}
