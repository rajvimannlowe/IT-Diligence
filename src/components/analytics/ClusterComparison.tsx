import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import type { Cluster } from "../../utils/clustering";
import { GitCompare, ChevronDown } from "lucide-react";

interface ClusterComparisonProps {
  clusters: Cluster[];
}

export const ClusterComparison = ({ clusters }: ClusterComparisonProps) => {
  const [clusterA, setClusterA] = useState<Cluster>(clusters[0]);
  const [clusterB, setClusterB] = useState<Cluster>(
    clusters.length > 1 ? clusters[1] : clusters[0]
  );
  const [showDropdownA, setShowDropdownA] = useState(false);
  const [showDropdownB, setShowDropdownB] = useState(false);

  // Cluster colors
  const CLUSTER_COLORS = [
    "#10B981", // Green
    "#3B82F6", // Blue
    "#F59E0B", // Amber
    "#EF4444", // Red
    "#8B5CF6", // Purple
    "#EC4899", // Pink
    "#14B8A6", // Teal
  ];

  // Prepare radar chart data
  const radarData = [
    {
      metric: "Honeymoon",
      clusterA: clusterA.centroid.honeymoon * 100,
      clusterB: clusterB.centroid.honeymoon * 100,
    },
    {
      metric: "Self-Reflection",
      clusterA: clusterA.centroid.selfReflection * 100,
      clusterB: clusterB.centroid.selfReflection * 100,
    },
    {
      metric: "Soul-Searching",
      clusterA: clusterA.centroid.soulSearching * 100,
      clusterB: clusterB.centroid.soulSearching * 100,
    },
    {
      metric: "Steady-State",
      clusterA: clusterA.centroid.steadyState * 100,
      clusterB: clusterB.centroid.steadyState * 100,
    },
  ];

  // Calculate dynamic domain based on actual data
  const allValues = radarData.flatMap((d) => [d.clusterA, d.clusterB]);
  const maxValue = Math.max(...allValues);
  const domainMax = Math.ceil(maxValue / 10) * 10; // Round up to nearest 10

  // Calculate comparison metrics
  const getMetrics = (cluster: Cluster) => {
    const avgAge = Math.round(
      cluster.employees.reduce((sum, e) => sum + e.age, 0) / cluster.size
    );
    const avgTenure = (
      cluster.employees.reduce((sum, e) => sum + e.tenureYears, 0) /
      cluster.size
    ).toFixed(1);
    const avgExperience = Math.round(
      cluster.employees.reduce((sum, e) => sum + e.totalExperienceYears, 0) /
        cluster.size
    );
    const avgStageClarity = Math.round(
      cluster.employees.reduce((sum, e) => sum + e.dominantStageStrength, 0) /
        cluster.size
    );
    const avgStability = Math.round(
      cluster.employees.reduce((sum, e) => sum + e.stageStability, 0) /
        cluster.size
    );

    // Gender breakdown
    const maleCount = cluster.employees.filter(
      (e) => e.gender === "Male"
    ).length;
    const femaleCount = cluster.employees.filter(
      (e) => e.gender === "Female"
    ).length;
    const genderBalance = `${Math.round(
      (maleCount / cluster.size) * 100
    )}% M / ${Math.round((femaleCount / cluster.size) * 100)}% F`;

    // Location breakdown
    const remoteCount = cluster.employees.filter(
      (e) => e.workLocation === "Remote"
    ).length;
    const hybridCount = cluster.employees.filter(
      (e) => e.workLocation === "Hybrid"
    ).length;
    const onsiteCount = cluster.employees.filter(
      (e) => e.workLocation === "On-site"
    ).length;

    // Role breakdown
    const juniorCount = cluster.employees.filter(
      (e) => e.roleLevel === "Junior"
    ).length;
    const midCount = cluster.employees.filter(
      (e) => e.roleLevel === "Mid"
    ).length;
    const seniorCount = cluster.employees.filter(
      (e) => e.roleLevel === "Senior"
    ).length;
    const leadCount = cluster.employees.filter(
      (e) => e.roleLevel === "Lead"
    ).length;
    const execCount = cluster.employees.filter(
      (e) => e.roleLevel === "Executive"
    ).length;

    return {
      avgAge,
      avgTenure,
      avgExperience,
      avgStageClarity,
      avgStability,
      genderBalance,
      workLocation: {
        remote: remoteCount,
        hybrid: hybridCount,
        onsite: onsiteCount,
      },
      roleLevels: {
        junior: juniorCount,
        mid: midCount,
        senior: seniorCount,
        lead: leadCount,
        exec: execCount,
      },
    };
  };

  const metricsA = getMetrics(clusterA);
  const metricsB = getMetrics(clusterB);

  // Comparison row component
  const ComparisonRow = ({
    label,
    valueA,
    valueB,
    higherBetter = true,
  }: {
    label: string;
    valueA: string | number;
    valueB: string | number;
    higherBetter?: boolean;
  }) => {
    const numA = typeof valueA === "string" ? parseFloat(valueA) : valueA;
    const numB = typeof valueB === "string" ? parseFloat(valueB) : valueB;
    const aBetter = higherBetter ? numA > numB : numA < numB;
    const bBetter = higherBetter ? numB > numA : numB < numA;

    return (
      <div className="grid grid-cols-3 gap-4 border-b border-gray-200 py-3 text-sm">
        <div
          className={`text-right ${
            aBetter ? "font-bold text-gray-900" : "text-gray-600"
          }`}
        >
          {valueA}
        </div>
        <div className="text-center font-medium text-gray-700">{label}</div>
        <div
          className={`text-left ${
            bBetter ? "font-bold text-gray-900" : "text-gray-600"
          }`}
        >
          {valueB}
        </div>
      </div>
    );
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
              <CardTitle>Cluster Comparison Tool</CardTitle>
              <CardDescription>
                Side-by-side analysis of two employee personas
              </CardDescription>
            </div>
            <div className="rounded-lg bg-teal-500/10 p-3">
              <GitCompare className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Cluster Selectors */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            {/* Cluster A Selector */}
            <div className="relative">
              <label className="mb-2 block text-xs font-medium text-gray-600">
                Cluster A
              </label>
              <button
                onClick={() => {
                  setShowDropdownA(!showDropdownA);
                  setShowDropdownB(false);
                }}
                className="flex w-full items-center justify-between rounded-lg border-2 p-3 text-left transition-all hover:shadow-md"
                style={{ borderColor: CLUSTER_COLORS[clusterA.id] }}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: CLUSTER_COLORS[clusterA.id] }}
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {clusterA.personaName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {clusterA.size} employees
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    showDropdownA ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {showDropdownA && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-10 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg"
                  >
                    {clusters.map((cluster) => (
                      <button
                        key={cluster.id}
                        onClick={() => {
                          setClusterA(cluster);
                          setShowDropdownA(false);
                        }}
                        className="flex w-full items-center space-x-3 border-b border-gray-100 p-3 text-left transition-colors last:border-b-0 hover:bg-gray-50"
                      >
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{
                            backgroundColor: CLUSTER_COLORS[cluster.id],
                          }}
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {cluster.personaName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {cluster.size} employees
                          </p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cluster B Selector */}
            <div className="relative">
              <label className="mb-2 block text-xs font-medium text-gray-600">
                Cluster B
              </label>
              <button
                onClick={() => {
                  setShowDropdownB(!showDropdownB);
                  setShowDropdownA(false);
                }}
                className="flex w-full items-center justify-between rounded-lg border-2 p-3 text-left transition-all hover:shadow-md"
                style={{ borderColor: CLUSTER_COLORS[clusterB.id] }}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: CLUSTER_COLORS[clusterB.id] }}
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {clusterB.personaName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {clusterB.size} employees
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    showDropdownB ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {showDropdownB && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-10 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg"
                  >
                    {clusters.map((cluster) => (
                      <button
                        key={cluster.id}
                        onClick={() => {
                          setClusterB(cluster);
                          setShowDropdownB(false);
                        }}
                        className="flex w-full items-center space-x-3 border-b border-gray-100 p-3 text-left transition-colors last:border-b-0 hover:bg-gray-50"
                      >
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{
                            backgroundColor: CLUSTER_COLORS[cluster.id],
                          }}
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {cluster.personaName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {cluster.size} employees
                          </p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Stage Distribution Radar */}
          <div className="mb-6">
            <h3 className="mb-4 text-sm font-medium text-gray-700">
              Stage Distribution Comparison
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, domainMax]}
                  tick={{ fill: "#6b7280", fontSize: 10 }}
                />
                <Radar
                  name={clusterA.personaName}
                  dataKey="clusterA"
                  stroke={CLUSTER_COLORS[clusterA.id]}
                  fill={CLUSTER_COLORS[clusterA.id]}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name={clusterB.personaName}
                  dataKey="clusterB"
                  stroke={CLUSTER_COLORS[clusterB.id]}
                  fill={CLUSTER_COLORS[clusterB.id]}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Metric Comparison Table */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="grid grid-cols-3 gap-4 border-b-2 border-gray-300 bg-gray-50 p-4">
              <div className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: CLUSTER_COLORS[clusterA.id] }}
                  />
                  <span className="text-sm font-bold text-gray-900">
                    {clusterA.personaName}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {clusterA.size} employees
                </p>
              </div>
              <div className="text-center text-xs font-medium text-gray-500">
                Metric
              </div>
              <div className="text-left">
                <div className="flex items-center space-x-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: CLUSTER_COLORS[clusterB.id] }}
                  />
                  <span className="text-sm font-bold text-gray-900">
                    {clusterB.personaName}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {clusterB.size} employees
                </p>
              </div>
            </div>

            <div className="p-4">
              <ComparisonRow
                label="Average Age"
                valueA={metricsA.avgAge}
                valueB={metricsB.avgAge}
                higherBetter={false}
              />
              <ComparisonRow
                label="Average Tenure (yr)"
                valueA={metricsA.avgTenure}
                valueB={metricsB.avgTenure}
              />
              <ComparisonRow
                label="Average Experience (yr)"
                valueA={metricsA.avgExperience}
                valueB={metricsB.avgExperience}
              />
              <ComparisonRow
                label="Stage Clarity (%)"
                valueA={metricsA.avgStageClarity}
                valueB={metricsB.avgStageClarity}
              />
              <ComparisonRow
                label="Pattern Stability (%)"
                valueA={metricsA.avgStability}
                valueB={metricsB.avgStability}
              />
              <ComparisonRow
                label="Gender Balance"
                valueA={metricsA.genderBalance}
                valueB={metricsB.genderBalance}
                higherBetter={false}
              />

              <div className="mt-4 border-t border-gray-200 pt-4">
                <p className="mb-2 text-xs font-semibold text-gray-700">
                  Work Location Breakdown
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-right text-xs text-gray-600">
                    R:{metricsA.workLocation.remote} H:
                    {metricsA.workLocation.hybrid} O:
                    {metricsA.workLocation.onsite}
                  </div>
                  <div className="text-center text-xs font-medium text-gray-500">
                    Location
                  </div>
                  <div className="text-left text-xs text-gray-600">
                    R:{metricsB.workLocation.remote} H:
                    {metricsB.workLocation.hybrid} O:
                    {metricsB.workLocation.onsite}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Differences */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 rounded-lg border border-gray-200 bg-gradient-to-r from-teal-50 to-blue-50 p-4"
          >
            <p className="mb-2 text-sm font-semibold text-gray-900">
              Key Differences:
            </p>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>
                • {clusterA.personaName} has{" "}
                {metricsA.avgStageClarity > metricsB.avgStageClarity
                  ? "clearer"
                  : "less clear"}{" "}
                stage identity (
                {Math.abs(metricsA.avgStageClarity - metricsB.avgStageClarity)}%
                difference)
              </li>
              <li>
                • {clusterB.personaName} has{" "}
                {metricsB.avgStability > metricsA.avgStability
                  ? "more stable"
                  : "less stable"}{" "}
                patterns (
                {Math.abs(metricsB.avgStability - metricsA.avgStability)}%
                difference)
              </li>
              <li>
                • Average age difference:{" "}
                {Math.abs(metricsA.avgAge - metricsB.avgAge)} years
              </li>
            </ul>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
