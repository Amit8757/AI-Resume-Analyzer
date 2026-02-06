const ATSScoreCard = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <h3 className="font-semibold text-slate-800 mb-6">
        ATS Compatibility
      </h3>

      <div className="flex items-center gap-8">
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#E2E8F0"
              strokeWidth="12"
              fill="transparent"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#22C55E"
              strokeWidth="12"
              strokeDasharray="351.86"
              strokeDashoffset="77.41" /* 78% */
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-3xl font-bold text-slate-800">78%</span>
            <span className="text-xs text-slate-400 font-medium">MATCH</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
            <p className="text-sm text-red-700 font-medium">
              "Strong, but missing 'Cloud Architecture' keyword"
            </p>
          </div>
          <button className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
            View Analysis Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ATSScoreCard;
