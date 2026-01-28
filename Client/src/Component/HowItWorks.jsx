import { Upload, Brain, MessageSquare } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      title: "Upload Your Resume",
      desc: "Drag & drop your resume or upload a PDF file directly into our secure platform.",
      icon: <Upload className="w-8 h-8 text-blue-600" />,
      bg: "bg-blue-100"
    },
    {
      title: "AI-Powered Analysis",
      desc: "Our advanced AI scans your resume, identifying key strengths and gaps for your target role.",
      icon: <Brain className="w-8 h-8 text-indigo-600" />,
      bg: "bg-indigo-100"
    },
    {
      title: "Practice Mock Interviews",
      desc: "Receive custom interview questions and real-time feedback to perfect your responses.",
      icon: <MessageSquare className="w-8 h-8 text-purple-600" />,
      bg: "bg-purple-100"
    }
  ];

  return (
    <section id="how" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-slate-50/50 skew-y-3 transform origin-top-left -z-10 h-full"></div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
          <p className="text-slate-600 text-lg">
            Three simple steps to transform your job search and land your dream role.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((item, index) => (
            <div
              key={item.title}
              className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${item.bg} rounded-full -mr-16 -mt-16 opacity-20 group-hover:scale-150 transition-transform duration-500`}></div>

              <div className={`w-16 h-16 ${item.bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {item.icon}
              </div>

              <h3 className="font-bold text-xl text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
