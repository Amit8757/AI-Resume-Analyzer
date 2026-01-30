import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PhoneAuth from "../pages/PhoneAuth";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import OAuthCallback from "../pages/OAuthCallback";
import Layout from "../pages/Layout";
import Dashboard from "../pages/Dashboard";
import ResumeBuilder from "../pages/ResumeBuilder";
import MockInterview from "../pages/MockInterview";
import History from "../pages/History";
import Preview from "../pages/Preview";
import AnalysisReport from "../pages/AnalysisReport";
import ProtectedRoute from "../Component/ProtectedRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/phone-auth" element={<PhoneAuth />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/auth/callback" element={<OAuthCallback />} />

        {/* App with Sidebar Layout */}
        <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="builder/:resumeId" element={<ResumeBuilder />} />
          <Route path="report/:resumeId" element={<AnalysisReport />} />
          <Route path="interview" element={<MockInterview />} />
          <Route path="history" element={<History />} />
          <Route path="preview" element={<Preview />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
