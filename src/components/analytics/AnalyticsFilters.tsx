import { Card, CardContent } from "../../components/ui";
import { Button } from "../../components/ui";
import { motion } from "framer-motion";
import { Calendar, Download, Filter } from "lucide-react";
import type { DepartmentType } from "../../data/mockAnalytics";

export type DateRange = 7 | 30 | 90;

interface AnalyticsFiltersProps {
  selectedDateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  selectedDepartment: DepartmentType | "all";
  onDepartmentChange: (dept: DepartmentType | "all") => void;
  onExport: () => void;
}

const departments: Array<{ id: DepartmentType | "all"; label: string }> = [
  { id: "all", label: "All Departments" },
  { id: "engineering", label: "Engineering" },
  { id: "sales", label: "Sales" },
  { id: "marketing", label: "Marketing" },
  { id: "hr", label: "HR" },
  { id: "operations", label: "Operations" },
  { id: "finance", label: "Finance" },
];

const dateRanges: Array<{ value: DateRange; label: string }> = [
  { value: 7, label: "Last 7 days" },
  { value: 30, label: "Last 30 days" },
  { value: 90, label: "Last 90 days" },
];

export const AnalyticsFilters = ({
  selectedDateRange,
  onDateRangeChange,
  selectedDepartment,
  onDepartmentChange,
  onExport,
}: AnalyticsFiltersProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Date Range Filter */}
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Time Period:
              </span>
              <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
                {dateRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => onDateRangeChange(range.value)}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                      selectedDateRange === range.value
                        ? "bg-white text-brand-teal shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Department Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Department:
              </span>
              <select
                value={selectedDepartment}
                onChange={(e) =>
                  onDepartmentChange(e.target.value as DepartmentType | "all")
                }
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-all hover:border-gray-400 focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal/20"
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Export Button */}
            <Button
              variant="outline"
              size="md"
              onClick={onExport}
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
