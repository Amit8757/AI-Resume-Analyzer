import React, { useState } from 'react';
import { Upload, FileText, Search, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { uploadResume, analyzeResume } from '../services/resumeService';
import { toast } from 'react-toastify';

const DashboardTop = () => {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [resumeId, setResumeId] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        await uploadFile(droppedFile);
      } else {
        toast.error('Please upload a PDF file');
      }
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        await uploadFile(selectedFile);
      } else {
        toast.error('Please upload a PDF file');
      }
    }
  };

  const uploadFile = async (fileToUpload) => {
    setUploading(true);
    try {
      const result = await uploadResume(fileToUpload);
      setResumeId(result.resume.id);
      toast.success('Resume uploaded successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error uploading resume');
      setFile(null);
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !resumeId) {
      toast.error('Please upload a resume first');
      return;
    }

    if (!jobDescription.trim()) {
      toast.error('Please enter a job description');
      return;
    }

    setAnalyzing(true);
    try {
      await analyzeResume(resumeId, jobDescription);
      toast.success('Resume analyzed successfully!');
      // Navigate to the resume builder to see results
      navigate(`/app/builder/${resumeId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error analyzing resume');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">

      <div className="flex flex-col md:flex-row gap-8 items-start">

        {/* Upload Section (Drop Zone) */}
        <div className="w-full md:w-1/2">
          <div
            className={`border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center p-6 text-center transition-all duration-200 ${dragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-slate-50 hover:bg-slate-100"
              } ${file ? "bg-green-50 border-green-400" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="resume-upload"
              name="resume"
              className="hidden"
              accept=".pdf"
              onChange={handleFileChange}
              disabled={uploading}
            />

            {uploading ? (
              <div>
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600">Uploading...</p>
              </div>
            ) : file ? (
              <div className="relative">
                <FileText className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="font-semibold text-slate-700">{file.name}</p>
                <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <button
                  onClick={() => {
                    setFile(null);
                    setResumeId(null);
                  }}
                  className="mt-4 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  Remove File
                </button>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-blue-100/50 rounded-full flex items-center justify-center mb-4 text-blue-600">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-lg text-slate-700 mb-2">
                  Drop Zone
                </h3>
                <p className="text-slate-500 mb-4 text-sm max-w-xs mx-auto">
                  Drag & drop your resume or <label htmlFor="resume-upload" className="text-blue-600 cursor-pointer hover:underline font-medium">browse</label> to upload PDF
                </p>
              </>
            )}
          </div>
        </div>

        {/* Input Form Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-between h-64 space-y-4">
          <div>
            <label htmlFor="jobDescription" className="block text-sm font-medium text-slate-700 mb-2">Target Job Description</label>
            <div className="relative">
              <textarea
                id="jobDescription"
                name="jobDescription"
                placeholder="Paste the job description here (Role, Responsibilities, Requirements)..."
                className="w-full h-32 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm transition-all"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                maxLength={5000}
              ></textarea>
              <div className="absolute bottom-3 right-3 text-xs text-slate-400">
                {jobDescription.length}/5000 chars
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-slate-700 mb-2">Job Title (Optional)</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="jobTitle"
                name="jobTitle"
                type="text"
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!file || !resumeId || analyzing || uploading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-md transition-all hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {analyzing ? 'Analyzing...' : 'Analyze Resume'}
            <Sparkles className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default DashboardTop;

