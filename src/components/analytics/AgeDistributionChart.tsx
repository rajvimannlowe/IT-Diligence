import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui";
import { motion } from "framer-motion";
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
import { MOCK_EMPLOYEES } from "../../data/mockEmployees";
import type { AgeGroup } from "../../data/mockEmployees";
import { Users, TrendingUp } from "lucide-react";

export const AgeDistributionChart = () => {
  // Group employees by age group
  const ageGroups: AgeGroup[] = ["22-30", "31-40", "41-50", "51-60", "60+"];

  const chartData = ageGroups.map((group) => {
    const employeesInGroup = MOCK_EMPLOYEES.filter((e) => e.ageGroup === group);
    const count = employeesInGroup.length;

    // Calculate average stage distribution for this age group
    const avgDistribution = {
      honeymoon: 0,
      "self-reflection": 0,
      "soul-searching": 0,
      "steady-state": 0,
    };

    if (count > 0) {
      employeesInGroup.forEach((emp) => {
        avgDistribution.honeymoon += emp.stageDistribution.honeymoon;
        avgDistribution["self-reflection"] +=
          emp.stageDistribution["self-reflection"];
        avgDistribution["soul-searching"] +=
          emp.stageDistribution["soul-searching"];
        avgDistribution["steady-state"] +=
          emp.stageDistribution["steady-state"];
      });

      avgDistribution.honeymoon = Math.round(avgDistribution.honeymoon / count);
      avgDistribution["self-reflection"] = Math.round(
        avgDistribution["self-reflection"] / count
      );
      avgDistribution["soul-searching"] = Math.round(
        avgDistribution["soul-searching"] / count
      );
      avgDistribution["steady-state"] = Math.round(
        avgDistribution["steady-state"] / count
      );
    }

    return {
      ageGroup: group,
      count,
      honeymoon: avgDistribution.honeymoon,
      selfReflection: avgDistribution["self-reflection"],
      soulSearching: avgDistribution["soul-searching"],
      steadyState: avgDistribution["steady-state"],
    };
  });

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
          <p className="mb-2 font-semibold text-gray-900">
            Age Group: {data.ageGroup}
          </p>
          <div className="space-y-1 text-sm">
            <p className="text-gray-600">
              Employee Count:{" "}
              <span className="font-medium text-gray-900">{data.count}</span>
            </p>
            <div className="mt-2 border-t border-gray-200 pt-2">
              <p className="mb-1 text-xs font-medium text-gray-700">
                Avg Stage Distribution:
              </p>
              <div className="space-y-0.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="mr-2 h-2 w-2 rounded-full"
                      style={{ backgroundColor: STAGES.honeymoon.color.main }}
                    />
                    <span>Honeymoon</span>
                  </div>
                  <span className="font-medium">{data.honeymoon}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="mr-2 h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: STAGES["self-reflection"].color.main,
                      }}
                    />
                    <span>Self-Reflection</span>
                  </div>
                  <span className="font-medium">{data.selfReflection}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="mr-2 h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: STAGES["soul-searching"].color.main,
                      }}
                    />
                    <span>Soul-Searching</span>
                  </div>
                  <span className="font-medium">{data.soulSearching}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="mr-2 h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: STAGES["steady-state"].color.main,
                      }}
                    />
                    <span>Steady-State</span>
                  </div>
                  <span className="font-medium">{data.steadyState}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Calculate max count for dynamic Y-axis
  const maxCount = Math.max(...chartData.map((d) => d.count));
  const yDomain: [number, number] = [0, Math.ceil(maxCount * 1.15)];

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
              <CardTitle>Age Distribution Analysis</CardTitle>
              <CardDescription>
                Employee count and stage mix by age group (n=250)
              </CardDescription>
            </div>
            <div className="rounded-lg bg-blue-500/10 p-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="ageGroup"
                tick={{ fill: "#6b7280", fontSize: 11 }}
                tickMargin={10}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 11 }}
                tickMargin={10}
                domain={yDomain}
                label={{
                  value: "Employee Count",
                  angle: -90,
                  position: "insideLeft",
                  style: { fill: "#6b7280" },
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: "10px" }} iconType="rect" />

              <Bar
                dataKey="count"
                name="Employee Count"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
              >
                {chartData.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`hsl(${220 - index * 10}, 85%, ${55 + index * 5}%)`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Key Insights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 grid gap-4 sm:grid-cols-2"
          >
            {/* Average Age */}
            <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Average Age
                  </p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {Math.round(
                      MOCK_EMPLOYEES.reduce((sum, e) => sum + e.age, 0) /
                        MOCK_EMPLOYEES.length
                    )}{" "}
                    years
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Normal distribution (σ=10)
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            {/* Stage Evolution by Age */}
            <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-teal-50 to-white p-4">
              <p className="text-sm font-medium text-gray-700">Key Insight</p>
              <p className="mt-2 text-xs leading-relaxed text-gray-600">
                Younger employees (22-30) show higher{" "}
                <span
                  className="font-semibold"
                  style={{ color: STAGES.honeymoon.color.main }}
                >
                  Honeymoon
                </span>{" "}
                percentages, while older employees (50+) exhibit more{" "}
                <span
                  className="font-semibold"
                  style={{ color: STAGES["steady-state"].color.main }}
                >
                  Steady-State
                </span>{" "}
                characteristics.
              </p>
            </div>
          </motion.div>

          {/* Stage Distribution by Age Group */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-4"
          >
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                  label={{
                    value: "Avg Stage Distribution (%)",
                    position: "insideBottom",
                    offset: -5,
                    style: { fill: "#6b7280" },
                  }}
                />
                <YAxis
                  type="category"
                  dataKey="ageGroup"
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: "10px" }}
                  iconType="circle"
                />

                <Bar
                  dataKey="honeymoon"
                  name="Honeymoon"
                  stackId="stack"
                  fill={STAGES.honeymoon.color.main}
                  animationDuration={1000}
                />
                <Bar
                  dataKey="selfReflection"
                  name="Self-Reflection"
                  stackId="stack"
                  fill={STAGES["self-reflection"].color.main}
                  animationDuration={1000}
                />
                <Bar
                  dataKey="soulSearching"
                  name="Soul-Searching"
                  stackId="stack"
                  fill={STAGES["soul-searching"].color.main}
                  animationDuration={1000}
                />
                <Bar
                  dataKey="steadyState"
                  name="Steady-State"
                  stackId="stack"
                  fill={STAGES["steady-state"].color.main}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
