import DashboardTop from "../Component/DashboardTop"
import ATSScoreCard from "../Component/ATSScoreCard";
import JobGapCard from "../Component/JobGapCard";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>

      <DashboardTop />

      <div className="grid md:grid-cols-2 gap-6">
        <ATSScoreCard />
        <JobGapCard />
      </div>
    </div>
  );
};

export default Dashboard
