import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui";
import { motion } from "framer-motion";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  Cell,
  Legend,
} from "recharts";
import type { Cluster } from "../../utils/clustering";
import { Users2 } from "lucide-react";

interface ClusterScatterPlotProps {
  clusters: Cluster[];
}

export const ClusterScatterPlot = ({ clusters }: ClusterScatterPlotProps) => {
  // Prepare scatter data (tenure vs stage clarity, colored by cluster)
  const scatterData = clusters.flatMap((cluster) =>
    cluster.employees.map((emp) => ({
      tenure: emp.tenureYears,
      stageClarity: emp.dominantStageStrength,
      stability: emp.stageStability,
      name: emp.name,
      department: emp.department,
      dominantStage: emp.dominantStage,
      clusterId: cluster.id,
      clusterName: cluster.personaName,
      size: 50 + emp.stageStability / 2, // Size based on stability
    }))
  );

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

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
          <div className="mb-2 flex items-center space-x-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: CLUSTER_COLORS[data.clusterId] }}
            />
            <p className="font-semibold text-gray-900">{data.name}</p>
          </div>
          <div className="space-y-1 text-sm text-gray-600">
            <p>
              <span className="font-medium">Department:</span> {data.department}
            </p>
            <p>
              <span className="font-medium">Tenure:</span>{" "}
              {data.tenure.toFixed(1)} years
            </p>
            <p>
              <span className="font-medium">Dominant Stage:</span>{" "}
              {data.dominantStage}
            </p>
            <p>
              <span className="font-medium">Stage Clarity:</span>{" "}
              {Math.round(data.stageClarity)}%
            </p>
            <p>
              <span className="font-medium">Pattern Stability:</span>{" "}
              {Math.round(data.stability)}%
            </p>
            <p
              className="mt-2 text-xs font-medium"
              style={{ color: CLUSTER_COLORS[data.clusterId] }}
            >
              Cluster: {data.clusterName}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Legend data
  const legendData = clusters.map((cluster) => ({
    name: cluster.personaName,
    color: CLUSTER_COLORS[cluster.id],
    size: cluster.size,
  }));

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
              <CardTitle>Employee Cluster Scatter Plot</CardTitle>
              <CardDescription>
                Tenure vs Stage Clarity, colored by cluster persona (n=250)
              </CardDescription>
            </div>
            <div className="rounded-lg bg-purple-500/10 p-3">
              <Users2 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <ResponsiveContainer width="100%" height={500}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

              <XAxis
                type="number"
                dataKey="tenure"
                domain={[0, "auto"]}
                tick={{ fill: "#6b7280", fontSize: 11 }}
                label={{
                  value: "Tenure (years)",
                  position: "insideBottom",
                  offset: -10,
                  style: { fill: "#374151", fontWeight: 600 },
                }}
              />
              <YAxis
                type="number"
                dataKey="stageClarity"
                domain={[0, 100]}
                tick={{ fill: "#6b7280", fontSize: 11 }}
                label={{
                  value: "Stage Clarity (%)",
                  angle: -90,
                  position: "insideLeft",
                  style: { fill: "#374151", fontWeight: 600 },
                }}
              />

              <ZAxis type="number" dataKey="size" range={[50, 400]} />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ strokeDasharray: "3 3" }}
              />

              <Legend
                wrapperStyle={{ paddingTop: "10px" }}
                content={() => null} // Custom legend below
              />

              {/* Render scatter for each cluster */}
              {clusters.map((cluster) => (
                <Scatter
                  key={cluster.id}
                  name={cluster.personaName}
                  data={scatterData.filter((d) => d.clusterId === cluster.id)}
                  fill={CLUSTER_COLORS[cluster.id]}
                  animationDuration={1000}
                >
                  {scatterData
                    .filter((d) => d.clusterId === cluster.id)
                    .map((_entry, index) => (
                      <Cell
                        key={`cell-${cluster.id}-${index}`}
                        fill={CLUSTER_COLORS[cluster.id]}
                        fillOpacity={0.7}
                        stroke={CLUSTER_COLORS[cluster.id]}
                        strokeWidth={1}
                      />
                    ))}
                </Scatter>
              ))}
            </ScatterChart>
          </ResponsiveContainer>

          {/* Custom Legend */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            {legendData.map((legend, index) => (
              <motion.div
                key={legend.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center space-x-3 rounded-lg border-2 p-3"
                style={{
                  borderColor: legend.color,
                  backgroundColor: `${legend.color}10`,
                }}
              >
                <div
                  className="h-4 w-4 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: legend.color }}
                />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-700">
                    {legend.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {legend.size} employees
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Insights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm"
          >
            <p className="font-semibold text-gray-900">
              Cluster Analysis Insights:
            </p>
            <ul className="mt-2 space-y-1 text-gray-600">
              <li>
                • Bubble size represents pattern stability (larger = more
                consistent stage pattern)
              </li>
              <li>
                • Y-axis shows stage clarity (how strongly one stage dominates
                the person's experience)
              </li>
              <li>
                • Each color represents a distinct employee persona based on 11
                dimensions
              </li>
              <li>
                • Clustering uses k-means algorithm with k-means++
                initialization
              </li>
              <li>
                • Hover over any bubble to see detailed employee information
              </li>
            </ul>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
