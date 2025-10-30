import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { MOCK_EMPLOYEES } from "../../data/mockEmployees";
import type { WorkLocation } from "../../data/mockEmployees";
import type { DepartmentType } from "../../data/mockAnalytics";
import { MapPin, Home, Building, Wifi } from "lucide-react";

export const WorkLocationDistribution = () => {
  const workLocations: WorkLocation[] = ["Remote", "Hybrid", "On-site"];

  // Overall work location distribution
  const overallLocationData = workLocations.map((location) => {
    const employeesInLocation = MOCK_EMPLOYEES.filter(
      (e) => e.workLocation === location
    );
    const count = employeesInLocation.length;
    const percentage = ((count / MOCK_EMPLOYEES.length) * 100).toFixed(1);

    // Calculate average metrics
    const avgStageClarity =
      count > 0
        ? Math.round(
            employeesInLocation.reduce(
              (sum, e) => sum + e.dominantStageStrength,
              0
            ) / count
          )
        : 0;

    const avgStability =
      count > 0
        ? Math.round(
            employeesInLocation.reduce((sum, e) => sum + e.stageStability, 0) /
              count
          )
        : 0;

    return {
      location,
      count,
      percentage: parseFloat(percentage),
      avgStageClarity,
      avgStability,
    };
  });

  // Work location by department
  const departments: DepartmentType[] = [
    "engineering",
    "sales",
    "marketing",
    "hr",
    "operations",
    "finance",
  ];

  const locationByDeptData = departments.map((dept) => {
    const deptEmployees = MOCK_EMPLOYEES.filter((e) => e.department === dept);
    const deptTotal = deptEmployees.length;

    const locationCounts: Record<WorkLocation, number> = {
      Remote: 0,
      Hybrid: 0,
      "On-site": 0,
    };

    deptEmployees.forEach((e) => {
      locationCounts[e.workLocation]++;
    });

    return {
      department: dept.charAt(0).toUpperCase() + dept.slice(1),
      remote: Math.round((locationCounts["Remote"] / deptTotal) * 100),
      hybrid: Math.round((locationCounts["Hybrid"] / deptTotal) * 100),
      onSite: Math.round((locationCounts["On-site"] / deptTotal) * 100),
      totalCount: deptTotal,
    };
  });

  // Work location colors
  const LOCATION_COLORS: Record<WorkLocation, string> = {
    Remote: "#10B981", // Green
    Hybrid: "#F59E0B", // Amber
    "On-site": "#3B82F6", // Blue
  };

  // Location icons
  const LOCATION_ICONS: Record<WorkLocation, any> = {
    Remote: Home,
    Hybrid: Wifi,
    "On-site": Building,
  };

  // Custom tooltip for pie chart
  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
          <p className="mb-2 font-semibold text-gray-900">{data.location}</p>
          <div className="space-y-1 text-sm text-gray-600">
            <p>
              <span className="font-medium">Count:</span> {data.count} employees
            </p>
            <p>
              <span className="font-medium">Percentage:</span> {data.percentage}
              %
            </p>
            <p>
              <span className="font-medium">Avg Stage Clarity:</span>{" "}
              {data.avgStageClarity}%
            </p>
            <p>
              <span className="font-medium">Avg Pattern Stability:</span>{" "}
              {data.avgStability}%
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
          <p className="mb-2 font-semibold text-gray-900">{data.department}</p>
          <p className="mb-2 text-xs text-gray-500">
            Total: {data.totalCount} employees
          </p>
          <div className="space-y-1 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="mr-2 h-2 w-2 rounded-full"
                  style={{ backgroundColor: LOCATION_COLORS.Remote }}
                />
                <span>Remote</span>
              </div>
              <span className="font-medium">{data.remote}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="mr-2 h-2 w-2 rounded-full"
                  style={{ backgroundColor: LOCATION_COLORS.Hybrid }}
                />
                <span>Hybrid</span>
              </div>
              <span className="font-medium">{data.hybrid}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="mr-2 h-2 w-2 rounded-full"
                  style={{ backgroundColor: LOCATION_COLORS["On-site"] }}
                />
                <span>On-site</span>
              </div>
              <span className="font-medium">{data.onSite}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Calculate flexibility score (higher remote/hybrid = more flexible)
  const remotePercentage =
    overallLocationData.find((d) => d.location === "Remote")?.percentage || 0;
  const hybridPercentage =
    overallLocationData.find((d) => d.location === "Hybrid")?.percentage || 0;
  const flexibilityScore = remotePercentage + hybridPercentage * 0.7; // Hybrid counts as 70% flexibility

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
              <CardTitle>Work Location Distribution</CardTitle>
              <CardDescription>
                Remote, hybrid, and on-site breakdown across the organization
              </CardDescription>
            </div>
            <div className="rounded-lg bg-green-500/10 p-3">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Overall Distribution (Pie Chart) */}
            <div>
              <h3 className="mb-4 text-sm font-medium text-gray-700">
                Overall Work Location Mix
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={overallLocationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ location, percentage }) =>
                      `${location}: ${percentage}%`
                    }
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="count"
                    animationDuration={1000}
                  >
                    {overallLocationData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={LOCATION_COLORS[entry.location as WorkLocation]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Flexibility Score */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-4 rounded-lg border border-green-300 bg-gradient-to-br from-green-50 to-white p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Work Flexibility Score
                    </p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {flexibilityScore.toFixed(0)}%
                    </p>
                    <p className="mt-1 text-xs text-green-600">
                      {flexibilityScore >= 70
                        ? "Highly flexible"
                        : flexibilityScore >= 50
                        ? "Moderately flexible"
                        : "Traditional setup"}
                    </p>
                  </div>
                  <Wifi className="h-8 w-8 text-green-600" />
                </div>
              </motion.div>
            </div>

            {/* Location by Department (Stacked Bar) */}
            <div>
              <h3 className="mb-4 text-sm font-medium text-gray-700">
                Work Location by Department
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={locationByDeptData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="department"
                    tick={{ fill: "#6b7280", fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                    label={{
                      value: "Percentage (%)",
                      angle: -90,
                      position: "insideLeft",
                      style: { fill: "#6b7280" },
                    }}
                    domain={[0, 100]}
                  />
                  <Tooltip content={<BarTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: "10px", fontSize: "11px" }}
                    iconSize={10}
                  />

                  <Bar
                    dataKey="remote"
                    name="Remote"
                    stackId="stack"
                    fill={LOCATION_COLORS.Remote}
                    animationDuration={1000}
                  />
                  <Bar
                    dataKey="hybrid"
                    name="Hybrid"
                    stackId="stack"
                    fill={LOCATION_COLORS.Hybrid}
                    animationDuration={1000}
                  />
                  <Bar
                    dataKey="onSite"
                    name="On-site"
                    stackId="stack"
                    fill={LOCATION_COLORS["On-site"]}
                    animationDuration={1000}
                  />
                </BarChart>
              </ResponsiveContainer>

              {/* Department Insights */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs"
              >
                <p className="font-semibold text-gray-900">
                  Department Patterns:
                </p>
                <ul className="mt-2 space-y-1 text-gray-600">
                  <li>• Engineering often has highest remote percentage</li>
                  <li>• Sales may require more on-site client interactions</li>
                  <li>
                    • HR/Operations typically prefer hybrid for accessibility
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>

          {/* Location Stat Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="mt-6 grid gap-4 sm:grid-cols-3"
          >
            {overallLocationData.map((data, index) => {
              const LocationIcon =
                LOCATION_ICONS[data.location as WorkLocation];

              return (
                <motion.div
                  key={data.location}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                  className="rounded-lg border-2 p-4"
                  style={{
                    borderColor: LOCATION_COLORS[data.location as WorkLocation],
                    backgroundColor: `${
                      LOCATION_COLORS[data.location as WorkLocation]
                    }10`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <LocationIcon
                          className="h-5 w-5"
                          style={{
                            color:
                              LOCATION_COLORS[data.location as WorkLocation],
                          }}
                        />
                        <p className="text-sm font-semibold text-gray-700">
                          {data.location}
                        </p>
                      </div>
                      <p className="mt-2 text-2xl font-bold text-gray-900">
                        {data.count}
                      </p>
                      <p className="text-sm text-gray-500">
                        {data.percentage}% of workforce
                      </p>
                    </div>
                  </div>
                  <div
                    className="mt-3 border-t pt-3"
                    style={{
                      borderColor:
                        LOCATION_COLORS[data.location as WorkLocation],
                    }}
                  >
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Clarity:</span>
                      <span className="font-medium text-gray-900">
                        {data.avgStageClarity}%
                      </span>
                    </div>
                    <div className="mt-1 flex justify-between text-xs">
                      <span className="text-gray-600">Stability:</span>
                      <span className="font-medium text-gray-900">
                        {data.avgStability}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Key Insights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-6 rounded-lg border border-gray-200 bg-gradient-to-r from-blue-50 to-green-50 p-4"
          >
            <p className="text-sm font-semibold text-gray-900">
              Work Location Insights:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              <li>
                •{" "}
                <span
                  className="font-medium"
                  style={{ color: LOCATION_COLORS.Remote }}
                >
                  Remote workers
                </span>{" "}
                often show high autonomy but may need connection initiatives
              </li>
              <li>
                •{" "}
                <span
                  className="font-medium"
                  style={{ color: LOCATION_COLORS.Hybrid }}
                >
                  Hybrid employees
                </span>{" "}
                benefit from flexibility while maintaining in-person
                collaboration
              </li>
              <li>
                •{" "}
                <span
                  className="font-medium"
                  style={{ color: LOCATION_COLORS["On-site"] }}
                >
                  On-site teams
                </span>{" "}
                have strong cohesion but may desire more flexibility
              </li>
              <li>
                • Monitor stage patterns across locations to understand how work
                arrangements affect lifecycle stages
              </li>
            </ul>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
