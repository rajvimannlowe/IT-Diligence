import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { MOCK_EMPLOYEES } from "../../data/mockEmployees";
import type { EmployeeDetailed } from "../../data/mockEmployees";
import { applyFilters, type EmployeeFilters } from "./AdvancedFilterPanel";
import { GitCompare, Users, TrendingUp } from "lucide-react";

const DEFAULT_FILTERS: EmployeeFilters = {
  ageRange: [22, 65],
  genders: [],
  departments: [],
  tenureRange: [0, 20],
  workLocations: [],
  stages: [],
  roleLevels: [],
};

export const SegmentComparisonView = () => {
  const [filtersA, setFiltersA] = useState<EmployeeFilters>(DEFAULT_FILTERS);
  const [filtersB, setFiltersB] = useState<EmployeeFilters>(DEFAULT_FILTERS);

  const segmentA = applyFilters(MOCK_EMPLOYEES, filtersA);
  const segmentB = applyFilters(MOCK_EMPLOYEES, filtersB);

  // Calculate metrics for each segment
  const getSegmentMetrics = (employees: EmployeeDetailed[]) => {
    if (employees.length === 0) {
      return {
        count: 0,
        avgAge: 0,
        avgTenure: 0,
        avgExperience: 0,
        avgStageClarity: 0,
        avgStability: 0,
        stageDistribution: {
          honeymoon: 0,
          "self-reflection": 0,
          "soul-searching": 0,
          "steady-state": 0,
        },
      };
    }

    const avgAge = Math.round(
      employees.reduce((sum, e) => sum + e.age, 0) / employees.length
    );
    const avgTenure = (
      employees.reduce((sum, e) => sum + e.tenureYears, 0) / employees.length
    ).toFixed(1);
    const avgExperience = Math.round(
      employees.reduce((sum, e) => sum + e.totalExperienceYears, 0) /
        employees.length
    );
    const avgStageClarity = Math.round(
      employees.reduce((sum, e) => sum + e.dominantStageStrength, 0) /
        employees.length
    );
    const avgStability = Math.round(
      employees.reduce((sum, e) => sum + e.stageStability, 0) / employees.length
    );

    const stageDistribution = {
      honeymoon: Math.round(
        employees.reduce((sum, e) => sum + e.stageDistribution.honeymoon, 0) /
          employees.length
      ),
      "self-reflection": Math.round(
        employees.reduce(
          (sum, e) => sum + e.stageDistribution["self-reflection"],
          0
        ) / employees.length
      ),
      "soul-searching": Math.round(
        employees.reduce(
          (sum, e) => sum + e.stageDistribution["soul-searching"],
          0
        ) / employees.length
      ),
      "steady-state": Math.round(
        employees.reduce(
          (sum, e) => sum + e.stageDistribution["steady-state"],
          0
        ) / employees.length
      ),
    };

    return {
      count: employees.length,
      avgAge,
      avgTenure,
      avgExperience,
      avgStageClarity,
      avgStability,
      stageDistribution,
    };
  };

  const metricsA = getSegmentMetrics(segmentA);
  const metricsB = getSegmentMetrics(segmentB);

  // Radar data
  const radarData = [
    {
      metric: "Honeymoon",
      segmentA: metricsA.stageDistribution.honeymoon,
      segmentB: metricsB.stageDistribution.honeymoon,
    },
    {
      metric: "Self-Reflection",
      segmentA: metricsA.stageDistribution["self-reflection"],
      segmentB: metricsB.stageDistribution["self-reflection"],
    },
    {
      metric: "Soul-Searching",
      segmentA: metricsA.stageDistribution["soul-searching"],
      segmentB: metricsB.stageDistribution["soul-searching"],
    },
    {
      metric: "Steady-State",
      segmentA: metricsA.stageDistribution["steady-state"],
      segmentB: metricsB.stageDistribution["steady-state"],
    },
  ];

  // Calculate dynamic domain based on actual data
  const allRadarValues = radarData.flatMap((d) => [d.segmentA, d.segmentB]);
  const maxRadarValue = Math.max(...allRadarValues);
  const radarDomainMax = Math.ceil(maxRadarValue / 10) * 10; // Round up to nearest 10

  // Comparison bar data
  const comparisonData = [
    {
      metric: "Avg Age",
      segmentA: metricsA.avgAge,
      segmentB: metricsB.avgAge,
    },
    {
      metric: "Avg Tenure",
      segmentA:
        typeof metricsA.avgTenure === "string"
          ? parseFloat(metricsA.avgTenure)
          : metricsA.avgTenure,
      segmentB:
        typeof metricsB.avgTenure === "string"
          ? parseFloat(metricsB.avgTenure)
          : metricsB.avgTenure,
    },
    {
      metric: "Avg Experience",
      segmentA: metricsA.avgExperience,
      segmentB: metricsB.avgExperience,
    },
    {
      metric: "Stage Clarity",
      segmentA: metricsA.avgStageClarity,
      segmentB: metricsB.avgStageClarity,
    },
    {
      metric: "Pattern Stability",
      segmentA: metricsA.avgStability,
      segmentB: metricsB.avgStability,
    },
  ];

  // Comparison row component
  const ComparisonRow = ({
    label,
    valueA,
    valueB,
    unit = "",
    higherBetter = true,
  }: {
    label: string;
    valueA: string | number;
    valueB: string | number;
    unit?: string;
    higherBetter?: boolean;
  }) => {
    const numA = typeof valueA === "string" ? parseFloat(valueA) : valueA;
    const numB = typeof valueB === "string" ? parseFloat(valueB) : valueB;
    const diff = Math.abs(numA - numB);
    const diffPercent =
      numB !== 0 ? (((numA - numB) / numB) * 100).toFixed(1) : "0";
    const aBetter = higherBetter ? numA > numB : numA < numB;
    const bBetter = higherBetter ? numB > numA : numB < numA;

    return (
      <div className="grid grid-cols-5 gap-4 border-b border-gray-200 py-3 text-sm">
        <div
          className={`text-right ${
            aBetter ? "font-bold text-blue-700" : "text-gray-600"
          }`}
        >
          {valueA}
          {unit}
          {aBetter && <TrendingUp className="ml-1 inline h-3 w-3" />}
        </div>
        <div className="col-span-3 text-center font-medium text-gray-700">
          {label}
        </div>
        <div
          className={`text-left ${
            bBetter ? "font-bold text-green-700" : "text-gray-600"
          }`}
        >
          {valueB}
          {unit}
          {bBetter && <TrendingUp className="ml-1 inline h-3 w-3" />}
        </div>
        {diff > 0 && (
          <div className="col-span-5 text-center text-xs text-gray-500">
            Difference: {diff.toFixed(1)}
            {unit} ({diffPercent}%)
          </div>
        )}
      </div>
    );
  };

  // Quick filter presets
  const applyPreset = (segment: "A" | "B", preset: string) => {
    const setFilters = segment === "A" ? setFiltersA : setFiltersB;

    switch (preset) {
      case "young":
        setFilters({ ...DEFAULT_FILTERS, ageRange: [22, 35] });
        break;
      case "experienced":
        setFilters({ ...DEFAULT_FILTERS, ageRange: [45, 65] });
        break;
      case "new-hires":
        setFilters({ ...DEFAULT_FILTERS, tenureRange: [0, 2] });
        break;
      case "veterans":
        setFilters({ ...DEFAULT_FILTERS, tenureRange: [10, 20] });
        break;
      case "engineering":
        setFilters({ ...DEFAULT_FILTERS, departments: ["engineering"] });
        break;
      case "sales":
        setFilters({ ...DEFAULT_FILTERS, departments: ["sales"] });
        break;
      case "steady-state":
        setFilters({ ...DEFAULT_FILTERS, stages: ["steady-state"] });
        break;
      case "soul-searching":
        setFilters({ ...DEFAULT_FILTERS, stages: ["soul-searching"] });
        break;
      default:
        setFilters(DEFAULT_FILTERS);
    }
  };

  const PRESETS = [
    { id: "all", label: "All Employees" },
    { id: "young", label: "Young (22-35)" },
    { id: "experienced", label: "Experienced (45+)" },
    { id: "new-hires", label: "New Hires (<2yr)" },
    { id: "veterans", label: "Veterans (10+yr)" },
    { id: "engineering", label: "Engineering" },
    { id: "sales", label: "Sales" },
    { id: "steady-state", label: "Steady-State" },
    { id: "soul-searching", label: "Soul-Searching" },
  ];

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
              <CardTitle>Segment Comparison Tool</CardTitle>
              <CardDescription>
                Compare two custom employee segments side-by-side
              </CardDescription>
            </div>
            <div className="rounded-lg bg-purple-500/10 p-3">
              <GitCompare className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Quick Presets */}
          <div className="mb-6 grid gap-4 lg:grid-cols-2">
            {/* Segment A Presets */}
            <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
              <h3 className="mb-3 text-sm font-semibold text-blue-900">
                Segment A Quick Presets
              </h3>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset("A", preset.id)}
                    className="rounded-lg border border-blue-300 bg-white px-3 py-1.5 text-xs font-medium text-blue-700 transition-all hover:bg-blue-100"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex items-center space-x-2 text-sm">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-blue-900">
                  {metricsA.count} employees
                </span>
              </div>
            </div>

            {/* Segment B Presets */}
            <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4">
              <h3 className="mb-3 text-sm font-semibold text-green-900">
                Segment B Quick Presets
              </h3>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset("B", preset.id)}
                    className="rounded-lg border border-green-300 bg-white px-3 py-1.5 text-xs font-medium text-green-700 transition-all hover:bg-green-100"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex items-center space-x-2 text-sm">
                <Users className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-green-900">
                  {metricsB.count} employees
                </span>
              </div>
            </div>
          </div>

          {/* Stage Distribution Radar */}
          <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
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
                  domain={[0, radarDomainMax]}
                  tick={{ fill: "#6b7280", fontSize: 10 }}
                />
                <Radar
                  name="Segment A"
                  dataKey="segmentA"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name="Segment B"
                  dataKey="segmentB"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Metrics Comparison Bar Chart */}
          <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              Key Metrics Comparison
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="metric"
                  tick={{ fill: "#6b7280", fontSize: 10 }}
                />
                <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="segmentA"
                  name="Segment A"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="segmentB"
                  name="Segment B"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Comparison Table */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              Detailed Comparison
            </h3>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <div className="grid grid-cols-5 gap-4 border-b-2 border-gray-300 bg-gray-50 p-4">
                <div className="text-right text-sm font-bold text-blue-700">
                  Segment A
                </div>
                <div className="col-span-3 text-center text-xs font-medium text-gray-500">
                  Metric
                </div>
                <div className="text-left text-sm font-bold text-green-700">
                  Segment B
                </div>
              </div>
              <div className="p-4">
                <ComparisonRow
                  label="Employee Count"
                  valueA={metricsA.count}
                  valueB={metricsB.count}
                  higherBetter={false}
                />
                <ComparisonRow
                  label="Average Age"
                  valueA={metricsA.avgAge}
                  valueB={metricsB.avgAge}
                  unit=" yrs"
                  higherBetter={false}
                />
                <ComparisonRow
                  label="Average Tenure"
                  valueA={metricsA.avgTenure}
                  valueB={metricsB.avgTenure}
                  unit=" yrs"
                />
                <ComparisonRow
                  label="Average Experience"
                  valueA={metricsA.avgExperience}
                  valueB={metricsB.avgExperience}
                  unit=" yrs"
                />
                <ComparisonRow
                  label="Stage Clarity"
                  valueA={metricsA.avgStageClarity}
                  valueB={metricsB.avgStageClarity}
                  unit="%"
                />
                <ComparisonRow
                  label="Pattern Stability"
                  valueA={metricsA.avgStability}
                  valueB={metricsB.avgStability}
                  unit="%"
                />
              </div>
            </div>
          </div>

          {/* Insights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 rounded-lg border border-gray-200 bg-gradient-to-r from-blue-50 to-green-50 p-4 text-sm"
          >
            <p className="font-semibold text-gray-900">Comparison Insights:</p>
            <ul className="mt-2 space-y-1 text-gray-600">
              <li>
                • Use quick presets above to quickly compare common employee
                segments
              </li>
              <li>
                • Segment A ({metricsA.count} employees) vs Segment B (
                {metricsB.count} employees)
              </li>
              <li>
                • Stage clarity difference:{" "}
                {Math.abs(metricsA.avgStageClarity - metricsB.avgStageClarity)}%
                {metricsA.avgStageClarity > metricsB.avgStageClarity
                  ? " (Segment A clearer)"
                  : " (Segment B clearer)"}
              </li>
              <li>
                • Click any preset to instantly apply filters and see results
              </li>
            </ul>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
