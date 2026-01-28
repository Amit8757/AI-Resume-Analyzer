import React, { useState } from 'react';
import { Upload, FileText, Search, X } from 'lucide-react';

const DashboardTop = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
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
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />

            {file ? (
              <div className="relative">
                <FileText className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="font-semibold text-slate-700">{file.name}</p>
                <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <button
                  onClick={() => setFile(null)}
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
            <label className="block text-sm font-medium text-slate-700 mb-2">Target Job Description</label>
            <div className="relative">
              <textarea
                placeholder="Paste the job description here (Role, Responsibilities, Requirements)..."
                className="w-full h-32 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm transition-all"
              ></textarea>
              <div className="absolute bottom-3 right-3 text-xs text-slate-400">
                0/5000 chars
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Job Title (Optional)</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
              />
            </div>
          </div>

          <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-md transition-all hover:shadow-lg active:scale-95 flex items-center justify-center gap-2">
            Analyze Resume
            <SparklesIcon className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

// Simple Icon component helper if needed, or import from lucide-react
const SparklesIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 3.214L13 21l-2.286-6.857L5 12l5.714-3.214z" />
  </svg>
);

export default DashboardTop;
