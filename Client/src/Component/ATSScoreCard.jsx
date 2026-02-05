const ATSScoreCard = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <h3 className="font-semibold text-slate-800 mb-6">
        ATS Compatibility
      </h3>

      <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8">
        <div className="relative w-28 h-28 md:w-32 md:h-32 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="56"
              cy="56"
              r="48"
              stroke="#E2E8F0"
              strokeWidth="10"
              fill="transparent"
              className="md:cx-64 md:cy-64 md:r-56 md:stroke-w-12"
            />
            <circle
              cx="56"
              cy="56"
              r="48"
              stroke="#22C55E"
              strokeWidth="10"
              strokeDasharray="301.59"
              strokeDashoffset="66.35" /* 78% of 2*PI*48 */
              strokeLinecap="round"
              fill="transparent"
              className="md:cx-64 md:cy-64 md:r-56 md:stroke-w-12"
            />
          </svg>
          {/* Note: Tailwind doesn't support cx/cy/r directly in classes well, so I'll keep the SVG simple or use fixed size for the container */}
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-2xl md:text-3xl font-bold text-slate-800">78%</span>
            <span className="text-[10px] md:text-xs text-slate-400 font-medium tracking-wider">MATCH</span>
          </div>
        </div>

        <div className="flex-1 w-full space-y-4">
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-center sm:text-left">
            <p className="text-xs md:text-sm text-red-700 font-medium">
              "Strong, but missing 'Cloud Architecture' keyword"
            </p>
          </div>
          <button className="w-full px-4 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-semibold shadow-sm">
            View Analysis Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ATSScoreCard;
