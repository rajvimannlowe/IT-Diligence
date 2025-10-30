/**
 * Dashboard Page
 * Main dashboard showing organizational health overview with real-time metrics
 */
import { useUser } from "../context/UserContext";
import { motion } from "framer-motion";
import { Users, CheckCircle2, TrendingUp, BarChart3 } from "lucide-react";
import {
  MetricCard,
  StageDistributionChart,
  RecentActivityList,
  DepartmentHealthGrid,
} from "../components/dashboard";
import {
  MOCK_ORG_METRICS,
  MOCK_RECENT_ACTIVITIES,
  MOCK_DEPARTMENTS,
} from "../data/mockAnalytics";

const Dashboard = () => {
  const { user } = useUser();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-600">
          Welcome back, {user?.name}! Here's your organizational health
          overview.
        </p>
      </motion.div>

      {/* Metrics Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Employees"
          value={MOCK_ORG_METRICS.totalEmployees}
          icon={Users}
          iconColor="bg-brand-teal"
          delay={0}
        />
        <MetricCard
          label="Assessments Completed"
          value={MOCK_ORG_METRICS.assessmentsCompleted}
          trend={{ value: "+12", isPositive: true }}
          icon={CheckCircle2}
          iconColor="bg-green-500"
          delay={0.1}
        />
        <MetricCard
          label="Completion Rate"
          value={`${MOCK_ORG_METRICS.assessmentCompletionRate}%`}
          trend={{ value: "+5%", isPositive: true }}
          icon={TrendingUp}
          iconColor="bg-purple-500"
          delay={0.2}
        />
        <MetricCard
          label="Avg Health Score"
          value={MOCK_ORG_METRICS.avgHealthScore}
          trend={{ value: "+3", isPositive: true }}
          icon={BarChart3}
          iconColor="bg-teal-500"
          delay={0.3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <StageDistributionChart
          distribution={MOCK_ORG_METRICS.stageDistribution}
          title="Organization Stage Distribution"
          description="Current health mix across all employees"
        />
        <RecentActivityList activities={MOCK_RECENT_ACTIVITIES} limit={6} />
      </div>

      {/* Department Health */}
      <DepartmentHealthGrid departments={MOCK_DEPARTMENTS} />
    </div>
  );
};

export default Dashboard;
