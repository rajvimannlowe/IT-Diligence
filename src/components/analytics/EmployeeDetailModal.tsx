import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Briefcase,
  Calendar,
  Award,
  MapPin,
  Activity,
  TrendingUp,
  Users,
} from "lucide-react";
import type { EmployeeDetailed } from "../../data/mockEmployees";
import { MOCK_EMPLOYEES } from "../../data/mockEmployees";
import { STAGES } from "../../data/stages";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface EmployeeDetailModalProps {
  employee: EmployeeDetailed | null;
  onClose: () => void;
}

export const EmployeeDetailModal = ({
  employee,
  onClose,
}: EmployeeDetailModalProps) => {
  if (!employee) return null;

  // Get peer comparison (same department and similar role level)
  const peers = MOCK_EMPLOYEES.filter(
    (e) =>
      e.department === employee.department &&
      e.roleLevel === employee.roleLevel &&
      e.id !== employee.id
  );

  const peerAvgStageClarity =
    peers.length > 0
      ? Math.round(
          peers.reduce((sum, p) => sum + p.dominantStageStrength, 0) /
            peers.length
        )
      : 0;

  const peerAvgStability =
    peers.length > 0
      ? Math.round(
          peers.reduce((sum, p) => sum + p.stageStability, 0) / peers.length
        )
      : 0;

  // Stage radar data
  const radarData = [
    { stage: "Honeymoon", value: employee.stageDistribution.honeymoon },
    {
      stage: "Self-Reflection",
      value: employee.stageDistribution["self-reflection"],
    },
    {
      stage: "Soul-Searching",
      value: employee.stageDistribution["soul-searching"],
    },
    {
      stage: "Steady-State",
      value: employee.stageDistribution["steady-state"],
    },
  ];

  // Calculate dynamic domain based on actual data
  const maxRadarValue = Math.max(...radarData.map((d) => d.value));
  const radarDomainMax = Math.ceil(maxRadarValue / 10) * 10; // Round up to nearest 10

  // Mock assessment history (last 6 months) - track stage clarity over time
  const assessmentHistory = [
    {
      month: "6mo ago",
      clarity: Math.max(25, employee.dominantStageStrength - 15),
    },
    {
      month: "5mo ago",
      clarity: Math.max(30, employee.dominantStageStrength - 12),
    },
    {
      month: "4mo ago",
      clarity: Math.max(35, employee.dominantStageStrength - 8),
    },
    {
      month: "3mo ago",
      clarity: Math.max(40, employee.dominantStageStrength - 5),
    },
    {
      month: "2mo ago",
      clarity: Math.max(45, employee.dominantStageStrength - 2),
    },
    { month: "Current", clarity: employee.dominantStageStrength },
  ];

  // Recommendations based on profile
  const getRecommendations = (): string[] => {
    const recommendations: string[] = [];

    if (employee.dominantStage === "soul-searching") {
      recommendations.push(
        "In exploration phase - create space for career conversations and self-discovery"
      );
    }

    if (employee.dominantStage === "honeymoon" && employee.tenureYears < 1) {
      recommendations.push(
        "New in honeymoon phase - provide clear onboarding and early wins"
      );
    }

    if (employee.stageStability < 50) {
      recommendations.push(
        "Pattern is shifting - check in to understand what's changing"
      );
    }

    if (
      employee.dominantStage === "self-reflection" &&
      employee.tenureYears > 2
    ) {
      recommendations.push(
        "In reflection phase - discuss growth opportunities and career direction"
      );
    }

    if (
      employee.stageDistribution["steady-state"] > 60 &&
      employee.tenureYears > 5
    ) {
      recommendations.push(
        "In steady-state - leverage as mentor and cultural anchor"
      );
    }

    if (employee.dominantStageStrength < 40) {
      recommendations.push(
        "Balanced across stages - exploring their organizational fit"
      );
    }

    if (recommendations.length === 0) {
      recommendations.push("Continue stage-appropriate conversations");
      recommendations.push(
        "Monitor for stage transitions in quarterly assessments"
      );
    }

    return recommendations;
  };

  const recommendations = getRecommendations();
  const dominantStage = STAGES[employee.dominantStage];

  return (
    <AnimatePresence>
      {employee && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 p-6">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-lg border border-gray-300 bg-white p-2 text-gray-600 transition-colors hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-start space-x-4">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
                  <User className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {employee.name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">{employee.email}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <div className="flex items-center space-x-1.5 text-sm text-gray-600">
                      <Briefcase className="h-4 w-4" />
                      <span>
                        {employee.roleLevel} - {employee.department}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{employee.workLocation}</span>
                    </div>
                    <div
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        backgroundColor: `${dominantStage.color.main}20`,
                        color: dominantStage.color.main,
                      }}
                    >
                      {dominantStage.name}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Key Metrics */}
              <div className="mb-6 grid gap-4 sm:grid-cols-4">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-center">
                  <p className="text-xs text-gray-600">Stage Clarity</p>
                  <p className="mt-1 text-3xl font-bold text-blue-700">
                    {Math.round(employee.dominantStageStrength)}%
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {employee.dominantStageStrength >= peerAvgStageClarity
                      ? "↑"
                      : "↓"}{" "}
                    vs peers ({peerAvgStageClarity}%)
                  </p>
                </div>
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
                  <p className="text-xs text-gray-600">Pattern Stability</p>
                  <p className="mt-1 text-3xl font-bold text-green-700">
                    {Math.round(employee.stageStability)}%
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {employee.stageStability >= peerAvgStability ? "↑" : "↓"} vs
                    peers ({peerAvgStability}%)
                  </p>
                </div>
                <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 text-center">
                  <p className="text-xs text-gray-600">Tenure</p>
                  <p className="mt-1 text-3xl font-bold text-purple-700">
                    {employee.tenureYears.toFixed(1)}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">years at company</p>
                </div>
                <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 text-center">
                  <p className="text-xs text-gray-600">Experience</p>
                  <p className="mt-1 text-3xl font-bold text-orange-700">
                    {employee.totalExperienceYears}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">total years</p>
                </div>
              </div>

              {/* Charts Row */}
              <div className="mb-6 grid gap-6 lg:grid-cols-2">
                {/* Stage Distribution Radar */}
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <h3 className="mb-4 text-sm font-semibold text-gray-900">
                    Stage Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis
                        dataKey="stage"
                        tick={{ fill: "#6b7280", fontSize: 11 }}
                      />
                      <PolarRadiusAxis
                        angle={90}
                        domain={[0, radarDomainMax]}
                        tick={{ fill: "#6b7280", fontSize: 10 }}
                      />
                      <Radar
                        name="Distribution"
                        dataKey="value"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.6}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Stage Clarity Trend */}
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <h3 className="mb-4 text-sm font-semibold text-gray-900">
                    Stage Clarity Trend (6 months)
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={assessmentHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="month"
                        tick={{ fill: "#6b7280", fontSize: 10 }}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fill: "#6b7280", fontSize: 10 }}
                      />
                      <Tooltip />
                      <Bar
                        dataKey="clarity"
                        fill="#10B981"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Demographics */}
              <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h3 className="mb-3 flex items-center text-sm font-semibold text-gray-900">
                  <User className="mr-2 h-4 w-4" />
                  Demographics & Details
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Age:</span>
                    <span className="font-medium text-gray-900">
                      {employee.age} ({employee.ageGroup})
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Gender:</span>
                    <span className="font-medium text-gray-900">
                      {employee.gender}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Award className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Role Level:</span>
                    <span className="font-medium text-gray-900">
                      {employee.roleLevel}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Briefcase className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Department:</span>
                    <span className="font-medium text-gray-900">
                      {employee.department}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Join Date:</span>
                    <span className="font-medium text-gray-900">
                      {employee.joinDate}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Activity className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Assessments:</span>
                    <span className="font-medium text-gray-900">
                      {employee.assessmentCount} completed
                    </span>
                  </div>
                </div>
              </div>

              {/* Peer Comparison */}
              <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
                <h3 className="mb-3 flex items-center text-sm font-semibold text-gray-900">
                  <Users className="mr-2 h-4 w-4" />
                  Peer Comparison ({peers.length} peers in {employee.department}
                  )
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-gray-600">Stage Clarity</span>
                      <span className="font-medium text-gray-900">
                        {Math.round(employee.dominantStageStrength)}% vs{" "}
                        {peerAvgStageClarity}% avg
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{ width: `${employee.dominantStageStrength}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-gray-600">Pattern Stability</span>
                      <span className="font-medium text-gray-900">
                        {Math.round(employee.stageStability)}% vs{" "}
                        {peerAvgStability}% avg
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-green-500"
                        style={{ width: `${employee.stageStability}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <h3 className="mb-3 flex items-center text-sm font-semibold text-gray-900">
                  <TrendingUp className="mr-2 h-4 w-4 text-green-600" />
                  Recommendations
                </h3>
                <ul className="space-y-2">
                  {recommendations.map((rec, index) => (
                    <li
                      key={index}
                      className="flex items-start text-sm text-gray-700"
                    >
                      <span className="mr-2 mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-600 text-xs text-white">
                        {index + 1}
                      </span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
