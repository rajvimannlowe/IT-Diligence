import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui";
import { motion } from "framer-motion";
import { AlertTriangle, TrendingDown, Users, Clock } from "lucide-react";
import type { Department } from "../../data/mockAnalytics";

interface RiskHeatmapProps {
  departments: Department[];
}

// Calculate risk score based on multiple factors
const calculateRiskScore = (dept: Department): number => {
  let riskScore = 0;

  // Low completion rate is risky (max 30 points)
  if (dept.assessmentCompletionRate < 70) riskScore += 30;
  else if (dept.assessmentCompletionRate < 85) riskScore += 15;

  // Low health score is risky (max 40 points)
  if (dept.avgHealthScore < 50) riskScore += 40;
  else if (dept.avgHealthScore < 65) riskScore += 20;

  // High soul-searching percentage is risky (max 30 points)
  if (dept.stageDistribution["soul-searching"] > 35) riskScore += 30;
  else if (dept.stageDistribution["soul-searching"] > 25) riskScore += 15;

  return Math.min(riskScore, 100); // Cap at 100
};

const getRiskLevel = (
  score: number
): { level: string; color: string; bgColor: string; textColor: string } => {
  if (score <= 20)
    return {
      level: "Low Risk",
      color: "#10B981",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    };
  if (score <= 40)
    return {
      level: "Moderate Risk",
      color: "#F59E0B",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
    };
  if (score <= 60)
    return {
      level: "High Risk",
      color: "#F97316",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
    };
  return {
    level: "Critical Risk",
    color: "#EF4444",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
  };
};

export const RiskHeatmap = ({ departments }: RiskHeatmapProps) => {
  const deptWithRisk = departments
    .map((dept) => ({
      ...dept,
      riskScore: calculateRiskScore(dept),
      riskLevel: getRiskLevel(calculateRiskScore(dept)),
    }))
    .sort((a, b) => b.riskScore - a.riskScore);

  const highRiskCount = deptWithRisk.filter((d) => d.riskScore > 40).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" />
                Risk Assessment Heatmap
              </CardTitle>
              <CardDescription>
                Identify departments that need immediate attention
              </CardDescription>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.5 }}
              className={`rounded-full px-4 py-2 text-sm font-bold ${
                highRiskCount === 0
                  ? "bg-green-50 text-green-700"
                  : highRiskCount <= 2
                  ? "bg-yellow-50 text-yellow-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {highRiskCount} High Risk
            </motion.div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {deptWithRisk.map((dept, index) => (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.08 }}
                whileHover={{ scale: 1.02 }}
                className={`group relative overflow-hidden rounded-lg border-2 p-4 transition-all hover:shadow-lg ${
                  dept.riskScore > 60
                    ? "border-red-200"
                    : dept.riskScore > 40
                    ? "border-orange-200"
                    : dept.riskScore > 20
                    ? "border-yellow-200"
                    : "border-green-200"
                }`}
                style={{
                  background: `linear-gradient(to right, ${dept.riskLevel.color}08, transparent)`,
                }}
              >
                {/* Risk indicator bar on left */}
                <div
                  className="absolute left-0 top-0 h-full w-1"
                  style={{ backgroundColor: dept.riskLevel.color }}
                />

                <div className="flex items-start justify-between">
                  {/* Department Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {dept.name}
                      </h3>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${dept.riskLevel.bgColor} ${dept.riskLevel.textColor}`}
                      >
                        {dept.riskLevel.level}
                      </span>
                    </div>

                    {/* Risk Factors */}
                    <div className="mt-3 grid gap-2 md:grid-cols-3">
                      {/* Completion Rate */}
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock
                          className={`h-4 w-4 ${
                            dept.assessmentCompletionRate < 70
                              ? "text-red-500"
                              : dept.assessmentCompletionRate < 85
                              ? "text-yellow-500"
                              : "text-green-500"
                          }`}
                        />
                        <span className="text-gray-600">Completion:</span>
                        <span className="font-semibold text-gray-900">
                          {dept.assessmentCompletionRate}%
                        </span>
                      </div>

                      {/* Health Score */}
                      <div className="flex items-center space-x-2 text-sm">
                        <TrendingDown
                          className={`h-4 w-4 ${
                            dept.avgHealthScore < 50
                              ? "text-red-500"
                              : dept.avgHealthScore < 65
                              ? "text-yellow-500"
                              : "text-green-500"
                          }`}
                        />
                        <span className="text-gray-600">Health:</span>
                        <span className="font-semibold text-gray-900">
                          {dept.avgHealthScore}
                        </span>
                      </div>

                      {/* Employee Count */}
                      <div className="flex items-center space-x-2 text-sm">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Size:</span>
                        <span className="font-semibold text-gray-900">
                          {dept.employeeCount}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Risk Score Gauge */}
                  <div className="ml-4 text-center">
                    <div className="relative">
                      <svg className="h-20 w-20" viewBox="0 0 100 100">
                        {/* Background circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#E5E7EB"
                          strokeWidth="10"
                        />
                        {/* Progress circle */}
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke={dept.riskLevel.color}
                          strokeWidth="10"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 45}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                          animate={{
                            strokeDashoffset:
                              2 * Math.PI * 45 * (1 - dept.riskScore / 100),
                          }}
                          transition={{
                            duration: 1,
                            delay: 0.8 + index * 0.08,
                          }}
                          style={{
                            transform: "rotate(-90deg)",
                            transformOrigin: "50% 50%",
                          }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-900">
                          {dept.riskScore}
                        </span>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Risk Score</p>
                  </div>
                </div>

                {/* Hover: Show Action Items */}
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  whileHover={{ height: "auto", opacity: 1 }}
                  className="mt-3 overflow-hidden border-t border-gray-200 pt-3 text-sm text-gray-600 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <p className="font-medium text-gray-900">
                    Recommended Actions:
                  </p>
                  <ul className="mt-1 space-y-1 text-xs">
                    {dept.assessmentCompletionRate < 85 && (
                      <li>
                        • Boost assessment participation through targeted
                        campaigns
                      </li>
                    )}
                    {dept.avgHealthScore < 65 && (
                      <li>• Conduct 1-on-1 check-ins with team members</li>
                    )}
                    {dept.stageDistribution["soul-searching"] > 25 && (
                      <li>• Address systemic concerns and alignment issues</li>
                    )}
                  </ul>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
