import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui";
import { motion } from "framer-motion";
import { useState } from "react";
import type {
  EmployeeDetailed,
  Gender,
  RoleLevel,
  WorkLocation,
} from "../../data/mockEmployees";
import type { DepartmentType } from "../../data/mockAnalytics";
import type { StageType } from "../../types";
import { Filter, X, RefreshCw } from "lucide-react";

export interface EmployeeFilters {
  ageRange: [number, number];
  genders: Gender[];
  departments: DepartmentType[];
  tenureRange: [number, number];
  workLocations: WorkLocation[];
  stages: StageType[];
  roleLevels: RoleLevel[];
}

interface AdvancedFilterPanelProps {
  onFilterChange: (filters: EmployeeFilters) => void;
  employeeCount: number;
  filteredCount: number;
}

const DEFAULT_FILTERS: EmployeeFilters = {
  ageRange: [22, 65],
  genders: [],
  departments: [],
  tenureRange: [0, 20],
  workLocations: [],
  stages: [],
  roleLevels: [],
};

export const AdvancedFilterPanel = ({
  onFilterChange,
  employeeCount,
  filteredCount,
}: AdvancedFilterPanelProps) => {
  const [filters, setFilters] = useState<EmployeeFilters>(DEFAULT_FILTERS);
  const [isExpanded, setIsExpanded] = useState(true);

  const GENDERS: Gender[] = [
    "Male",
    "Female",
    "Non-binary",
    "Prefer not to say",
  ];
  const DEPARTMENTS: DepartmentType[] = [
    "engineering",
    "sales",
    "marketing",
    "hr",
    "operations",
    "finance",
  ];
  const WORK_LOCATIONS: WorkLocation[] = ["Remote", "Hybrid", "On-site"];
  const STAGES: StageType[] = [
    "honeymoon",
    "self-reflection",
    "soul-searching",
    "steady-state",
  ];
  const ROLE_LEVELS: RoleLevel[] = [
    "Junior",
    "Mid",
    "Senior",
    "Lead",
    "Executive",
  ];

  const updateFilters = (newFilters: Partial<EmployeeFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    onFilterChange(DEFAULT_FILTERS);
  };

  const toggleArrayFilter = <T,>(
    array: T[],
    value: T,
    key: keyof EmployeeFilters
  ) => {
    const newArray = array.includes(value)
      ? array.filter((item) => item !== value)
      : [...array, value];
    updateFilters({ [key]: newArray });
  };

  const activeFilterCount =
    (filters.genders.length > 0 ? 1 : 0) +
    (filters.departments.length > 0 ? 1 : 0) +
    (filters.workLocations.length > 0 ? 1 : 0) +
    (filters.stages.length > 0 ? 1 : 0) +
    (filters.roleLevels.length > 0 ? 1 : 0) +
    (filters.ageRange[0] > 22 || filters.ageRange[1] < 65 ? 1 : 0) +
    (filters.tenureRange[0] > 0 || filters.tenureRange[1] < 20 ? 1 : 0);

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-blue-500/10 p-2">
              <Filter className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Advanced Filters</CardTitle>
              <CardDescription>
                Showing {filteredCount} of {employeeCount} employees
                {activeFilterCount > 0 && (
                  <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                    {activeFilterCount} active
                  </span>
                )}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={resetFilters}
              className="flex items-center space-x-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 transition-all hover:bg-gray-50"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded-lg border border-gray-300 bg-white p-1.5 text-gray-600 transition-all hover:bg-gray-50"
            >
              {isExpanded ? (
                <X className="h-4 w-4" />
              ) : (
                <Filter className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            {/* Age Range Slider */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Age Range: {filters.ageRange[0]} - {filters.ageRange[1]} years
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="22"
                  max="65"
                  value={filters.ageRange[0]}
                  onChange={(e) =>
                    updateFilters({
                      ageRange: [parseInt(e.target.value), filters.ageRange[1]],
                    })
                  }
                  className="flex-1"
                />
                <input
                  type="range"
                  min="22"
                  max="65"
                  value={filters.ageRange[1]}
                  onChange={(e) =>
                    updateFilters({
                      ageRange: [filters.ageRange[0], parseInt(e.target.value)],
                    })
                  }
                  className="flex-1"
                />
              </div>
            </div>

            {/* Tenure Range Slider */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Tenure Range: {filters.tenureRange[0]} -{" "}
                {filters.tenureRange[1]}+ years
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={filters.tenureRange[0]}
                  onChange={(e) =>
                    updateFilters({
                      tenureRange: [
                        parseInt(e.target.value),
                        filters.tenureRange[1],
                      ],
                    })
                  }
                  className="flex-1"
                />
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={filters.tenureRange[1]}
                  onChange={(e) =>
                    updateFilters({
                      tenureRange: [
                        filters.tenureRange[0],
                        parseInt(e.target.value),
                      ],
                    })
                  }
                  className="flex-1"
                />
              </div>
            </div>

            {/* Gender Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Gender
              </label>
              <div className="flex flex-wrap gap-2">
                {GENDERS.map((gender) => (
                  <button
                    key={gender}
                    onClick={() =>
                      toggleArrayFilter(filters.genders, gender, "genders")
                    }
                    className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
                      filters.genders.includes(gender)
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-gray-300 bg-white text-gray-600 hover:border-blue-400 hover:bg-blue-50"
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>

            {/* Department Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Department
              </label>
              <div className="flex flex-wrap gap-2">
                {DEPARTMENTS.map((dept) => (
                  <button
                    key={dept}
                    onClick={() =>
                      toggleArrayFilter(
                        filters.departments,
                        dept,
                        "departments"
                      )
                    }
                    className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
                      filters.departments.includes(dept)
                        ? "border-green-500 bg-green-500 text-white"
                        : "border-gray-300 bg-white text-gray-600 hover:border-green-400 hover:bg-green-50"
                    }`}
                  >
                    {dept.charAt(0).toUpperCase() + dept.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Work Location Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Work Location
              </label>
              <div className="flex flex-wrap gap-2">
                {WORK_LOCATIONS.map((location) => (
                  <button
                    key={location}
                    onClick={() =>
                      toggleArrayFilter(
                        filters.workLocations,
                        location,
                        "workLocations"
                      )
                    }
                    className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
                      filters.workLocations.includes(location)
                        ? "border-purple-500 bg-purple-500 text-white"
                        : "border-gray-300 bg-white text-gray-600 hover:border-purple-400 hover:bg-purple-50"
                    }`}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>

            {/* Dominant Stage Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Dominant Stage
              </label>
              <div className="flex flex-wrap gap-2">
                {STAGES.map((stage) => (
                  <button
                    key={stage}
                    onClick={() =>
                      toggleArrayFilter(filters.stages, stage, "stages")
                    }
                    className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
                      filters.stages.includes(stage)
                        ? "border-orange-500 bg-orange-500 text-white"
                        : "border-gray-300 bg-white text-gray-600 hover:border-orange-400 hover:bg-orange-50"
                    }`}
                  >
                    {stage.charAt(0).toUpperCase() +
                      stage.slice(1).replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Role Level Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Role Level
              </label>
              <div className="flex flex-wrap gap-2">
                {ROLE_LEVELS.map((role) => (
                  <button
                    key={role}
                    onClick={() =>
                      toggleArrayFilter(filters.roleLevels, role, "roleLevels")
                    }
                    className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
                      filters.roleLevels.includes(role)
                        ? "border-indigo-500 bg-indigo-500 text-white"
                        : "border-gray-300 bg-white text-gray-600 hover:border-indigo-400 hover:bg-indigo-50"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </CardContent>
      )}
    </Card>
  );
};

// Helper function to apply filters to employee list
export const applyFilters = (
  employees: EmployeeDetailed[],
  filters: EmployeeFilters
): EmployeeDetailed[] => {
  return employees.filter((emp) => {
    // Age filter
    if (emp.age < filters.ageRange[0] || emp.age > filters.ageRange[1])
      return false;

    // Tenure filter
    if (
      emp.tenureYears < filters.tenureRange[0] ||
      emp.tenureYears > filters.tenureRange[1]
    )
      return false;

    // Gender filter
    if (filters.genders.length > 0 && !filters.genders.includes(emp.gender))
      return false;

    // Department filter
    if (
      filters.departments.length > 0 &&
      !filters.departments.includes(emp.department as DepartmentType)
    )
      return false;

    // Work location filter
    if (
      filters.workLocations.length > 0 &&
      !filters.workLocations.includes(emp.workLocation)
    )
      return false;

    // Stage filter
    if (
      filters.stages.length > 0 &&
      !filters.stages.includes(emp.dominantStage)
    )
      return false;

    // Role level filter
    if (
      filters.roleLevels.length > 0 &&
      !filters.roleLevels.includes(emp.roleLevel)
    )
      return false;

    return true;
  });
};
