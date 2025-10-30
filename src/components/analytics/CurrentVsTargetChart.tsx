import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { STAGES } from "../../data/stages";
import { TARGET_SCENARIOS } from "../../data/mockTargets";
import type { StageDistribution } from "../../types";
import type { TargetScenario } from "../../data/mockTargets";
import { useState } from "react";
import { TrendingUp, TrendingDown, ChevronDown } from "lucide-react";

interface CurrentVsTargetChartProps {
  currentDistribution: StageDistribution;
  title?: string;
  description?: string;
}

export const CurrentVsTargetChart = ({
  currentDistribution,
  title = "Current vs Target Distribution",
  description = "Compare your organization with ideal state",
}: CurrentVsTargetChartProps) => {
  const [selectedScenario, setSelectedScenario] = useState<TargetScenario>(
    TARGET_SCENARIOS[3]
  ); // Balanced by default
  const [showDropdown, setShowDropdown] = useState(false);

  // Prepare data for comparison
  const chartData = Object.entries(currentDistribution).map(
    ([stage, percentage]) => ({
      stage: STAGES[stage as keyof typeof STAGES].name,
      current: percentage,
      target:
        selectedScenario.targetDistribution[stage as keyof StageDistribution],
      gap:
        selectedScenario.targetDistribution[stage as keyof StageDistribution] -
        percentage,
      color: STAGES[stage as keyof typeof STAGES].color.main,
    })
  );

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const gap = data.gap;
      const isPositive = gap > 0;

      return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
          <p className="mb-2 font-semibold text-gray-900">{data.stage}</p>
          <div className="space-y-1 text-sm">
            <p className="text-gray-600">
              Current:{" "}
              <span className="font-medium text-gray-900">{data.current}%</span>
            </p>
            <p className="text-gray-600">
              Target:{" "}
              <span className="font-medium text-gray-900">{data.target}%</span>
            </p>
            <div
              className={`flex items-center font-medium ${
                isPositive ? "text-orange-600" : "text-green-600"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="mr-1 h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="mr-1 h-3.5 w-3.5" />
              )}
              Gap: {Math.abs(gap)}% {isPositive ? "under" : "over"} target
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>

            {/* Scenario Selector */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-brand-teal hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-teal/20"
              >
                <span>{selectedScenario.name}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 z-10 mt-2 w-72 rounded-lg border border-gray-200 bg-white shadow-lg"
                  >
                    {TARGET_SCENARIOS.map((scenario) => (
                      <button
                        key={scenario.id}
                        onClick={() => {
                          setSelectedScenario(scenario);
                          setShowDropdown(false);
                        }}
                        className={`w-full border-b border-gray-100 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-gray-50 ${
                          selectedScenario.id === scenario.id
                            ? "bg-brand-teal/5"
                            : ""
                        }`}
                      >
                        <p className="font-medium text-gray-900">
                          {scenario.name}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {scenario.description}
                        </p>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Scenario Context */}
          <motion.div
            key={selectedScenario.id}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 rounded-lg bg-gradient-to-r from-brand-teal/10 to-brand-navy/10 p-3"
          >
            <p className="text-sm text-gray-700">
              <span className="font-medium">Context:</span>{" "}
              {selectedScenario.context}
            </p>
          </motion.div>
        </CardHeader>

        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="stage"
                tick={{ fill: "#6b7280", fontSize: 11 }}
                tickMargin={10}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 11 }}
                tickMargin={10}
                domain={[0, 50]}
                label={{
                  value: "Percentage (%)",
                  angle: -90,
                  position: "insideLeft",
                  style: { fill: "#6b7280" },
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: "10px" }} iconType="rect" />
              <Bar
                dataKey="current"
                name="Current"
                fill="#2BC6B4"
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-current-${index}`} fill={entry.color} />
                ))}
              </Bar>
              <Bar
                dataKey="target"
                name="Target"
                fill="#1E3A5F"
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
                fillOpacity={0.6}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-target-${index}`}
                    fill={entry.color}
                    fillOpacity={0.4}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Gap Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 grid grid-cols-4 gap-2"
          >
            {chartData.map((data, index) => {
              const isOver = data.gap < 0;
              const absGap = Math.abs(data.gap);

              return (
                <motion.div
                  key={data.stage}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="rounded-lg border border-gray-200 p-2 text-center"
                >
                  <p className="text-xs font-medium text-gray-600">
                    {data.stage.split(" ")[0]}
                  </p>
                  <p
                    className={`mt-1 text-lg font-bold ${
                      isOver ? "text-green-600" : "text-orange-600"
                    }`}
                  >
                    {isOver ? "-" : "+"}
                    {absGap}%
                  </p>
                  <p className="text-xs text-gray-500">
                    {isOver ? "over" : "under"}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
