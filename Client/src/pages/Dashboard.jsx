import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, TrendingUp, Clock } from 'lucide-react';
import { getResumes, uploadResume } from '../services/resumeService';
import { getInterviews } from '../services/interviewService';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import DashboardTop from "../Component/DashboardTop";
import ATSScoreCard from "../Component/ATSScoreCard";
import JobGapCard from "../Component/JobGapCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [stats, setStats] = useState({
    totalResumes: 0,
    avgATSScore: 0,
    totalInterviews: 0
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resumesData, interviewsData] = await Promise.all([
        getResumes(),
        getInterviews()
      ]);

      setResumes(resumesData.resumes || []);
      setInterviews(interviewsData.interviews || []);

      // Calculate stats
      const totalResumes = resumesData.resumes?.length || 0;
      const analyzedResumes = resumesData.resumes?.filter(r => r.analysis?.atsScore > 0) || [];
      const avgScore = analyzedResumes.length > 0
        ? analyzedResumes.reduce((sum, r) => sum + r.analysis.atsScore, 0) / analyzedResumes.length
        : 0;

      setStats({
        totalResumes,
        avgATSScore: Math.round(avgScore),
        totalInterviews: interviewsData.interviews?.length || 0
      });
    } catch (error) {
      toast.error('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    setUploading(true);
    try {
      const result = await uploadResume(file);
      toast.success('Resume uploaded successfully!');
      fetchData(); // Refresh data
      navigate(`/app/builder/${result.resume.id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error uploading resume');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800">
          Welcome back, {user?.name}!
        </h2>
        <label className="cursor-pointer w-full sm:w-auto">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
          <div className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-md text-sm md:text-base">
            <Upload size={18} />
            {uploading ? 'Uploading...' : 'Upload Resume'}
          </div>
        </label>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs md:text-sm font-medium">Total Resumes</p>
              <p className="text-2xl md:text-3xl font-bold text-slate-800 mt-1">{stats.totalResumes}</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="text-blue-600 w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs md:text-sm font-medium">Avg ATS Score</p>
              <p className="text-2xl md:text-3xl font-bold text-slate-800 mt-1">{stats.avgATSScore}%</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="text-green-600 w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-slate-200 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs md:text-sm font-medium">Mock Interviews</p>
              <p className="text-2xl md:text-3xl font-bold text-slate-800 mt-1">{stats.totalInterviews}</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Clock className="text-purple-600 w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>
        </div>
      </div>

      <DashboardTop />

      <div className="grid md:grid-cols-2 gap-6">
        <ATSScoreCard />
        <JobGapCard />
      </div>

      {/* Recent Resumes */}
      {resumes.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Resumes</h3>
          <div className="space-y-3">
            {resumes.slice(0, 5).map((resume) => (
              <div
                key={resume._id}
                onClick={() => navigate(`/app/builder/${resume._id}`)}
                className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="text-blue-600" size={20} />
                  <div>
                    <p className="font-medium text-slate-800">{resume.originalName}</p>
                    <p className="text-sm text-slate-500">
                      {new Date(resume.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {resume.analysis?.atsScore > 0 && (
                  <div className="text-right">
                    <p className="text-sm text-slate-600">ATS Score</p>
                    <p className="text-lg font-bold text-blue-600">{resume.analysis.atsScore}%</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
