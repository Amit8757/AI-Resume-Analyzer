import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Send, CheckCircle, TrendingUp, Clock } from 'lucide-react';
import { createInterview, getInterviews, submitAnswer, completeInterview } from '../services/interviewService';
import { toast } from 'react-toastify';

const MockInterview = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [currentInterview, setCurrentInterview] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Software Engineer');

  const jobRoles = [
    'Software Engineer',
    'Data Scientist',
    'Product Manager',
    'Designer',
    'Marketing',
    'Sales',
    'General'
  ];

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const data = await getInterviews();
      setInterviews(data.interviews || []);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    }
  };

  const handleStartInterview = async () => {
    setLoading(true);
    try {
      const data = await createInterview(selectedRole);
      setCurrentInterview(data.interview);
      setCurrentQuestionIndex(0);
      setAnswer('');
      toast.success('Interview started!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error starting interview');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      toast.error('Please provide an answer');
      return;
    }

    setLoading(true);
    try {
      const data = await submitAnswer(currentInterview._id, currentQuestionIndex, answer);
      setCurrentInterview(data.interview);
      setAnswer('');

      // Move to next question or complete
      if (currentQuestionIndex < currentInterview.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        toast.success('Answer submitted!');
      } else {
        // Complete interview
        const completedData = await completeInterview(currentInterview._id);
        setCurrentInterview(completedData.interview);
        setShowResults(true);
        toast.success('Interview completed!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error submitting answer');
    } finally {
      setLoading(false);
    }
  };

  const handleNewInterview = () => {
    setCurrentInterview(null);
    setCurrentQuestionIndex(0);
    setAnswer('');
    setShowResults(false);
    fetchInterviews();
  };

  // Show results screen
  if (showResults && currentInterview?.feedback) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">Interview Results</h2>
          <button
            onClick={handleNewInterview}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start New Interview
          </button>
        </div>

        {/* Overall Score */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl border border-blue-200">
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#3b82f6"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(currentInterview.feedback.overallScore / 100) * 351.86} 351.86`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-slate-800">{currentInterview.feedback.overallScore}%</span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Overall Performance</h3>
              <p className="text-slate-700">{currentInterview.feedback.detailedFeedback}</p>
            </div>
          </div>
        </div>

        {/* Strengths */}
        {currentInterview.feedback.strengths.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="text-green-600" size={24} />
              <h3 className="text-lg font-semibold text-slate-800">Strengths</h3>
            </div>
            <ul className="space-y-2">
              {currentInterview.feedback.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2 text-slate-700">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Areas for Improvement */}
        {currentInterview.feedback.improvements.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="text-orange-600" size={24} />
              <h3 className="text-lg font-semibold text-slate-800">Areas for Improvement</h3>
            </div>
            <ul className="space-y-2">
              {currentInterview.feedback.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start gap-2 text-slate-700">
                  <span className="text-orange-600 mt-1">•</span>
                  <span>{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Questions & Answers */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Your Responses</h3>
          <div className="space-y-4">
            {currentInterview.questions.map((q, index) => (
              <div key={index} className="border-b border-slate-200 pb-4 last:border-0">
                <p className="font-medium text-slate-800 mb-2">Q{index + 1}: {q.question}</p>
                <p className="text-slate-600 bg-slate-50 p-3 rounded-lg">{q.answer || 'No answer provided'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show interview in progress
  if (currentInterview && !showResults) {
    const currentQuestion = currentInterview.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / currentInterview.questions.length) * 100;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">Mock Interview - {currentInterview.jobRole}</h2>
          <div className="text-sm text-slate-600">
            Question {currentQuestionIndex + 1} of {currentInterview.questions.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-slate-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-start gap-3 mb-6">
            <MessageSquare className="text-blue-600 mt-1" size={24} />
            <div>
              <p className="text-sm text-slate-600 mb-2">Question {currentQuestionIndex + 1}</p>
              <h3 className="text-xl font-semibold text-slate-800">{currentQuestion.question}</h3>
            </div>
          </div>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here... (Aim for 150-300 words)"
            className="w-full h-48 border border-slate-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />

          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-slate-500">{answer.length} characters</p>
            <button
              onClick={handleSubmitAnswer}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              <Send size={20} />
              {currentQuestionIndex < currentInterview.questions.length - 1 ? 'Next Question' : 'Complete Interview'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show start screen
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Mock Interview Practice</h2>

      {/* Start New Interview */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl border border-blue-200">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-4xl mb-6 mx-auto">
            💼
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Start a New Mock Interview</h3>
          <p className="text-slate-600 mb-6">
            Practice your interview skills with role-specific questions and get detailed feedback on your responses.
          </p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Job Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full max-w-md mx-auto border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {jobRoles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleStartInterview}
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 text-lg font-semibold"
          >
            {loading ? 'Starting...' : 'Start Interview'}
          </button>
        </div>
      </div>

      {/* Interview History */}
      {interviews.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Interviews</h3>
          <div className="space-y-3">
            {interviews.slice(0, 5).map((interview) => (
              <div
                key={interview._id}
                className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="text-blue-600" size={20} />
                  <div>
                    <p className="font-medium text-slate-800">{interview.jobRole}</p>
                    <p className="text-sm text-slate-500">
                      {new Date(interview.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {interview.status === 'completed' && interview.feedback && (
                    <div className="text-right">
                      <p className="text-sm text-slate-600">Score</p>
                      <p className="text-lg font-bold text-blue-600">{interview.feedback.overallScore}%</p>
                    </div>
                  )}
                  <span className={`px-3 py-1 rounded-full text-sm ${interview.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                    }`}>
                    {interview.status === 'completed' ? 'Completed' : 'In Progress'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MockInterview;
