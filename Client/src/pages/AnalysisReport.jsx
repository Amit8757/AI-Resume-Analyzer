import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Lightbulb, MessageSquare } from 'lucide-react';
import { getResume } from '../services/resumeService';
import { toast } from 'react-toastify';

const AnalysisReport = () => {
    const { resumeId } = useParams();
    const navigate = useNavigate();
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResume();
    }, [resumeId]);

    const fetchResume = async () => {
        try {
            const data = await getResume(resumeId);
            setResume(data.resume);
        } catch (error) {
            toast.error('Error loading analysis report');
            navigate('/app');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading report...</p>
                </div>
            </div>
        );
    }

    if (!resume || !resume.analysis) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-600">No analysis data available</p>
                <button
                    onClick={() => navigate('/app')}
                    className="mt-4 text-blue-600 hover:underline"
                >
                    Go back to dashboard
                </button>
            </div>
        );
    }

    const { analysis } = resume;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(`/app/builder/${resumeId}`)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Detailed Analysis Report</h1>
                    <p className="text-slate-600">{resume.originalName}</p>
                </div>
            </div>

            {/* Overall Score */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Overall ATS Score</h2>
                        <p className="text-blue-100">{analysis.feedback}</p>
                    </div>
                    <div className="text-6xl font-bold">{Math.round(analysis.atsScore)}%</div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-sm text-slate-600 mb-1">Skills Match</p>
                    <p className="text-2xl font-bold text-slate-800">{analysis.skillsMatch}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-sm text-slate-600 mb-1">Experience Level</p>
                    <p className="text-2xl font-bold text-slate-800">{analysis.experienceLevel}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-sm text-slate-600 mb-1">Keywords</p>
                    <p className="text-2xl font-bold text-slate-800">{analysis.keywordsStatus}</p>
                </div>
            </div>

            {/* Matched Keywords */}
            {analysis.matchedKeywords && analysis.matchedKeywords.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="text-green-600" size={24} />
                        <h3 className="text-lg font-semibold text-slate-800">Matched Keywords</h3>
                        <span className="ml-auto text-sm text-slate-600">
                            {analysis.matchedKeywords.length} found
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {analysis.matchedKeywords.map((keyword, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                            >
                                {keyword}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Missing Keywords */}
            {analysis.missingKeywords && analysis.missingKeywords.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-4">
                        <XCircle className="text-red-600" size={24} />
                        <h3 className="text-lg font-semibold text-slate-800">Missing Keywords</h3>
                        <span className="ml-auto text-sm text-slate-600">
                            {analysis.missingKeywords.length} missing
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {analysis.missingKeywords.map((keyword, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium"
                            >
                                {keyword}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Suggestions */}
            {analysis.suggestions && analysis.suggestions.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-4">
                        <Lightbulb className="text-yellow-600" size={24} />
                        <h3 className="text-lg font-semibold text-slate-800">Improvement Suggestions</h3>
                    </div>
                    <ul className="space-y-2">
                        {analysis.suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <span className="text-yellow-600 mt-1">•</span>
                                <span className="text-slate-700">{suggestion}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Interview Questions */}
            {analysis.interviewQuestions && analysis.interviewQuestions.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-4">
                        <MessageSquare className="text-blue-600" size={24} />
                        <h3 className="text-lg font-semibold text-slate-800">Expected Interview Questions</h3>
                    </div>
                    <div className="space-y-3">
                        {analysis.interviewQuestions.map((question, index) => (
                            <div key={index} className="p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm font-medium text-blue-900">Q{index + 1}:</p>
                                <p className="text-slate-700 mt-1">{question}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
                <button
                    onClick={() => navigate(`/app/builder/${resumeId}`)}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    Edit Resume
                </button>
                <button
                    onClick={() => navigate('/app')}
                    className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default AnalysisReport;
