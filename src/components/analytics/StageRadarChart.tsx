import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui";
import { motion } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { STAGES } from "../../data/stages";
import type { StageDistribution } from "../../types";

interface StageRadarChartProps {
  distribution: StageDistribution;
  title?: string;
  description?: string;
}

export const StageRadarChart = ({
  distribution,
  title = "Stage Distribution Analysis",
  description = "Comprehensive view across all organizational stages",
}: StageRadarChartProps) => {
  // Prepare data for radar chart
  const radarData = Object.entries(distribution).map(([stage, percentage]) => ({
    stage: STAGES[stage as keyof typeof STAGES].name,
    value: percentage,
    fullMark: 100,
  }));

  // Calculate dynamic domain based on actual data
  const maxValue = Math.max(...radarData.map((d) => d.value));
  const domainMax = Math.ceil(maxValue / 10) * 10; // Round up to nearest 10

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <p className="font-medium text-gray-900">
            {payload[0].payload.stage}
          </p>
          <p className="text-sm text-gray-600">{payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={radarData}>
              <PolarGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <PolarAngleAxis
                dataKey="stage"
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, domainMax]}
                tick={{ fill: "#9ca3af", fontSize: 10 }}
              />
              <Radar
                name="Distribution"
                dataKey="value"
                stroke="#2BC6B4"
                fill="#2BC6B4"
                fillOpacity={0.6}
                animationBegin={400}
                animationDuration={1000}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="circle" />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
};
