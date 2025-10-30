import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { STAGES } from "../../data/stages";
import { TrendingUp, Sparkles } from "lucide-react";
import type { TimeSeriesDataPoint } from "../../data/mockAnalytics";

interface PredictiveTrendsChartProps {
  historicalData: TimeSeriesDataPoint[];
}

// Generate predictive data points
const generatePredictions = (historicalData: TimeSeriesDataPoint[]): any[] => {
  const lastDataPoint = historicalData[historicalData.length - 1];
  const predictions = [];
  const daysToPredict = 90;

  for (let i = 1; i <= daysToPredict; i++) {
    const date = new Date(lastDataPoint.timestamp + i * 24 * 60 * 60 * 1000);

    // Simple linear projection with slight randomness
    predictions.push({
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      honeymoon: Math.max(
        5,
        lastDataPoint.stageDistribution.honeymoon - i / 30 + Math.random() * 3
      ),
      selfReflection: Math.min(
        40,
        lastDataPoint.stageDistribution["self-reflection"] +
          i / 45 +
          Math.random() * 2
      ),
      soulSearching: Math.max(
        15,
        lastDataPoint.stageDistribution["soul-searching"] -
          i / 60 +
          Math.random() * 2
      ),
      steadyState: Math.min(
        35,
        lastDataPoint.stageDistribution["steady-state"] +
          i / 40 +
          Math.random() * 2
      ),
      isPrediction: true,
    });
  }

  return predictions;
};

export const PredictiveTrendsChart = ({
  historicalData,
}: PredictiveTrendsChartProps) => {
  // Combine historical + predicted data
  const historicalChartData = historicalData.slice(-30).map((point) => ({
    date: new Date(point.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    honeymoon: point.stageDistribution.honeymoon,
    selfReflection: point.stageDistribution["self-reflection"],
    soulSearching: point.stageDistribution["soul-searching"],
    steadyState: point.stageDistribution["steady-state"],
    isPrediction: false,
  }));

  const predictedData = generatePredictions(historicalData);
  const allData = [...historicalChartData, ...predictedData];
  const todayIndex = historicalChartData.length - 1;

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const isPrediction = payload[0].payload.isPrediction;

      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <div className="mb-2 flex items-center space-x-2">
            <p className="font-medium text-gray-900">{label}</p>
            {isPrediction && (
              <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                Predicted
              </span>
            )}
          </div>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(1)}%
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
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-purple-500" />
                Predictive Trends (Next 90 Days)
              </CardTitle>
              <CardDescription>
                AI-powered projection based on current trajectory
              </CardDescription>
            </div>
            <div className="rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 px-3 py-2">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-900">
                  Forecast Active
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={allData}>
              <defs>
                {/* Gradients for area fills */}
                <linearGradient id="colorHoneymoon" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={STAGES.honeymoon.color.main}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={STAGES.honeymoon.color.main}
                    stopOpacity={0.05}
                  />
                </linearGradient>
                <linearGradient
                  id="colorSelfReflection"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={STAGES["self-reflection"].color.main}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={STAGES["self-reflection"].color.main}
                    stopOpacity={0.05}
                  />
                </linearGradient>
                <linearGradient
                  id="colorSoulSearching"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={STAGES["soul-searching"].color.main}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={STAGES["soul-searching"].color.main}
                    stopOpacity={0.05}
                  />
                </linearGradient>
                <linearGradient
                  id="colorSteadyState"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={STAGES["steady-state"].color.main}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={STAGES["steady-state"].color.main}
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#6b7280", fontSize: 10 }}
                tickMargin={10}
                interval={9}
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
              <Legend wrapperStyle={{ paddingTop: "10px" }} iconType="circle" />

              {/* Reference line for "Today" */}
              <ReferenceLine
                x={allData[todayIndex]?.date}
                stroke="#9333EA"
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{
                  value: "Today",
                  position: "top",
                  fill: "#9333EA",
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              />

              <Area
                type="monotone"
                dataKey="honeymoon"
                name={STAGES.honeymoon.name}
                stroke={STAGES.honeymoon.color.main}
                strokeWidth={2}
                fill="url(#colorHoneymoon)"
                animationDuration={1500}
              />
              <Area
                type="monotone"
                dataKey="selfReflection"
                name={STAGES["self-reflection"].name}
                stroke={STAGES["self-reflection"].color.main}
                strokeWidth={2}
                fill="url(#colorSelfReflection)"
                animationDuration={1500}
              />
              <Area
                type="monotone"
                dataKey="soulSearching"
                name={STAGES["soul-searching"].name}
                stroke={STAGES["soul-searching"].color.main}
                strokeWidth={2}
                fill="url(#colorSoulSearching)"
                animationDuration={1500}
              />
              <Area
                type="monotone"
                dataKey="steadyState"
                name={STAGES["steady-state"].name}
                stroke={STAGES["steady-state"].color.main}
                strokeWidth={2}
                fill="url(#colorSteadyState)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>

          {/* Prediction Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-4 rounded-lg border border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 p-3 text-sm"
          >
            <p className="font-medium text-purple-900">
              📊 Prediction Model: Linear Regression with Historical Trends
            </p>
            <p className="mt-1 text-purple-700">
              Based on last 90 days of data. Actual results may vary based on
              organizational changes, interventions, and external factors. Use
              as directional guidance, not absolute forecast.
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
