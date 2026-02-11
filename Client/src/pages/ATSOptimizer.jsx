import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Copy, Download, Check, FileText, Loader2 } from 'lucide-react';
import { getResume, getResumes, optimizeResume } from '../services/resumeService';
import { toast } from 'react-toastify';
import { jsPDF } from 'jspdf';

const ATSOptimizer = () => {
    const { resumeId } = useParams();
    const navigate = useNavigate();
    const [resume, setResume] = useState(null);
    const [resumes, setResumes] = useState([]);
    const [jobDescription, setJobDescription] = useState('');
    const [optimizedText, setOptimizedText] = useState('');
    const [loading, setLoading] = useState(true);
    const [optimizing, setOptimizing] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (resumeId === 'select') {
            fetchAllResumes();
        } else {
            fetchResume();
        }
    }, [resumeId]);

    const fetchAllResumes = async () => {
        try {
            const data = await getResumes();
            setResumes(data.resumes || []);
        } catch (error) {
            toast.error('Error loading resumes');
        } finally {
            setLoading(false);
        }
    };

    const fetchResume = async () => {
        try {
            const data = await getResume(resumeId);
            setResume(data.resume);
            if (data.resume.optimizedResume) {
                setOptimizedText(data.resume.optimizedResume);
            }
            if (data.resume.analysis?.jobDescription) {
                setJobDescription(data.resume.analysis.jobDescription);
            }
        } catch (error) {
            toast.error('Error loading resume');
            navigate('/app');
        } finally {
            setLoading(false);
        }
    };

    const handleOptimize = async () => {
        if (!jobDescription.trim()) {
            toast.error('Please enter a job description');
            return;
        }

        setOptimizing(true);
        try {
            const data = await optimizeResume(resumeId, jobDescription);
            setOptimizedText(data.optimizedResume);
            toast.success('Resume optimized successfully!');
        } catch (error) {
            const msg = error.response?.data?.message || 'Error optimizing resume';
            toast.error(msg);
        } finally {
            setOptimizing(false);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(optimizedText);
            setCopied(true);
            toast.success('Copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error('Failed to copy');
        }
    };

    const handleDownload = () => {
        const blob = new Blob([optimizedText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ATS_Optimized_${resume?.originalName?.replace('.pdf', '') || 'Resume'}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Downloaded TXT!');
    };

    const handleDownloadPDF = () => {
        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;
            const margin = 20;
            const contentWidth = pageWidth - (2 * margin);

            // Clean up text from common AI artifacts or weird encodings
            const cleanText = optimizedText
                .replace(/Ø=[^ ]+\s/g, '') // Remove weird "Ø=Üç" style artifacts
                .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Convert [text](url) to just text

            const lines = cleanText.split('\n');
            let currentLineIndex = 0;
            let y = 20;

            // 1. HEADER (NAME & CONTACT) - CENTERED
            let headerLines = [];
            while (currentLineIndex < lines.length &&
                !lines[currentLineIndex].startsWith('#') &&
                !lines[currentLineIndex].startsWith('---') &&
                headerLines.length < 5) {
                const line = lines[currentLineIndex].trim().replace(/\*\*/g, '');
                if (line) headerLines.push(line);
                currentLineIndex++;
            }

            if (headerLines.length > 0) {
                doc.setFontSize(24);
                doc.setTextColor(0, 0, 0);
                doc.setFont('helvetica', 'bold');
                const nameText = headerLines[0].toUpperCase();
                doc.text(nameText, (pageWidth - doc.getTextWidth(nameText)) / 2, y);
                y += 10;

                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(51, 65, 85);
                for (let i = 1; i < headerLines.length; i++) {
                    const info = headerLines[i];
                    doc.text(info, (pageWidth - doc.getTextWidth(info)) / 2, y);
                    y += 6;
                }
                y += 6;
            }

            // 2. MAIN CONTENT SECTIONS
            for (let i = currentLineIndex; i < lines.length; i++) {
                let line = lines[i].trim();
                if (!line || line === '---' || line === '***') {
                    if (line === '---' || line === '***') y += 4;
                    continue;
                }

                const isMarkdownHeader = line.startsWith('#');
                const isBoldHeader = line.startsWith('**') && line.endsWith('**') && line.length < 50;

                if (isMarkdownHeader || isBoldHeader) {
                    const headerText = line.replace(/[#*]/g, '').trim().toUpperCase();
                    if (y > pageHeight - 40) { doc.addPage(); y = 20; }
                    y += 6;
                    doc.setFontSize(13);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(0, 0, 0);
                    doc.text(headerText, margin, y);
                    doc.setDrawColor(30, 41, 59);
                    doc.setLineWidth(0.3);
                    doc.line(margin, y + 2, pageWidth - margin, y + 2);
                    y += 10;
                } else if (line.startsWith('•') || line.startsWith('* ') || line.startsWith('- ')) {
                    doc.setFontSize(10.5);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(20, 20, 20);
                    const bulletClean = line.replace(/^[•*-]\s*/, '• ').replace(/\*\*/g, '');
                    const splitBullet = doc.splitTextToSize(bulletClean, contentWidth - 5);
                    splitBullet.forEach((textLine, idx) => {
                        if (y > pageHeight - 15) { doc.addPage(); y = 20; }
                        doc.text(textLine, margin + (idx === 0 ? 0 : 5), y);
                        y += 5.5;
                    });
                } else {
                    doc.setFontSize(10.5);
                    const isBoldBody = line.startsWith('**') && line.endsWith('**');
                    doc.setFont('helvetica', isBoldBody ? 'bold' : 'normal');
                    doc.setTextColor(51, 65, 85);
                    const cleanLine = line.replace(/\*\*/g, '');
                    const splitText = doc.splitTextToSize(cleanLine, contentWidth);
                    splitText.forEach(textLine => {
                        if (y > pageHeight - 15) { doc.addPage(); y = 20; }
                        doc.text(textLine, margin, y);
                        y += 6;
                    });
                    y += 2;
                }
            }

            doc.save(`Professional_Resume_${resume?.originalName?.replace('.pdf', '') || 'Optimized'}.pdf`);
            toast.success('Professional Resume Downloaded!');
        } catch (error) {
            console.error('PDF Generation Error:', error);
            toast.error('Failed to generate PDF');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading resume...</p>
                </div>
            </div>
        );
    }

    // Resume selection view (when navigating from sidebar)
    if (resumeId === 'select') {
        return (
            <div className="max-w-3xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">ATS Resume Optimizer</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Select a resume to optimize with AI
                    </p>
                </div>

                {resumes.length === 0 ? (
                    <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-200 text-center">
                        <FileText className="mx-auto text-slate-300 mb-4" size={48} />
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">No Resumes Found</h3>
                        <p className="text-slate-500 mb-4">Upload a resume first to optimize it with AI.</p>
                        <button
                            onClick={() => navigate('/app/builder/new')}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Upload Resume
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {resumes.map((r) => (
                            <div
                                key={r._id}
                                onClick={() => navigate(`/app/optimizer/${r._id}`)}
                                className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all flex items-center gap-4"
                            >
                                <FileText className="text-blue-600 flex-shrink-0" size={24} />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-slate-800 truncate">{r.originalName}</p>
                                    <p className="text-xs text-slate-500">
                                        {new Date(r.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                {r.analysis?.atsScore > 0 && (
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex-shrink-0">
                                        ATS: {r.analysis.atsScore}%
                                    </span>
                                )}
                                {r.optimizedResume && (
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex-shrink-0">
                                        Optimized
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(`/app/builder/${resumeId}`)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">ATS Resume Optimizer</h1>
                    <p className="text-slate-500 text-sm">
                        AI-powered resume optimization for maximum ATS compatibility
                    </p>
                </div>
            </div>

            {/* Resume Info */}
            {resume && (
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3">
                        <FileText className="text-blue-600" size={20} />
                        <div>
                            <p className="font-medium text-slate-800">{resume.originalName}</p>
                            <p className="text-xs text-slate-500">
                                Uploaded {new Date(resume.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        {resume.analysis?.atsScore > 0 && (
                            <span className="ml-auto px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                Current ATS: {resume.analysis.atsScore}%
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Job Description Input */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                    Target Job Description
                </h3>
                <p className="text-sm text-slate-500 mb-3">
                    Paste the job description below. The AI will optimize your resume to match the required skills and keywords.
                </p>
                <label htmlFor="jdInput" className="sr-only">Job Description</label>
                <textarea
                    id="jdInput"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full job description here..."
                    className="w-full h-36 border border-slate-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                />
                <button
                    onClick={handleOptimize}
                    disabled={optimizing || !jobDescription.trim()}
                    className="mt-4 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg shadow-blue-200"
                >
                    {optimizing ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            Optimizing with AI...
                        </>
                    ) : (
                        <>
                            <Sparkles size={20} />
                            Optimize Resume
                        </>
                    )}
                </button>
            </div>

            {/* Optimizing Animation */}
            {optimizing && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl border border-blue-200">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">
                            AI is optimizing your resume...
                        </h3>
                        <p className="text-sm text-slate-500 max-w-md">
                            Analyzing keywords, restructuring sections, and applying ATS best practices. This may take 10-20 seconds.
                        </p>
                    </div>
                </div>
            )}

            {/* Optimized Result */}
            {optimizedText && !optimizing && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50">
                        <div className="flex items-center gap-2">
                            <Sparkles className="text-green-600" size={20} />
                            <h3 className="font-semibold text-slate-800">
                                ATS-Optimized Resume
                            </h3>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700"
                            >
                                {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                            <button
                                onClick={handleDownload}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700"
                            >
                                <FileText size={16} />
                                TXT
                            </button>
                            <button
                                onClick={handleDownloadPDF}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-md"
                            >
                                <Download size={16} />
                                Download PDF
                            </button>
                        </div>
                    </div>
                    <div className="p-6">
                        <pre className="whitespace-pre-wrap font-mono text-sm text-slate-700 leading-relaxed bg-slate-50 p-6 rounded-lg border border-slate-200 max-h-[600px] overflow-y-auto">
                            {optimizedText}
                        </pre>
                    </div>
                </div>
            )}

            {/* Tips Section */}
            {!optimizedText && !optimizing && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-semibold text-slate-800 mb-4">How It Works</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm mb-3">1</div>
                            <p className="text-sm font-medium text-slate-800">Paste Job Description</p>
                            <p className="text-xs text-slate-500 mt-1">Add the target job posting you want to apply for</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg">
                            <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm mb-3">2</div>
                            <p className="text-sm font-medium text-slate-800">AI Optimization</p>
                            <p className="text-xs text-slate-500 mt-1">Google Gemini AI rewrites your resume with ATS best practices</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm mb-3">3</div>
                            <p className="text-sm font-medium text-slate-800">Copy or Download</p>
                            <p className="text-xs text-slate-500 mt-1">Get your optimized resume ready for submission</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
                <button
                    onClick={() => navigate(`/app/builder/${resumeId}`)}
                    className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                >
                    Back to Analyzer
                </button>
                {resume?.analysis?.atsScore > 0 && (
                    <button
                        onClick={() => navigate(`/app/report/${resumeId}`)}
                        className="flex-1 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
                    >
                        View Analysis Report
                    </button>
                )}
            </div>
        </div>
    );
};

export default ATSOptimizer;
