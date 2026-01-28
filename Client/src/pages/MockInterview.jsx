const MockInterview = () => {
  const interviews = [
    { id: 1, title: "Software Engineer", date: "Oct 24, 2024", score: 92, status: "Completed" },
    { id: 2, title: "Frontend Developer", date: "Oct 20, 2024", score: 85, status: "Completed" },
    { id: 3, title: "System Design", date: "Oct 15, 2024", score: 78, status: "Pending" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Mock Interviews</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          + Start New Interview
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Job Role</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Date</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Score</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Status</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-sm text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {interviews.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-slate-800 font-medium">{item.title}</td>
                <td className="px-6 py-4 text-slate-500">{item.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${item.score >= 90 ? 'bg-green-100 text-green-700' :
                      item.score >= 80 ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                    }`}>
                    {item.score}%
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-600">{item.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View Result</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MockInterview;
