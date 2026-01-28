import React from 'react'
import { ArrowRight } from 'lucide-react'

const CTASection = () => {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700"></div>

      {/* Abstract Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10 text-white">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
          Ready to Optimize Your Resume?
        </h2>
        <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light">
          Join thousands of job seekers who have improved their interview chances with our AI-powered analysis.
        </p>
        <button className="bg-white text-blue-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors shadow-xl flex items-center gap-2 mx-auto group">
          Get Started for Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        <p className="mt-6 text-blue-200 text-sm">
          Free to use • No credit card required
        </p>
      </div>
    </section>
  );
};

export default CTASection
