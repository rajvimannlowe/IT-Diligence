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
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import type { Cluster } from "../../utils/clustering";
import { PieChartIcon } from "lucide-react";

interface ClusterDistributionChartProps {
  clusters: Cluster[];
}

export const ClusterDistributionChart = ({
  clusters,
}: ClusterDistributionChartProps) => {
  // Cluster colors (7 distinct colors)
  const CLUSTER_COLORS = [
    "#10B981", // Green
    "#3B82F6", // Blue
    "#F59E0B", // Amber
    "#EF4444", // Red
    "#8B5CF6", // Purple
    "#EC4899", // Pink
    "#14B8A6", // Teal
  ];

  // Prepare data for charts
  const pieData = clusters.map((cluster) => ({
    name: cluster.personaName,
    value: cluster.size,
    percentage: ((cluster.size / 250) * 100).toFixed(1),
    color: CLUSTER_COLORS[cluster.id],
  }));

  const barData = clusters.map((cluster) => {
    // Calculate demographics
    const genderBreakdown = {
      male: cluster.employees.filter((e) => e.gender === "Male").length,
      female: cluster.employees.filter((e) => e.gender === "Female").length,
      other: cluster.employees.filter(
        (e) => e.gender !== "Male" && e.gender !== "Female"
      ).length,
    };

    const locationBreakdown = {
      remote: cluster.employees.filter((e) => e.workLocation === "Remote")
        .length,
      hybrid: cluster.employees.filter((e) => e.workLocation === "Hybrid")
        .length,
      onSite: cluster.employees.filter((e) => e.workLocation === "On-site")
        .length,
    };

    const avgMetrics = {
      age: Math.round(
        cluster.employees.reduce((sum, e) => sum + e.age, 0) / cluster.size
      ),
      tenure: (
        cluster.employees.reduce((sum, e) => sum + e.tenureYears, 0) /
        cluster.size
      ).toFixed(1),
      stageClarity: Math.round(
        cluster.employees.reduce((sum, e) => sum + e.dominantStageStrength, 0) /
          cluster.size
      ),
      stability: Math.round(
        cluster.employees.reduce((sum, e) => sum + e.stageStability, 0) /
          cluster.size
      ),
    };

    return {
      name: cluster.personaName,
      size: cluster.size,
      percentage: ((cluster.size / 250) * 100).toFixed(1),
      color: CLUSTER_COLORS[cluster.id],
      genderBreakdown,
      locationBreakdown,
      avgMetrics,
    };
  });

  // Custom tooltip for pie chart
  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
          <div className="mb-2 flex items-center space-x-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: data.color }}
            />
            <p className="font-semibold text-gray-900">{data.name}</p>
          </div>
          <div className="space-y-1 text-sm text-gray-600">
            <p>
              <span className="font-medium">Count:</span> {data.value} employees
            </p>
            <p>
              <span className="font-medium">Percentage:</span> {data.percentage}
              %
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for bar chart
  const BarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
          <p className="mb-2 font-semibold text-gray-900">{data.name}</p>
          <div className="space-y-1 text-sm text-gray-600">
            <p>
              <span className="font-medium">Size:</span> {data.size} (
              {data.percentage}%)
            </p>
            <div className="mt-2 border-t border-gray-200 pt-2">
              <p className="text-xs font-medium text-gray-700">Demographics:</p>
              <p className="text-xs">
                Gender: {data.genderBreakdown.male}M /{" "}
                {data.genderBreakdown.female}F / {data.genderBreakdown.other}O
              </p>
              <p className="text-xs">
                Location: {data.locationBreakdown.remote}R /{" "}
                {data.locationBreakdown.hybrid}H /{" "}
                {data.locationBreakdown.onSite}O
              </p>
            </div>
            <div className="mt-2 border-t border-gray-200 pt-2">
              <p className="text-xs font-medium text-gray-700">Averages:</p>
              <p className="text-xs">
                Age: {data.avgMetrics.age} | Tenure: {data.avgMetrics.tenure}yr
              </p>
              <p className="text-xs">
                Clarity: {data.avgMetrics.stageClarity}% | Stability:{" "}
                {data.avgMetrics.stability}%
              </p>
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
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Cluster Size Distribution</CardTitle>
              <CardDescription>
                Breakdown of employee counts and demographics across clusters
              </CardDescription>
            </div>
            <div className="rounded-lg bg-indigo-500/10 p-3">
              <PieChartIcon className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Pie Chart */}
            <div>
              <h3 className="mb-4 text-sm font-medium text-gray-700">
                Cluster Size Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ percentage }) => `${percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    animationDuration={1000}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div className="mt-4 grid grid-cols-1 gap-2">
                {pieData.map((data) => (
                  <div
                    key={data.name}
                    className="flex items-center justify-between rounded-lg border p-2"
                    style={{ borderColor: data.color }}
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: data.color }}
                      />
                      <span className="text-xs font-medium text-gray-700">
                        {data.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-900">
                        {data.value}
                      </p>
                      <p className="text-xs text-gray-500">
                        {data.percentage}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bar Chart */}
            <div>
              <h3 className="mb-4 text-sm font-medium text-gray-700">
                Cluster Comparison
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#6b7280", fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                    label={{
                      value: "Employee Count",
                      angle: -90,
                      position: "insideLeft",
                      style: { fill: "#6b7280", fontSize: 11 },
                    }}
                  />
                  <Tooltip content={<BarTooltip />} />
                  <Bar
                    dataKey="size"
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                    animationDuration={1000}
                  >
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Summary Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-4 grid grid-cols-2 gap-2"
              >
                <div className="rounded-lg border border-gray-200 bg-green-50 p-3 text-center">
                  <p className="text-xs text-gray-600">Largest Cluster</p>
                  <p className="mt-1 text-xl font-bold text-green-700">
                    {barData[0]?.size}
                  </p>
                  <p className="text-xs text-gray-500">{barData[0]?.name}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-blue-50 p-3 text-center">
                  <p className="text-xs text-gray-600">Avg Cluster Size</p>
                  <p className="mt-1 text-xl font-bold text-blue-700">
                    {Math.round(
                      barData.reduce((sum, d) => sum + d.size, 0) /
                        barData.length
                    )}
                  </p>
                  <p className="text-xs text-gray-500">employees</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Detailed Demographics Table */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-6"
          >
            <h3 className="mb-3 text-sm font-medium text-gray-700">
              Cluster Demographics Breakdown
            </h3>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border-b border-gray-200 px-4 py-2 text-left text-xs font-semibold text-gray-700">
                      Cluster
                    </th>
                    <th className="border-b border-gray-200 px-4 py-2 text-center text-xs font-semibold text-gray-700">
                      Size
                    </th>
                    <th className="border-b border-gray-200 px-4 py-2 text-center text-xs font-semibold text-gray-700">
                      Avg Age
                    </th>
                    <th className="border-b border-gray-200 px-4 py-2 text-center text-xs font-semibold text-gray-700">
                      Avg Tenure
                    </th>
                    <th className="border-b border-gray-200 px-4 py-2 text-center text-xs font-semibold text-gray-700">
                      Clarity
                    </th>
                    <th className="border-b border-gray-200 px-4 py-2 text-center text-xs font-semibold text-gray-700">
                      Stability
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {barData.map((data) => (
                    <tr key={data.name} className="hover:bg-gray-50">
                      <td className="border-b border-gray-200 px-4 py-2">
                        <div className="flex items-center space-x-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: data.color }}
                          />
                          <span className="text-xs font-medium text-gray-700">
                            {data.name}
                          </span>
                        </div>
                      </td>
                      <td className="border-b border-gray-200 px-4 py-2 text-center text-xs font-semibold text-gray-900">
                        {data.size}
                      </td>
                      <td className="border-b border-gray-200 px-4 py-2 text-center text-xs text-gray-600">
                        {data.avgMetrics.age}
                      </td>
                      <td className="border-b border-gray-200 px-4 py-2 text-center text-xs text-gray-600">
                        {data.avgMetrics.tenure}yr
                      </td>
                      <td className="border-b border-gray-200 px-4 py-2 text-center text-xs text-gray-600">
                        {data.avgMetrics.stageClarity}%
                      </td>
                      <td className="border-b border-gray-200 px-4 py-2 text-center text-xs text-gray-600">
                        {data.avgMetrics.stability}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
