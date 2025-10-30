import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui";
import { motion } from "framer-motion";
import type { Cluster } from "../../utils/clustering";
import { Users, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";

interface ClusterPersonaCardsProps {
  clusters: Cluster[];
}

export const ClusterPersonaCards = ({ clusters }: ClusterPersonaCardsProps) => {
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

  // Get priority level based on persona characteristics
  const getPriorityLevel = (
    cluster: Cluster
  ): { level: string; color: string; icon: any } => {
    if (
      cluster.personaName.includes("At-Risk") ||
      cluster.personaName.includes("Struggling")
    ) {
      return { level: "High", color: "#EF4444", icon: AlertTriangle };
    } else if (
      cluster.personaName.includes("Reflective") ||
      cluster.personaName.includes("Soul-Searching")
    ) {
      return { level: "Medium", color: "#F59E0B", icon: TrendingUp };
    } else {
      return { level: "Low", color: "#10B981", icon: CheckCircle };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Employee Cluster Personas</CardTitle>
          <CardDescription>
            AI-generated employee segments based on 11 dimensional clustering
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {clusters.map((cluster, index) => {
              const color = CLUSTER_COLORS[cluster.id];
              const priority = getPriorityLevel(cluster);
              const PriorityIcon = priority.icon;

              const avgAge = Math.round(
                cluster.employees.reduce((sum, e) => sum + e.age, 0) /
                  cluster.size
              );
              const avgStageClarity = Math.round(
                cluster.employees.reduce(
                  (sum, e) => sum + e.dominantStageStrength,
                  0
                ) / cluster.size
              );
              const avgStability = Math.round(
                cluster.employees.reduce(
                  (sum, e) => sum + e.stageStability,
                  0
                ) / cluster.size
              );

              return (
                <motion.div
                  key={cluster.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Card
                    className="h-full border-2 transition-all hover:shadow-lg"
                    style={{ borderColor: color }}
                  >
                    {/* Header */}
                    <div
                      className="relative p-4"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <div className="absolute right-3 top-3">
                        <div
                          className="flex items-center space-x-1 rounded-full px-2 py-1 text-xs font-semibold"
                          style={{
                            backgroundColor: priority.color,
                            color: "white",
                          }}
                        >
                          <PriorityIcon className="h-3 w-3" />
                          <span>{priority.level}</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div
                          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full"
                          style={{ backgroundColor: color }}
                        >
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3
                            className="font-bold text-gray-900"
                            style={{ color }}
                          >
                            {cluster.personaName}
                          </h3>
                          <p className="mt-1 text-xs text-gray-600">
                            {cluster.size} employees
                          </p>
                        </div>
                      </div>

                      <p className="mt-3 text-sm text-gray-700">
                        {cluster.description}
                      </p>
                    </div>

                    {/* Metrics */}
                    <div className="border-t border-gray-200 p-4">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-xs text-gray-500">Avg Age</p>
                          <p className="mt-1 text-lg font-bold text-gray-900">
                            {avgAge}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Clarity</p>
                          <p className="mt-1 text-lg font-bold text-blue-600">
                            {avgStageClarity}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Stability</p>
                          <p className="mt-1 text-lg font-bold text-green-600">
                            {avgStability}%
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Characteristics */}
                    <div className="border-t border-gray-200 p-4">
                      <p className="mb-2 text-xs font-semibold text-gray-700">
                        Key Characteristics:
                      </p>
                      <ul className="space-y-1">
                        {cluster.characteristics.map((char, i) => (
                          <li
                            key={i}
                            className="flex items-start text-xs text-gray-600"
                          >
                            <span
                              className="mr-1.5 mt-0.5 h-1 w-1 flex-shrink-0 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                            {char}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommendations */}
                    <div className="border-t border-gray-200 bg-gray-50 p-4">
                      <p className="mb-2 text-xs font-semibold text-gray-700">
                        Recommended Actions:
                      </p>
                      <ul className="space-y-1.5">
                        {cluster.recommendations.map((rec, i) => (
                          <li
                            key={i}
                            className="flex items-start text-xs text-gray-600"
                          >
                            <CheckCircle
                              className="mr-1.5 mt-0.5 h-3 w-3 flex-shrink-0"
                              style={{ color }}
                            />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 p-3">
                      <button
                        className="w-full rounded-lg py-2 text-xs font-medium text-white transition-all hover:opacity-90"
                        style={{ backgroundColor: color }}
                      >
                        View {cluster.size} Employees
                      </button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Summary Statistics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="mt-6 rounded-lg border border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50 p-4"
          >
            <p className="mb-3 text-sm font-semibold text-gray-900">
              Cluster Analysis Summary:
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs text-gray-600">Total Clusters</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {clusters.length}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Largest Cluster</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {Math.max(...clusters.map((c) => c.size))}
                </p>
                <p className="text-xs text-gray-500">
                  {clusters[0]?.personaName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Smallest Cluster</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {Math.min(...clusters.map((c) => c.size))}
                </p>
                <p className="text-xs text-gray-500">
                  {clusters[clusters.length - 1]?.personaName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">High Priority Clusters</p>
                <p className="mt-1 text-2xl font-bold text-red-600">
                  {
                    clusters.filter(
                      (c) => getPriorityLevel(c).level === "High Priority"
                    ).length
                  }
                </p>
                <p className="text-xs text-gray-500">
                  Need immediate attention
                </p>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
