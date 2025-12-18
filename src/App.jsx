import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from '../Layout';
import Dashboard from '../Pages/Dashboard';
import ServiceRequests from '../Pages/ServiceRequests';
import Pools from '../Pages/Pools';
import ConstructionStatus from '../Pages/ConstructionStatus';
import TechnicianJobs from '../Pages/TechnicianJobs';
import Technicians from '../Pages/Technicians';
import FeedbackReview from '../Pages/FeedbackReview';
import Analytics from '../Pages/Analytics';
import ClientPool from '../Pages/ClientPool';
import RequestService from '../Pages/RequestService';
import ServiceHistory from '../Pages/ServiceHistory';
import TechnicianFeedback from '../Pages/TechnicianFeedback';
import JobHistory from '../Pages/JobHistory';
import Login from '../Pages/Login';
import RequestConstruction from '../Pages/RequestConstruction';

function AppRoutes() {
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  if (isLogin) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/service-requests" element={<ServiceRequests />} />
        <Route path="/pools" element={<Pools />} />
        <Route path="/construction-status" element={<ConstructionStatus />} />
        <Route path="/technician-jobs" element={<TechnicianJobs />} />
        <Route path="/technicians" element={<Technicians />} />
        <Route path="/feedback-review" element={<FeedbackReview />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/client-pool" element={<ClientPool />} />
        <Route path="/request-service" element={<RequestService />} />
        <Route path="/request-construction" element={<RequestConstruction />} />
        <Route path="/service-history" element={<ServiceHistory />} />
        <Route path="/technician-feedback" element={<TechnicianFeedback />} />
        <Route path="/job-history" element={<JobHistory />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
