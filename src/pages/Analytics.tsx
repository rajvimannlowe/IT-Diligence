/**
 * Analytics Page - ENHANCED
 * Advanced analytics with tabbed navigation, gap analysis, predictions, and risk assessment
 */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  StageRadarChart,
  HistoricalTrendsChart,
  DepartmentComparisonChart,
  AnalyticsFilters,
  CurrentVsTargetChart,
  GapAnalysisReport,
  StageTransitionMatrix,
  RiskHeatmap,
  PredictiveTrendsChart,
  EmployeeStageQuadrant,
  AgeDistributionChart,
  GenderBreakdownChart,
  ExperienceMatrixHeatmap,
  RoleLevelPyramid,
  WorkLocationDistribution,
  ClusterScatterPlot,
  ClusterPersonaCards,
  ClusterDistributionChart,
  ClusterComparison,
  AdvancedFilterPanel,
  SegmentComparisonView,
  applyFilters,
} from "../components/analytics";
import type { EmployeeFilters } from "../components/analytics";
import { performClustering } from "../utils/clustering";
import { MOCK_EMPLOYEES } from "../data/mockEmployees";
import type { DateRange } from "../components/analytics";
import {
  MOCK_ORG_METRICS,
  MOCK_DEPARTMENTS,
  getTimeSeriesDataByRange,
} from "../data/mockAnalytics";
import type { DepartmentType } from "../data/mockAnalytics";
import {
  BarChart3,
  GitCompareArrows,
  AlertTriangle,
  TrendingUp,
  Target,
  Users,
  Network,
  Search,
} from "lucide-react";

type TabType =
  | "overview"
  | "gap-analysis"
  | "transitions"
  | "risk"
  | "predictions"
  | "demographics"
  | "clusters"
  | "explore";

interface Tab {
  id: TabType;
  label: string;
  icon: any;
  description: string;
}

const TABS: Tab[] = [
  {
    id: "overview",
    label: "Overview",
    icon: BarChart3,
    description: "Current state and historical trends",
  },
  {
    id: "demographics",
    label: "Demographics",
    icon: Users,
    description: "Employee demographics and distributions",
  },
  {
    id: "clusters",
    label: "Cluster Analysis",
    icon: Network,
    description: "AI-powered employee persona clustering",
  },
  {
    id: "gap-analysis",
    label: "Gap Analysis",
    icon: Target,
    description: "Current vs target distribution",
  },
  {
    id: "transitions",
    label: "Stage Flow",
    icon: GitCompareArrows,
    description: "Employee movement patterns",
  },
  {
    id: "risk",
    label: "Risk Assessment",
    icon: AlertTriangle,
    description: "Identify at-risk departments",
  },
  {
    id: "predictions",
    label: "Predictions",
    icon: TrendingUp,
    description: "Future trend forecasts",
  },
  {
    id: "explore",
    label: "Explore",
    icon: Search,
    description: "Advanced filtering and segment comparison",
  },
];

const Analytics = () => {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [dateRange, setDateRange] = useState<DateRange>(30);
  const [selectedDepartment, setSelectedDepartment] = useState<
    DepartmentType | "all"
  >("all");

  // Get filtered data
  const timeSeriesData = getTimeSeriesDataByRange(dateRange);

  // Get current distribution (from most recent time series data or org metrics)
  const currentDistribution =
    timeSeriesData.length > 0
      ? timeSeriesData[timeSeriesData.length - 1].stageDistribution
      : MOCK_ORG_METRICS.stageDistribution;

  // Filter departments if needed
  const filteredDepartments =
    selectedDepartment === "all"
      ? MOCK_DEPARTMENTS
      : MOCK_DEPARTMENTS.filter((dept) => dept.id === selectedDepartment);

  // Perform clustering (memoized for performance)
  const clusters = useMemo(() => performClustering(), []);

  // Employee filtering state for Explore tab
  const [employeeFilters, setEmployeeFilters] = useState<EmployeeFilters>({
    ageRange: [22, 65],
    genders: [],
    departments: [],
    tenureRange: [0, 20],
    workLocations: [],
    stages: [],
    roleLevels: [],
  });

  const filteredEmployees = useMemo(
    () => applyFilters(MOCK_EMPLOYEES, employeeFilters),
    [employeeFilters]
  );

  // Handle export (mocked)
  const handleExport = () => {
    const filename = `analytics-report-${activeTab}-${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    alert(
      `Exporting ${
        TABS.find((t) => t.id === activeTab)?.label
      } report as "${filename}"\n\nThis is a mock export. In production, this would generate a comprehensive PDF report.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
        <p className="mt-1 text-gray-600">
          Comprehensive insights into organizational health with gap analysis,
          predictions, and risk assessment
        </p>
      </motion.div>

      {/* Filters */}
      <AnalyticsFilters
        selectedDateRange={dateRange}
        onDateRangeChange={setDateRange}
        selectedDepartment={selectedDepartment}
        onDepartmentChange={setSelectedDepartment}
        onExport={handleExport}
      />

      {/* Tabbed Navigation */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex space-x-1 overflow-x-auto p-2">
            {TABS.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`group relative flex items-center space-x-2 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-brand-teal text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      isActive
                        ? "text-white"
                        : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                  <span className="whitespace-nowrap">{tab.label}</span>

                  {/* Hover tooltip */}
                  <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 scale-0 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg transition-transform group-hover:scale-100">
                    {tab.description}
                    <div className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-gray-900" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Top Row: Radar + Department Comparison */}
                <div className="grid gap-6 lg:grid-cols-2">
                  <StageRadarChart
                    distribution={currentDistribution}
                    title="Current Stage Distribution"
                    description="360° view of organizational health mix"
                  />
                  <DepartmentComparisonChart
                    departments={filteredDepartments}
                    title={
                      selectedDepartment === "all"
                        ? "All Departments"
                        : `${filteredDepartments[0]?.name} Department`
                    }
                    description="Comparative stage distribution analysis"
                  />
                </div>

                {/* Historical Trends (Full Width) */}
                <HistoricalTrendsChart
                  data={timeSeriesData}
                  title={`Stage Distribution Trends (Last ${dateRange} days)`}
                  description="Track how organizational health has evolved over time"
                />

                {/* Employee Stage Quadrant (Full Width) */}
                <EmployeeStageQuadrant />
              </motion.div>
            )}

            {/* Demographics Tab */}
            {activeTab === "demographics" && (
              <motion.div
                key="demographics"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Age Distribution */}
                <AgeDistributionChart />

                {/* Gender and Location (Row) */}
                <div className="grid gap-6 lg:grid-cols-2">
                  <GenderBreakdownChart />
                  <WorkLocationDistribution />
                </div>

                {/* Experience Matrix Heatmap (Full Width) */}
                <ExperienceMatrixHeatmap />

                {/* Role Level Pyramid (Full Width) */}
                <RoleLevelPyramid />
              </motion.div>
            )}

            {/* Cluster Analysis Tab */}
            {activeTab === "clusters" && (
              <motion.div
                key="clusters"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Cluster Persona Cards */}
                <ClusterPersonaCards clusters={clusters} />

                {/* Cluster Distribution and Scatter (Row) */}
                <div className="grid gap-6 lg:grid-cols-2">
                  <ClusterDistributionChart clusters={clusters} />
                  <ClusterScatterPlot clusters={clusters} />
                </div>

                {/* Cluster Comparison (Full Width) */}
                <ClusterComparison clusters={clusters} />
              </motion.div>
            )}

            {/* Gap Analysis Tab */}
            {activeTab === "gap-analysis" && (
              <motion.div
                key="gap-analysis"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <CurrentVsTargetChart
                  currentDistribution={currentDistribution}
                />
                <GapAnalysisReport currentDistribution={currentDistribution} />
              </motion.div>
            )}

            {/* Stage Transitions Tab */}
            {activeTab === "transitions" && (
              <motion.div
                key="transitions"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <StageTransitionMatrix />
              </motion.div>
            )}

            {/* Risk Assessment Tab */}
            {activeTab === "risk" && (
              <motion.div
                key="risk"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <RiskHeatmap departments={MOCK_DEPARTMENTS} />
              </motion.div>
            )}

            {/* Predictions Tab */}
            {activeTab === "predictions" && (
              <motion.div
                key="predictions"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <PredictiveTrendsChart historicalData={timeSeriesData} />
              </motion.div>
            )}

            {/* Explore Tab */}
            {activeTab === "explore" && (
              <motion.div
                key="explore"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Advanced Filter Panel */}
                <AdvancedFilterPanel
                  onFilterChange={setEmployeeFilters}
                  employeeCount={MOCK_EMPLOYEES.length}
                  filteredCount={filteredEmployees.length}
                />

                {/* Segment Comparison */}
                <SegmentComparisonView />

                {/* Filtered Employee List Summary */}
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Filtered Results: {filteredEmployees.length} employees
                  </h3>
                  {filteredEmployees.length > 0 ? (
                    <div className="grid gap-3">
                      {filteredEmployees.slice(0, 10).map((emp) => (
                        <div
                          key={emp.id}
                          className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 hover:bg-gray-100"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {emp.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {emp.roleLevel} - {emp.department} | Age:{" "}
                              {emp.age} | Tenure: {emp.tenureYears.toFixed(1)}yr
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-700">
                                Clarity: {Math.round(emp.dominantStageStrength)}
                                %
                              </p>
                              <p className="text-sm text-gray-600">
                                Stability: {Math.round(emp.stageStability)}%
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {filteredEmployees.length > 10 && (
                        <p className="text-center text-sm text-gray-500">
                          + {filteredEmployees.length - 10} more employees
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500">
                      No employees match the selected filters.
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
