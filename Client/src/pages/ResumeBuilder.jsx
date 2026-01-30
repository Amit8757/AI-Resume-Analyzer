import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Upload, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';
import { getResume, analyzeResume, uploadResume } from '../services/resumeService';
import { toast } from 'react-toastify';

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
      console.log('Analyzing resume:', resumeId, 'with job description length:', jobDescription.length);
      const data = await analyzeResume(resumeId, jobDescription);
      console.log('Analysis result:', data);

      setResume({ ...resume, analysis: data.analysis });
      toast.success('Resume analyzed successfully!');
    } catch (error) {
      console.error('Analysis error:', error);
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
          onChange={(e) => {
            console.log('Job description updated, length:', e.target.value.length);
            setJobDescription(e.target.value);
          }}
          placeholder="Paste the job description here to analyze your resume against it..."
          className="w-full h-40 border border-slate-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />

        {/* Debug Info */}
        {resume && (
          <div className="mt-2 text-xs text-slate-500">
            Resume ID: {resumeId} | Job Description: {jobDescription.length} characters
          </div>
        )}

        <button
          onClick={() => {
            console.log('Analyze button clicked!');
            console.log('Resume:', resume ? 'exists' : 'missing');
            console.log('Resume ID:', resumeId);
            console.log('Job Description length:', jobDescription.length);
            handleAnalyze();
          }}
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

      {/* ATS Score */}
      {resume?.analysis?.atsScore >= 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="text-blue-600" size={24} />
            <h3 className="text-lg font-semibold text-slate-800">ATS Compatibility Score</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Score Circle */}
            <div className="flex items-center justify-center">
              <div className="relative w-40 h-40">
                <svg className="transform -rotate-90 w-40 h-40">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#e5e7eb"
                    strokeWidth="16"
                    fill="none"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke={resume.analysis.atsScore >= 80 ? '#10b981' : resume.analysis.atsScore >= 60 ? '#3b82f6' : '#f59e0b'}
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={`${(resume.analysis.atsScore / 100) * 439.8} 439.8`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-slate-800">{resume.analysis.atsScore}</span>
                  <span className="text-sm text-slate-600">out of 100</span>
                </div>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700 font-medium">Keyword Match</span>
                  <span className="text-slate-600">{resume.analysis.breakdown?.keywordScore || 0}/50</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((resume.analysis.breakdown?.keywordScore || 0) / 50) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700 font-medium">Resume Structure</span>
                  <span className="text-slate-600">{resume.analysis.breakdown?.structureScore || 0}/25</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((resume.analysis.breakdown?.structureScore || 0) / 25) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700 font-medium">Content Quality</span>
                  <span className="text-slate-600">{resume.analysis.breakdown?.contentScore || 0}/25</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((resume.analysis.breakdown?.contentScore || 0) / 25) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-300">
                <p className="text-sm font-medium text-slate-700">
                  {resume.analysis.atsScore >= 80 ? '🎉 Excellent! Your resume is well-optimized for ATS.' :
                    resume.analysis.atsScore >= 60 ? '👍 Good! Some improvements can boost your score.' :
                      resume.analysis.atsScore >= 40 ? '⚠️ Fair. Follow suggestions to improve visibility.' :
                        '❌ Needs work. Address the suggestions below.'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Analyzed on {new Date(resume.analysis.analyzedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Keywords Matched */}
      {resume?.analysis?.keywordsMatched && resume.analysis.keywordsMatched.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Keywords Analysis</h3>
          <div className="flex flex-wrap gap-2">
            {resume.analysis.keywordsMatched.map((item, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-sm ${item.found
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
                  }`}
              >
                {item.keyword} {item.found ? '✓' : '✗'}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {resume?.analysis?.suggestions && resume.analysis.suggestions.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="text-orange-600" size={24} />
            <h3 className="text-lg font-semibold text-slate-800">Improvement Suggestions</h3>
          </div>
          <ul className="space-y-2">
            {resume.analysis.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2 text-slate-700">
                <span className="text-orange-600 mt-1">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder;
