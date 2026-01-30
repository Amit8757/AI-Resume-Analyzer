import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, MessageSquare, Trash2, Eye } from 'lucide-react';
import { getResumes, deleteResume } from '../services/resumeService';
import { getInterviews, deleteInterview } from '../services/interviewService';
import { toast } from 'react-toastify';

const History = () => {
    const navigate = useNavigate();
    const [resumes, setResumes] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('resumes');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [resumesData, interviewsData] = await Promise.all([
                getResumes(),
                getInterviews()
            ]);
            setResumes(resumesData.resumes || []);
            setInterviews(interviewsData.interviews || []);
        } catch (error) {
            toast.error('Error loading history');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteResume = async (id) => {
        if (!confirm('Are you sure you want to delete this resume?')) return;

        try {
            await deleteResume(id);
            toast.success('Resume deleted successfully');
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error deleting resume');
        }
    };

    const handleDeleteInterview = async (id) => {
        if (!confirm('Are you sure you want to delete this interview?')) return;

        try {
            await deleteInterview(id);
            toast.success('Interview deleted successfully');
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error deleting interview');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading history...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">History</h2>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('resumes')}
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'resumes'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-slate-600 hover:text-slate-800'
                        }`}
                >
                    Resumes ({resumes.length})
                </button>
                <button
                    onClick={() => setActiveTab('interviews')}
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'interviews'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-slate-600 hover:text-slate-800'
                        }`}
                >
                    Interviews ({interviews.length})
                </button>
            </div>

            {/* Resumes Tab */}
            {activeTab === 'resumes' && (
                <div className="space-y-3">
                    {resumes.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                            <FileText className="mx-auto text-slate-400 mb-4" size={48} />
                            <p className="text-slate-600">No resumes uploaded yet</p>
                            <button
                                onClick={() => navigate('/app')}
                                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Upload Resume
                            </button>
                        </div>
                    ) : (
                        resumes.map((resume) => (
                            <div
                                key={resume._id}
                                className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        <FileText className="text-blue-600" size={24} />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-800">{resume.originalName}</h3>
                                            <p className="text-sm text-slate-500">
                                                Uploaded on {new Date(resume.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {resume.analysis?.atsScore > 0 && (
                                            <div className="text-right">
                                                <p className="text-sm text-slate-600">ATS Score</p>
                                                <p className="text-xl font-bold text-blue-600">{resume.analysis.atsScore}%</p>
                                            </div>
                                        )}

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigate(`/app/builder/${resume._id}`)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <Eye size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteResume(resume._id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Interviews Tab */}
            {activeTab === 'interviews' && (
                <div className="space-y-3">
                    {interviews.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                            <MessageSquare className="mx-auto text-slate-400 mb-4" size={48} />
                            <p className="text-slate-600">No mock interviews yet</p>
                            <button
                                onClick={() => navigate('/app/mock')}
                                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Start Interview
                            </button>
                        </div>
                    ) : (
                        interviews.map((interview) => (
                            <div
                                key={interview._id}
                                className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        <MessageSquare className="text-blue-600" size={24} />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-800">{interview.jobRole}</h3>
                                            <p className="text-sm text-slate-500">
                                                {new Date(interview.createdAt).toLocaleDateString()} • {interview.questions.length} questions
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {interview.status === 'completed' && interview.feedback && (
                                            <div className="text-right">
                                                <p className="text-sm text-slate-600">Score</p>
                                                <p className="text-xl font-bold text-blue-600">{interview.feedback.overallScore}%</p>
                                            </div>
                                        )}

                                        <span className={`px-3 py-1 rounded-full text-sm ${interview.status === 'completed'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {interview.status === 'completed' ? 'Completed' : 'In Progress'}
                                        </span>

                                        <button
                                            onClick={() => handleDeleteInterview(interview._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default History;
