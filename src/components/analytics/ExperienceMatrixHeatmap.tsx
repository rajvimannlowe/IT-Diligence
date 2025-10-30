import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui";
import { motion } from "framer-motion";
import { MOCK_EMPLOYEES } from "../../data/mockEmployees";
import type { ExperienceGroup } from "../../data/mockEmployees";
import type { StageType } from "../../types";
import { STAGES } from "../../data/stages";
import { Award, Flame, Brain, Search, Anchor } from "lucide-react";

export const ExperienceMatrixHeatmap = () => {
  const experienceGroups: ExperienceGroup[] = [
    "0-5yr",
    "5-10yr",
    "10-15yr",
    "15-20yr",
    "20+yr",
  ];
  const stages: StageType[] = [
    "honeymoon",
    "self-reflection",
    "soul-searching",
    "steady-state",
  ];

  // Calculate average percentage for each experience group × stage combination
  const matrixData = experienceGroups.map((expGroup) => {
    const employeesInGroup = MOCK_EMPLOYEES.filter(
      (e) => e.experienceGroup === expGroup
    );
    const count = employeesInGroup.length;

    const stageAverages: Record<StageType, number> = {
      honeymoon: 0,
      "self-reflection": 0,
      "soul-searching": 0,
      "steady-state": 0,
    };

    if (count > 0) {
      employeesInGroup.forEach((emp) => {
        stageAverages.honeymoon += emp.stageDistribution.honeymoon;
        stageAverages["self-reflection"] +=
          emp.stageDistribution["self-reflection"];
        stageAverages["soul-searching"] +=
          emp.stageDistribution["soul-searching"];
        stageAverages["steady-state"] += emp.stageDistribution["steady-state"];
      });

      (Object.keys(stageAverages) as StageType[]).forEach((stage) => {
        stageAverages[stage] = Math.round(stageAverages[stage] / count);
      });
    }

    return {
      experienceGroup: expGroup,
      count,
      ...stageAverages,
    };
  });

  // Get color intensity based on percentage (0-100 -> light to dark)
  const getHeatmapColor = (percentage: number, baseColor: string): string => {
    // Extract HSL from base color
    // For simplicity, use opacity to show intensity
    const intensity = percentage / 100;
    return `${baseColor}${Math.round(intensity * 255)
      .toString(16)
      .padStart(2, "0")}`;
  };

  // Get text color based on background intensity
  const getTextColor = (percentage: number): string => {
    return percentage > 30 ? "#FFFFFF" : "#374151";
  };

  // Stage icons
  const stageIcons = {
    honeymoon: Flame,
    "self-reflection": Brain,
    "soul-searching": Search,
    "steady-state": Anchor,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Experience × Stage Distribution Matrix</CardTitle>
              <CardDescription>
                Heatmap showing stage prevalence across experience levels
              </CardDescription>
            </div>
            <div className="rounded-lg bg-purple-500/10 p-3">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Heatmap Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-300 bg-gray-100 p-3 text-left text-xs font-semibold text-gray-700">
                    Experience Level
                  </th>
                  {stages.map((stage) => {
                    const StageIcon = stageIcons[stage];
                    return (
                      <th
                        key={stage}
                        className="border border-gray-300 p-3 text-center text-xs font-semibold text-gray-700"
                        style={{
                          backgroundColor: `${STAGES[stage].color.main}15`,
                        }}
                      >
                        <div className="flex flex-col items-center space-y-1">
                          <StageIcon
                            className="h-4 w-4"
                            style={{ color: STAGES[stage].color.main }}
                          />
                          <span>{STAGES[stage].name}</span>
                        </div>
                      </th>
                    );
                  })}
                  <th className="border border-gray-300 bg-gray-100 p-3 text-center text-xs font-semibold text-gray-700">
                    Count
                  </th>
                </tr>
              </thead>
              <tbody>
                {matrixData.map((row, rowIndex) => (
                  <motion.tr
                    key={row.experienceGroup}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + rowIndex * 0.1 }}
                  >
                    {/* Experience Group Label */}
                    <td className="border border-gray-300 bg-gray-50 p-3 text-sm font-medium text-gray-700">
                      {row.experienceGroup}
                    </td>

                    {/* Stage Cells */}
                    {stages.map((stage, colIndex) => {
                      const percentage = row[stage];
                      const bgColor = getHeatmapColor(
                        percentage,
                        STAGES[stage].color.main
                      );
                      const textColor = getTextColor(percentage);

                      return (
                        <motion.td
                          key={stage}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: 0.6 + rowIndex * 0.1 + colIndex * 0.05,
                          }}
                          className="group relative border border-gray-300 p-4 text-center transition-all hover:scale-105 hover:shadow-lg"
                          style={{
                            backgroundColor: bgColor,
                            cursor: "pointer",
                          }}
                        >
                          <div
                            className="font-bold"
                            style={{ color: textColor, fontSize: "16px" }}
                          >
                            {percentage}%
                          </div>

                          {/* Hover tooltip */}
                          <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 scale-0 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg transition-transform group-hover:scale-100">
                            <p className="whitespace-nowrap">
                              {row.experienceGroup}: {percentage}%{" "}
                              {STAGES[stage].name}
                            </p>
                            <div className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-gray-900" />
                          </div>
                        </motion.td>
                      );
                    })}

                    {/* Count */}
                    <td className="border border-gray-300 bg-gray-50 p-3 text-center text-sm font-medium text-gray-700">
                      {row.count}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Color Legend */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4"
          >
            <p className="mb-3 text-sm font-semibold text-gray-900">
              Color Intensity Legend:
            </p>
            <div className="grid gap-4 sm:grid-cols-4">
              {stages.map((stage) => (
                <div key={stage} className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: STAGES[stage].color.main }}
                    />
                    <span className="text-xs font-medium text-gray-700">
                      {STAGES[stage].name}
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    {[20, 40, 60, 80, 100].map((intensity) => (
                      <div
                        key={intensity}
                        className="h-6 w-6 rounded"
                        style={{
                          backgroundColor: getHeatmapColor(
                            intensity,
                            STAGES[stage].color.main
                          ),
                        }}
                        title={`${intensity}%`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">0% → 100%</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Key Insights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-4 rounded-lg border border-gray-200 bg-gradient-to-br from-purple-50 to-white p-4"
          >
            <p className="text-sm font-semibold text-gray-900">
              Pattern Analysis:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              <li>
                •{" "}
                <span
                  className="font-medium"
                  style={{ color: STAGES.honeymoon.color.main }}
                >
                  Honeymoon
                </span>{" "}
                stage typically highest in 0-5 year experience group (early
                career enthusiasm)
              </li>
              <li>
                •{" "}
                <span
                  className="font-medium"
                  style={{ color: STAGES["steady-state"].color.main }}
                >
                  Steady-State
                </span>{" "}
                stage increases with experience (20+ years show highest
                percentages)
              </li>
              <li>
                •{" "}
                <span
                  className="font-medium"
                  style={{ color: STAGES["soul-searching"].color.main }}
                >
                  Soul-Searching
                </span>{" "}
                peaks in mid-career (10-15 years) during reassessment phases
              </li>
              <li>
                •{" "}
                <span
                  className="font-medium"
                  style={{ color: STAGES["self-reflection"].color.main }}
                >
                  Self-Reflection
                </span>{" "}
                remains relatively consistent across experience levels
              </li>
            </ul>
          </motion.div>

          {/* Summary Statistics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="mt-4 grid gap-3 sm:grid-cols-5"
          >
            {matrixData.map((row) => {
              // Find dominant stage
              const dominantStage = stages.reduce(
                (max, stage) => (row[stage] > row[max] ? stage : max),
                stages[0]
              );

              return (
                <div
                  key={row.experienceGroup}
                  className="rounded-lg border-2 p-3 text-center"
                  style={{
                    borderColor: STAGES[dominantStage].color.main,
                    backgroundColor: `${STAGES[dominantStage].color.main}10`,
                  }}
                >
                  <p className="text-xs font-medium text-gray-600">
                    {row.experienceGroup}
                  </p>
                  <p className="mt-1 text-lg font-bold text-gray-900">
                    {row.count}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: STAGES[dominantStage].color.main }}
                  >
                    {STAGES[dominantStage].name}
                  </p>
                </div>
              );
            })}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
