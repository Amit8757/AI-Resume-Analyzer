import React from 'react';
import { useNavigate } from 'react-router-dom';

const ATSCompatibilityMeter = ({ analysis, resumeId }) => {
    const navigate = useNavigate();

    if (!analysis) return null;

    const { atsScore = 0, feedback = '' } = analysis;

    // Calculate circle properties
    const radius = 56;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (atsScore / 100) * circumference;

    // Determine color based on score
    const getColor = (score) => {
        if (score >= 75) return '#22C55E'; // Green
        if (score >= 50) return '#EAB308'; // Yellow
        return '#EF4444'; // Red
    };

    const color = getColor(atsScore);

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-6">
                ATS Compatibility
            </h3>

            <div className="flex items-center gap-8">
                {/* Circular Progress Meter */}
                <div className="relative w-32 h-32 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                        {/* Background circle */}
                        <circle
                            cx="64"
                            cy="64"
                            r={radius}
                            stroke="#E2E8F0"
                            strokeWidth="12"
                            fill="transparent"
                        />
                        {/* Progress circle */}
                        <circle
                            cx="64"
                            cy="64"
                            r={radius}
                            stroke={color}
                            strokeWidth="12"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            fill="transparent"
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                    {/* Center text */}
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-3xl font-bold text-slate-800">{Math.round(atsScore)}%</span>
                        <span className="text-xs text-slate-400 font-medium">MATCH</span>
                    </div>
                </div>

                {/* Feedback and Action */}
                <div className="space-y-4 flex-1">
                    {feedback && (
                        <div className={`p-3 border rounded-lg ${atsScore >= 75 ? 'bg-green-50 border-green-100' :
                                atsScore >= 50 ? 'bg-yellow-50 border-yellow-100' :
                                    'bg-red-50 border-red-100'
                            }`}>
                            <p className={`text-sm font-medium ${atsScore >= 75 ? 'text-green-700' :
                                    atsScore >= 50 ? 'text-yellow-700' :
                                        'text-red-700'
                                }`}>
                                "{feedback}"
                            </p>
                        </div>
                    )}

                    {resumeId && (
                        <button
                            onClick={() => navigate(`/app/report/${resumeId}`)}
                            className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
                        >
                            View Analysis Report
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ATSCompatibilityMeter;
