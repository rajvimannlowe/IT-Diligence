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
  PieChart,
  Pie,
} from "recharts";
import { MOCK_EMPLOYEES } from "../../data/mockEmployees";
import type { Gender } from "../../data/mockEmployees";
import type { DepartmentType } from "../../data/mockAnalytics";
import { UserCircle, Users2 } from "lucide-react";

export const GenderBreakdownChart = () => {
  // Overall gender distribution
  const genders: Gender[] = [
    "Male",
    "Female",
    "Non-binary",
    "Prefer not to say",
  ];

  const overallGenderData = genders
    .map((gender) => {
      const count = MOCK_EMPLOYEES.filter((e) => e.gender === gender).length;
      const percentage = ((count / MOCK_EMPLOYEES.length) * 100).toFixed(1);
      return {
        gender,
        count,
        percentage: parseFloat(percentage),
      };
    })
    .filter((d) => d.count > 0); // Only show genders that exist in data

  // Gender by department
  const departments: DepartmentType[] = [
    "engineering",
    "sales",
    "marketing",
    "hr",
    "operations",
    "finance",
  ];

  const genderByDeptData = departments.map((dept) => {
    const deptEmployees = MOCK_EMPLOYEES.filter((e) => e.department === dept);
    const deptTotal = deptEmployees.length;

    const genderCounts: Record<Gender, number> = {
      Male: 0,
      Female: 0,
      "Non-binary": 0,
      "Prefer not to say": 0,
    };

    deptEmployees.forEach((e) => {
      genderCounts[e.gender]++;
    });

    return {
      department: dept.charAt(0).toUpperCase() + dept.slice(1),
      male: Math.round((genderCounts["Male"] / deptTotal) * 100),
      female: Math.round((genderCounts["Female"] / deptTotal) * 100),
      nonBinary: Math.round((genderCounts["Non-binary"] / deptTotal) * 100),
      preferNotToSay: Math.round(
        (genderCounts["Prefer not to say"] / deptTotal) * 100
      ),
      totalCount: deptTotal,
    };
  });

  // Gender colors
  const GENDER_COLORS = {
    Male: "#3B82F6",
    Female: "#EC4899",
    "Non-binary": "#8B5CF6",
    "Prefer not to say": "#6B7280",
  };

  // Custom tooltip for pie chart
  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <p className="font-semibold text-gray-900">{data.gender}</p>
          <p className="mt-1 text-sm text-gray-600">
            Count:{" "}
            <span className="font-medium text-gray-900">{data.count}</span>
          </p>
          <p className="text-sm text-gray-600">
            Percentage:{" "}
            <span className="font-medium text-gray-900">
              {data.percentage}%
            </span>
          </p>
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
                  style={{ backgroundColor: GENDER_COLORS.Male }}
                />
                <span>Male</span>
              </div>
              <span className="font-medium">{data.male}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="mr-2 h-2 w-2 rounded-full"
                  style={{ backgroundColor: GENDER_COLORS.Female }}
                />
                <span>Female</span>
              </div>
              <span className="font-medium">{data.female}%</span>
            </div>
            {data.nonBinary > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="mr-2 h-2 w-2 rounded-full"
                    style={{ backgroundColor: GENDER_COLORS["Non-binary"] }}
                  />
                  <span>Non-binary</span>
                </div>
                <span className="font-medium">{data.nonBinary}%</span>
              </div>
            )}
            {data.preferNotToSay > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="mr-2 h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: GENDER_COLORS["Prefer not to say"],
                    }}
                  />
                  <span>Prefer not to say</span>
                </div>
                <span className="font-medium">{data.preferNotToSay}%</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Calculate gender balance score (closer to 50/50 is better)
  const malePercentage =
    overallGenderData.find((d) => d.gender === "Male")?.percentage || 0;
  const femalePercentage =
    overallGenderData.find((d) => d.gender === "Female")?.percentage || 0;
  const balanceScore = 100 - Math.abs(malePercentage - femalePercentage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Gender Distribution Analysis</CardTitle>
              <CardDescription>
                Organization-wide and department-level breakdown
              </CardDescription>
            </div>
            <div className="rounded-lg bg-pink-500/10 p-3">
              <Users2 className="h-6 w-6 text-pink-600" />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Overall Gender Distribution (Pie Chart) */}
            <div>
              <h3 className="mb-4 text-sm font-medium text-gray-700">
                Overall Distribution
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={overallGenderData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ gender, percentage }) =>
                      `${gender}: ${percentage}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    animationDuration={1000}
                  >
                    {overallGenderData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={GENDER_COLORS[entry.gender as Gender]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Gender Balance Score */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 rounded-lg border border-gray-200 bg-gradient-to-br from-purple-50 to-white p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Gender Balance Score
                    </p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {balanceScore.toFixed(0)}/100
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {balanceScore >= 95
                        ? "Excellent balance"
                        : balanceScore >= 85
                        ? "Good balance"
                        : "Room for improvement"}
                    </p>
                  </div>
                  <UserCircle className="h-8 w-8 text-purple-600" />
                </div>
              </motion.div>
            </div>

            {/* Gender by Department (Stacked Bar) */}
            <div>
              <h3 className="mb-4 text-sm font-medium text-gray-700">
                Gender by Department
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={genderByDeptData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fill: "#6b7280", fontSize: 10 }}
                    label={{
                      value: "Percentage (%)",
                      position: "insideBottom",
                      offset: -5,
                      style: { fill: "#6b7280", fontSize: 10 },
                    }}
                  />
                  <YAxis
                    type="category"
                    dataKey="department"
                    tick={{ fill: "#6b7280", fontSize: 10 }}
                    width={80}
                  />
                  <Tooltip content={<BarTooltip />} />
                  <Legend wrapperStyle={{ fontSize: "10px" }} iconSize={8} />

                  <Bar
                    dataKey="male"
                    name="Male"
                    stackId="stack"
                    fill={GENDER_COLORS.Male}
                    animationDuration={1000}
                  />
                  <Bar
                    dataKey="female"
                    name="Female"
                    stackId="stack"
                    fill={GENDER_COLORS.Female}
                    animationDuration={1000}
                  />
                  <Bar
                    dataKey="nonBinary"
                    name="Non-binary"
                    stackId="stack"
                    fill={GENDER_COLORS["Non-binary"]}
                    animationDuration={1000}
                  />
                  <Bar
                    dataKey="preferNotToSay"
                    name="Prefer not to say"
                    stackId="stack"
                    fill={GENDER_COLORS["Prefer not to say"]}
                    animationDuration={1000}
                  />
                </BarChart>
              </ResponsiveContainer>

              {/* Department Insights */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs"
              >
                <p className="font-semibold text-gray-900">
                  Department Insights:
                </p>
                <ul className="mt-2 space-y-1 text-gray-600">
                  <li>
                    • Engineering tends to skew male-heavy in tech organizations
                  </li>
                  <li>• HR and Marketing often show better gender balance</li>
                  <li>• Aim for 40-60% balance in all departments</li>
                </ul>
              </motion.div>
            </div>
          </div>

          {/* Detailed Stats Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-6 grid gap-3 sm:grid-cols-4"
          >
            {overallGenderData.map((data, index) => (
              <motion.div
                key={data.gender}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + index * 0.1 }}
                className="rounded-lg border-2 p-3 text-center"
                style={{
                  borderColor: GENDER_COLORS[data.gender as Gender],
                  backgroundColor: `${GENDER_COLORS[data.gender as Gender]}10`,
                }}
              >
                <p className="text-xs font-medium text-gray-600">
                  {data.gender}
                </p>
                <p className="mt-1 text-xl font-bold text-gray-900">
                  {data.count}
                </p>
                <p className="text-xs text-gray-500">{data.percentage}%</p>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
