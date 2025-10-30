import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { STAGES } from "../../data/stages";
import type { TimeSeriesDataPoint } from "../../data/mockAnalytics";

interface HistoricalTrendsChartProps {
  data: TimeSeriesDataPoint[];
  title?: string;
  description?: string;
}

export const HistoricalTrendsChart = ({
  data,
  title = "Stage Distribution Trends",
  description = "How organizational health has evolved over time",
}: HistoricalTrendsChartProps) => {
  // Transform data for line chart
  const chartData = data.map((point) => ({
    date: new Date(point.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    honeymoon: point.stageDistribution.honeymoon,
    selfReflection: point.stageDistribution["self-reflection"],
    soulSearching: point.stageDistribution["soul-searching"],
    steadyState: point.stageDistribution["steady-state"],
  }));

  // Calculate dynamic Y-axis domain
  const allValues = chartData.flatMap((d) => [
    d.honeymoon,
    d.selfReflection,
    d.soulSearching,
    d.steadyState,
  ]);
  const yDomain: [number, number] =
    allValues.length > 0
      ? [0, Math.ceil(Math.max(...allValues) * 1.1)] // Start at 0, add 10% padding to max
      : [0, 50];

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
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
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
              <Legend wrapperStyle={{ paddingTop: "10px" }} iconType="line" />
              <Line
                type="monotone"
                dataKey="honeymoon"
                name={STAGES.honeymoon.name}
                stroke={STAGES.honeymoon.color.main}
                strokeWidth={2}
                dot={false}
                animationDuration={1500}
              />
              <Line
                type="monotone"
                dataKey="selfReflection"
                name={STAGES["self-reflection"].name}
                stroke={STAGES["self-reflection"].color.main}
                strokeWidth={2}
                dot={false}
                animationDuration={1500}
              />
              <Line
                type="monotone"
                dataKey="soulSearching"
                name={STAGES["soul-searching"].name}
                stroke={STAGES["soul-searching"].color.main}
                strokeWidth={2}
                dot={false}
                animationDuration={1500}
              />
              <Line
                type="monotone"
                dataKey="steadyState"
                name={STAGES["steady-state"].name}
                stroke={STAGES["steady-state"].color.main}
                strokeWidth={2}
                dot={false}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
};
