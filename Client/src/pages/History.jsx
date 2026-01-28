import React from 'react';
import { FileText, MoreVertical } from 'lucide-react';

const History = () => {
    const history = [
        { id: 1, name: "Software_Engineer_Resume.pdf", date: "2 mins ago", type: "Analysis" },
        { id: 2, name: "Project_Manager_Resume.pdf", date: "2 days ago", type: "Analysis" },
        { id: 3, name: "Frontend_Dev_Resume_Final.pdf", date: "1 week ago", type: "Mock Interview" },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">History</h2>

            <div className="grid gap-4">
                {history.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800">{item.name}</h3>
                                <p className="text-sm text-slate-500">{item.type} • {item.date}</p>
                            </div>
                        </div>

                        <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default History;
