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
} from "recharts";
import { STAGES } from "../../data/stages";
import type { Department } from "../../data/mockAnalytics";

interface DepartmentComparisonChartProps {
  departments: Department[];
  title?: string;
  description?: string;
}

export const DepartmentComparisonChart = ({
  departments,
  title = "Department Comparison",
  description = "Stage distribution across all departments",
}: DepartmentComparisonChartProps) => {
  // Transform department data for bar chart
  const chartData = departments.map((dept) => ({
    name: dept.name.split(" ")[0], // Shorten names for better display
    honeymoon: dept.stageDistribution.honeymoon,
    selfReflection: dept.stageDistribution["self-reflection"],
    soulSearching: dept.stageDistribution["soul-searching"],
    steadyState: dept.stageDistribution["steady-state"],
    healthScore: dept.avgHealthScore,
  }));

  // Calculate dynamic Y-axis domain based on max percentage
  const allValues = chartData.flatMap((d) => [
    d.honeymoon,
    d.selfReflection,
    d.soulSearching,
    d.steadyState,
  ]);
  const maxValue = allValues.length > 0 ? Math.max(...allValues) : 50;
  const yDomain: [number, number] = [
    0,
    Math.min(100, Math.ceil(maxValue * 1.15)),
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <p className="mb-2 font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#6b7280", fontSize: 11 }}
                tickMargin={10}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 11 }}
                tickMargin={10}
                domain={yDomain}
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
                dataKey="honeymoon"
                name={STAGES.honeymoon.name}
                fill={STAGES.honeymoon.color.main}
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
              />
              <Bar
                dataKey="selfReflection"
                name={STAGES["self-reflection"].name}
                fill={STAGES["self-reflection"].color.main}
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
              />
              <Bar
                dataKey="soulSearching"
                name={STAGES["soul-searching"].name}
                fill={STAGES["soul-searching"].color.main}
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
              />
              <Bar
                dataKey="steadyState"
                name={STAGES["steady-state"].name}
                fill={STAGES["steady-state"].color.main}
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
};
