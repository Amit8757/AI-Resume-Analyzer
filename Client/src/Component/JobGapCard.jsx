import { CheckCircle, AlertCircle, ArrowUpRight } from 'lucide-react';

const JobGapCard = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">

      <div>
        <div className="flex justify-between items-start mb-6">
          <h3 className="font-semibold text-slate-800">Target Job Gap Analysis</h3>
          <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded">Live AI</span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-default">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-slate-700">Skills Match</span>
            </div>
            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">Match</span>
          </div>

          <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-default">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-slate-700">Experience Level</span>
            </div>
            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">Junior</span>
          </div>

          <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-default">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-slate-700">Keywords</span>
            </div>
            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">Missing</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-4 px-2">
          Based on your skills, expect interview questions on <span className="text-slate-700 font-semibold">System Design</span> & <span className="text-slate-700 font-semibold">Leadership</span>.
        </p>
      </div>

      <button className="mt-4 w-full py-2 border border-blue-200 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-1">
        View Detailed Report <ArrowUpRight className="w-4 h-4" />
      </button>

    </div>
  );
};

export default JobGapCard;
