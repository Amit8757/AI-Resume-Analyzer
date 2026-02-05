import React from 'react'
import { CheckCircle } from 'lucide-react'

const KeyFeatures = () => {
  const features = [
    {
      title: "ATS Score Simulation",
      desc: "See how well your resume passes applicant tracking systems."
    },
    {
      title: "Personalized Insights",
      desc: "Get expert tips on how to improve your resume for your target job."
    },
    {
      title: "Custom Interview Questions",
      desc: "Receive tailored interview questions based on your skills and experience."
    },
    {
      title: "Track Your Progress",
      desc: "Save your past analyses and improvements to measure your growth."
    }
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-white max-w-7xl mx-auto px-6 md:px-12">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-4">Key Features</h2>
        <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto">
          Everything you need to optimize your application and ace the interview.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">

        {/* Left Mock Image - Hidden or simplified on mobile */}
        <div className="relative group hidden lg:block">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl transform -rotate-2 group-hover:rotate-0 transition-transform duration-500 opacity-50"></div>
          <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-100 relative z-10">
            {/* Mock Dashboard UI for ATS Score */}
            <div className="p-1 bg-slate-50 border-b border-slate-100 flex gap-1.5 pl-3">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
            </div>
            <div className="p-6 bg-slate-50 min-h-[300px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 rounded-full border-[12px] border-blue-500 border-t-blue-200 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl font-bold text-slate-800">78%</span>
                </div>
                <p className="font-semibold text-slate-700">ATS Score Simulation</p>
                <div className="flex gap-2 justify-center mt-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Match</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">Needs Work</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right List */}
        <div className="space-y-8">
          {features.map((f, index) => (
            <div key={index} className="flex gap-4 group cursor-default">
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                  <CheckCircle className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">{f.title}</h3>
                <p className="text-slate-600 text-sm md:text-base">{f.desc}</p>
              </div>
            </div>
          ))}

          <div className="pt-4">
            <button className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors shadow-sm">
              Explore All Features
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
