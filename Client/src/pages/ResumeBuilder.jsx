import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Upload, Sparkles } from 'lucide-react';
import { getResume, analyzeResume, uploadResume } from '../services/resumeService';
import { toast } from 'react-toastify';
import ATSCompatibilityMeter from '../Component/ATSCompatibilityMeter';
import JobGapAnalysis from '../Component/JobGapAnalysis';

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (resumeId && resumeId !== 'new') {
      fetchResume();
    } else {
      setLoading(false);
    }
  }, [resumeId]);

  const fetchResume = async () => {
    try {
      const data = await getResume(resumeId);
      setResume(data.resume);
      if (data.resume.analysis?.jobDescription) {
        setJobDescription(data.resume.analysis.jobDescription);
      }
    } catch (error) {
      toast.error('Error loading resume');
      navigate('/app');
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

      // Set the resume data
      setResume(result.resume);

      // Navigate to the new resume ID
      navigate(`/app/builder/${result.resume.id}`);

      // Fetch the full resume data
      const data = await getResume(result.resume.id);
      setResume(data.resume);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error uploading resume');
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description');
      return;
    }

    if (!resume || !resumeId || resumeId === 'new') {
      toast.error('Please upload a resume first before analyzing');
      return;
    }

    setAnalyzing(true);
    try {
      const data = await analyzeResume(resumeId, jobDescription);
      setResume({ ...resume, analysis: data.analysis });
      toast.success('Resume analyzed successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error analyzing resume';
      toast.error(errorMessage);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (!resume && resumeId !== 'new') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-4xl mb-6">
          📄
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Upload Your Resume</h1>
        <p className="text-slate-500 max-w-md mb-8">
          Upload your resume in PDF format to get started with ATS analysis and optimization suggestions.
        </p>
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
          <div className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            <Upload size={20} />
            {uploading ? 'Uploading...' : 'Upload Resume (PDF)'}
          </div>
        </label>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Resume Analyzer</h2>
        <button
          onClick={() => navigate('/app')}
          className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Resume Info */}
      {resume && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="text-blue-600" size={24} />
            <div>
              <h3 className="font-semibold text-slate-800">{resume.originalName}</h3>
              <p className="text-sm text-slate-500">
                Uploaded on {new Date(resume.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Job Description Input */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Job Description</h3>
        <label htmlFor="jobDescription" className="sr-only">Job Description</label>
        <textarea
          id="jobDescription"
          name="jobDescription"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here to analyze your resume against it..."
          className="w-full h-40 border border-slate-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />

        <button
          onClick={handleAnalyze}
          disabled={analyzing || !resume}
          className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          <Sparkles size={20} />
          {analyzing ? 'Analyzing...' : 'Analyze Resume'}
        </button>

        {!resume && (
          <p className="mt-2 text-sm text-orange-600">
            ⚠️ Please upload a resume first before analyzing
          </p>
        )}
      </div>

      {/* Analysis Results */}
      {resume?.analysis && (
        <div className="grid md:grid-cols-2 gap-6">
          <ATSCompatibilityMeter analysis={resume.analysis} resumeId={resumeId} />
          <JobGapAnalysis analysis={resume.analysis} resumeId={resumeId} />
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder;
