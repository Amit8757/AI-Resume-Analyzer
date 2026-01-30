import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

const JobGapAnalysis = ({ analysis, resumeId }) => {
    const navigate = useNavigate();

    if (!analysis) return null;

    const { skillsMatch, experienceLevel, keywordsStatus, interviewQuestions = [] } = analysis;

    // Get badge color and icon
    const getBadgeStyle = (status) => {
        switch (status) {
            case 'Match':
                return {
                    bg: 'bg-green-100',
                    text: 'text-green-700',
                    icon: <CheckCircle className="w-4 h-4" />
                };
            case 'Partial':
                return {
                    bg: 'bg-yellow-100',
                    text: 'text-yellow-700',
                    icon: <AlertCircle className="w-4 h-4" />
                };
            case 'Missing':
                return {
                    bg: 'bg-red-100',
                    text: 'text-red-700',
                    icon: <XCircle className="w-4 h-4" />
                };
            default:
                return {
                    bg: 'bg-slate-100',
                    text: 'text-slate-700',
                    icon: null
                };
        }
    };

    const skillsStyle = getBadgeStyle(skillsMatch);
    const keywordsStyle = getBadgeStyle(keywordsStatus);

    // Experience level color
    const getExperienceColor = (level) => {
        switch (level) {
            case 'Senior':
                return 'bg-purple-100 text-purple-700';
            case 'Mid':
                return 'bg-blue-100 text-blue-700';
            case 'Junior':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-slate-800">
                    Target Job Gap Analysis
                </h3>
                {resumeId && (
                    <button
                        onClick={() => navigate(`/app/report/${resumeId}`)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Live AI
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {/* Skills Match */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {skillsStyle.icon}
                        <span className="text-sm font-medium text-slate-700">Skills Match</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${skillsStyle.bg} ${skillsStyle.text}`}>
                        {skillsMatch}
                    </span>
                </div>

                {/* Experience Level */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-700">Experience Level</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getExperienceColor(experienceLevel)}`}>
                        {experienceLevel}
                    </span>
                </div>

                {/* Keywords */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {keywordsStyle.icon}
                        <span className="text-sm font-medium text-slate-700">Keywords</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${keywordsStyle.bg} ${keywordsStyle.text}`}>
                        {keywordsStatus}
                    </span>
                </div>

                {/* Interview Questions Preview */}
                {interviewQuestions.length > 0 && (
                    <div className="pt-4 border-t border-slate-200">
                        <p className="text-xs text-slate-500 mb-2">
                            Based on your skills, expect interview questions on:{' '}
                            <span className="font-semibold text-slate-700">
                                {analysis.matchedKeywords?.slice(0, 2).join(' & ')}
                            </span>
                        </p>
                    </div>
                )}

                {/* View Detailed Report */}
                {resumeId && (
                    <button
                        onClick={() => navigate(`/app/report/${resumeId}`)}
                        className="w-full px-4 py-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                        View Detailed Report
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

export default JobGapAnalysis;
