import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Layout from "../pages/Layout";
import Dashboard from "../pages/Dashboard";
import ResumeBuilder from "../pages/ResumeBuilder";
import MockInterview from "../pages/MockInterview";
import History from "../pages/History";
import Preview from "../pages/Preview";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* App with Sidebar Layout */}
        <Route path="/app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="history" element={<History />} />
          <Route path="mock" element={<MockInterview />} />
          <Route path="builder/:resumeId" element={<ResumeBuilder />} />
        </Route>

        {/* Preview */}
        <Route path="/view/:resumeId" element={<Preview />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
