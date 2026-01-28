const ResumeBuilder = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-4xl mb-6">
        🚧
      </div>
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Resume Builder</h1>
      <p className="text-slate-500 max-w-md">
        The interactive Resume Builder is currently under development. Check back soon for drag-and-drop resume creation features!
      </p>
      <button className="mt-8 px-6 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition-colors">
        Go Back to Dashboard
      </button>
    </div>
  )
}

export default ResumeBuilder
