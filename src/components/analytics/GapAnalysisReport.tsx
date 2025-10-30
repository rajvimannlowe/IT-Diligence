import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Target,
  TrendingUp,
  Lightbulb,
} from "lucide-react";
import {
  calculateGap,
  calculateTotalGap,
  getGapSeverity,
  generateRecommendations,
  TARGET_SCENARIOS,
} from "../../data/mockTargets";
import type { StageDistribution } from "../../types";
import { STAGES } from "../../data/stages";

interface GapAnalysisReportProps {
  currentDistribution: StageDistribution;
}

export const GapAnalysisReport = ({
  currentDistribution,
}: GapAnalysisReportProps) => {
  // Use balanced scenario by default
  const selectedScenario = TARGET_SCENARIOS[3]; // Balanced Mix

  const gap = calculateGap(
    currentDistribution,
    selectedScenario.targetDistribution
  );
  const totalGap = calculateTotalGap(gap);
  const severity = getGapSeverity(totalGap);
  const recommendations = generateRecommendations(gap);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >
      {/* Gap Severity Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Gap Analysis Report</CardTitle>
              <CardDescription>
                Alignment between current and target state
              </CardDescription>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.3 }}
              className="rounded-full bg-gradient-to-br from-brand-teal to-brand-navy p-3"
            >
              <Target className="h-6 w-6 text-white" />
            </motion.div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Overall Gap Score */}
          <div className="rounded-lg border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Gap Magnitude
                </p>
                <div className="mt-2 flex items-baseline space-x-2">
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-4xl font-bold text-gray-900"
                  >
                    {totalGap}
                  </motion.span>
                  <span className="text-gray-500">points</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600">
                  Severity Level
                </p>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.5 }}
                  className="mt-2"
                >
                  <span
                    className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-bold ${severity.color} bg-current/10`}
                  >
                    {severity.level === "Low" ? (
                      <CheckCircle2 className="mr-1.5 h-4 w-4" />
                    ) : (
                      <AlertCircle className="mr-1.5 h-4 w-4" />
                    )}
                    {severity.level}
                  </span>
                  <p className="mt-1 text-xs text-gray-500">
                    {severity.description}
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(totalGap / 100) * 100}%` }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className={`h-full rounded-full ${
                    totalGap <= 20
                      ? "bg-green-500"
                      : totalGap <= 40
                      ? "bg-yellow-500"
                      : totalGap <= 60
                      ? "bg-orange-500"
                      : "bg-red-500"
                  }`}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>Perfect Alignment</span>
                <span>Significant Gap</span>
              </div>
            </div>
          </div>

          {/* Stage-by-Stage Breakdown */}
          <div>
            <h3 className="mb-3 flex items-center text-sm font-semibold text-gray-900">
              <TrendingUp className="mr-2 h-4 w-4 text-brand-teal" />
              Stage-by-Stage Gap Analysis
            </h3>
            <div className="space-y-3">
              {Object.entries(gap).map(([stage, gapValue], index) => {
                const stageInfo = STAGES[stage as keyof typeof STAGES];
                const isOver = gapValue < 0;
                const absGap = Math.abs(gapValue);

                return (
                  <motion.div
                    key={stage}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-all hover:border-gray-300 hover:shadow-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full text-xl"
                        style={{
                          backgroundColor: `${stageInfo.color.main}20`,
                          color: stageInfo.color.main,
                        }}
                      >
                        {stageInfo.icon}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {stageInfo.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Current:{" "}
                          {
                            currentDistribution[
                              stage as keyof StageDistribution
                            ]
                          }
                          % → Target:{" "}
                          {
                            selectedScenario.targetDistribution[
                              stage as keyof StageDistribution
                            ]
                          }
                          %
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-bold ${
                          isOver
                            ? "bg-green-50 text-green-700"
                            : "bg-orange-50 text-orange-700"
                        }`}
                      >
                        {isOver ? "↓" : "↑"} {absGap}%
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        {isOver ? "Over target" : "Under target"}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
            Recommended Actions
          </CardTitle>
          <CardDescription>
            Strategic interventions to close the gap
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.map((recommendation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.15 }}
                whileHover={{ x: 4 }}
                className="flex items-start space-x-3 rounded-lg border border-gray-200 bg-gradient-to-r from-gray-50 to-white p-4 transition-all hover:border-brand-teal hover:shadow-md"
              >
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-teal/10 text-sm font-bold text-brand-teal">
                  {index + 1}
                </div>
                <p className="text-sm leading-relaxed text-gray-700">
                  {recommendation}
                </p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
