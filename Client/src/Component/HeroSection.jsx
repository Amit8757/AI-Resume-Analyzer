import React from 'react'

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 px-6 md:px-12 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-white">

      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">

        {/* Left Text */}
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            #1 AI Resume Tool
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight tracking-tight mb-6">
            AI-Powered Resume <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Analyzer & Coach</span>
          </h1>

          <p className="text-slate-600 text-lg md:text-xl mb-8 leading-relaxed max-w-lg mx-auto md:mx-0">
            Get personalized feedback on your resume and tailored interview
            questions. Improve your chances of landing your dream job with our advanced AI engine.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-300 hover:bg-blue-700 hover:scale-105 transition-all duration-200">
              Get Started for Free
            </button>
            <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold hover:border-slate-300 hover:bg-slate-50 transition-all duration-200">
              View Demo
            </button>
          </div>

          <p className="text-sm text-slate-400 mt-4 flex items-center justify-center md:justify-start gap-2">
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            No credit card required
          </p>

          {/* Company Logos */}
          <div className="mt-12 pt-8 border-t border-slate-200/60">
            <p className="text-slate-400 text-sm font-medium mb-4">Trusted by candidates from</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Simple Text Logos for now, referencing the design which has generic logos */}
              <span className="text-xl font-bold text-slate-600 font-sans">Google</span>
              <span className="text-xl font-bold text-slate-600 font-sans">Microsoft</span>
              <span className="text-xl font-bold text-slate-600 font-sans">Amazon</span>
              <span className="text-xl font-bold text-slate-600 font-sans">Netflix</span>
            </div>
          </div>
        </div>

        {/* Right Image Mock */}
        <div className="relative">
          {/* Main Dashboard Preview Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-2 border border-slate-100 relative z-20 transform hover:-translate-y-2 transition-transform duration-500">
            <div className="bg-slate-50 rounded-xl overflow-hidden aspect-[4/3] flex items-center justify-center relative">
              {/* Abstract UI Representation */}
              <div className="absolute inset-0 bg-slate-100">
                {/* Top Bar */}
                <div className="h-10 bg-white border-b border-slate-200 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                {/* Content Area */}
                <div className="p-6 grid grid-cols-3 gap-4 h-full">
                  <div className="col-span-1 bg-white rounded-lg shadow-sm h-32"></div>
                  <div className="col-span-2 bg-white rounded-lg shadow-sm h-32 flex flex-col gap-2 p-3">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  </div>
                  <div className="col-span-3 bg-blue-50 rounded-lg h-24 flex items-center justify-center text-blue-300 font-bold border-2 border-dashed border-blue-200">
                    Drop Resume PDF
                  </div>
                </div>
              </div>
              {/* Robot Overlay */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white rounded-full shadow-xl flex items-center justify-center z-30 animate-bounce-slow">
                <span className="text-6xl filter drop-shadow-lg">🤖</span>
              </div>
            </div>
          </div>

          {/* Floating Feature cards */}
          <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-xl z-30 animate-float delay-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <div>
                <p className="text-xs text-slate-500">ATS Score</p>
                <p className="font-bold text-slate-800">92/100</p>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-10 right-10 bg-white p-4 rounded-xl shadow-xl z-30 animate-float delay-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                <span className="font-bold text-lg">AI</span>
              </div>
              <div>
                <p className="text-xs text-slate-500">Feedback</p>
                <p className="font-bold text-slate-800">Generated</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default HeroSection
