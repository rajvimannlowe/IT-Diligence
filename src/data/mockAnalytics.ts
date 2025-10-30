import type { StageDistribution, StageType } from '@/types';

// Department types
export type DepartmentType = 'engineering' | 'sales' | 'marketing' | 'hr' | 'operations' | 'finance';

export interface Department {
  id: DepartmentType;
  name: string;
  employeeCount: number;
  assessmentCompletionRate: number; // percentage
  avgHealthScore: number; // 0-100
  stageDistribution: StageDistribution;
}

// Time-series data point
export interface TimeSeriesDataPoint {
  date: string; // ISO date string
  timestamp: number;
  stageDistribution: StageDistribution;
  participationRate: number; // percentage
  avgCompletionTime: number; // minutes
}

// Assessment activity
export interface AssessmentActivity {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  department: DepartmentType;
  completedAt: string; // ISO date string
  dominantStage: StageType;
  stageDistribution: StageDistribution;
  completionTime: number; // minutes
}

// Organization-wide metrics
export interface OrganizationMetrics {
  totalEmployees: number;
  assessmentsCompleted: number;
  assessmentCompletionRate: number; // percentage
  avgHealthScore: number; // 0-100
  avgCompletionTime: number; // minutes
  activeUsers30Days: number;
  stageDistribution: StageDistribution;
}

// Mock Departments Data
export const MOCK_DEPARTMENTS: Department[] = [
  {
    id: 'engineering',
    name: 'Engineering',
    employeeCount: 45,
    assessmentCompletionRate: 87,
    avgHealthScore: 68,
    stageDistribution: {
      honeymoon: 15,
      'self-reflection': 35,
      'soul-searching': 30,
      'steady-state': 20,
    },
  },
  {
    id: 'sales',
    name: 'Sales',
    employeeCount: 32,
    assessmentCompletionRate: 94,
    avgHealthScore: 72,
    stageDistribution: {
      honeymoon: 25,
      'self-reflection': 20,
      'soul-searching': 25,
      'steady-state': 30,
    },
  },
  {
    id: 'marketing',
    name: 'Marketing',
    employeeCount: 28,
    assessmentCompletionRate: 82,
    avgHealthScore: 65,
    stageDistribution: {
      honeymoon: 10,
      'self-reflection': 40,
      'soul-searching': 35,
      'steady-state': 15,
    },
  },
  {
    id: 'hr',
    name: 'Human Resources',
    employeeCount: 12,
    assessmentCompletionRate: 100,
    avgHealthScore: 78,
    stageDistribution: {
      honeymoon: 20,
      'self-reflection': 25,
      'soul-searching': 20,
      'steady-state': 35,
    },
  },
  {
    id: 'operations',
    name: 'Operations',
    employeeCount: 38,
    assessmentCompletionRate: 76,
    avgHealthScore: 61,
    stageDistribution: {
      honeymoon: 12,
      'self-reflection': 30,
      'soul-searching': 38,
      'steady-state': 20,
    },
  },
  {
    id: 'finance',
    name: 'Finance',
    employeeCount: 18,
    assessmentCompletionRate: 89,
    avgHealthScore: 70,
    stageDistribution: {
      honeymoon: 18,
      'self-reflection': 28,
      'soul-searching': 24,
      'steady-state': 30,
    },
  },
];

// Generate time-series data for last 90 days
const generateTimeSeriesData = (): TimeSeriesDataPoint[] => {
  const data: TimeSeriesDataPoint[] = [];
  const now = Date.now();
  const msPerDay = 24 * 60 * 60 * 1000;

  for (let i = 89; i >= 0; i--) {
    const timestamp = now - i * msPerDay;
    const date = new Date(timestamp);

    // Simulate gradual shift from honeymoon to more mature stages over time
    const progress = (89 - i) / 89; // 0 to 1

    data.push({
      date: date.toISOString().split('T')[0],
      timestamp,
      stageDistribution: {
        honeymoon: Math.round(30 - progress * 10), // 30% -> 20%
        'self-reflection': Math.round(25 + progress * 5), // 25% -> 30%
        'soul-searching': Math.round(25 + progress * 3), // 25% -> 28%
        'steady-state': Math.round(20 + progress * 2), // 20% -> 22%
      },
      participationRate: Math.min(50 + progress * 35 + Math.random() * 5, 95), // 50% -> 85%
      avgCompletionTime: 12 - progress * 2 + Math.random() * 2, // 12min -> 10min (getting faster)
    });
  }

  return data;
};

export const MOCK_TIME_SERIES: TimeSeriesDataPoint[] = generateTimeSeriesData();

// Generate recent assessment activities
const generateRecentActivities = (): AssessmentActivity[] => {
  const activities: AssessmentActivity[] = [];
  const now = Date.now();
  const msPerHour = 60 * 60 * 1000;

  const sampleUsers = [
    { name: 'Sarah Chen', role: 'Senior Engineer', dept: 'engineering' as DepartmentType },
    { name: 'Michael Torres', role: 'Sales Manager', dept: 'sales' as DepartmentType },
    { name: 'Emily Rodriguez', role: 'Marketing Specialist', dept: 'marketing' as DepartmentType },
    { name: 'David Kim', role: 'HR Business Partner', dept: 'hr' as DepartmentType },
    { name: 'Jessica Brown', role: 'Operations Lead', dept: 'operations' as DepartmentType },
    { name: 'Alex Johnson', role: 'Financial Analyst', dept: 'finance' as DepartmentType },
    { name: 'Maria Garcia', role: 'Product Designer', dept: 'engineering' as DepartmentType },
    { name: 'James Wilson', role: 'Account Executive', dept: 'sales' as DepartmentType },
    { name: 'Lisa Anderson', role: 'Content Manager', dept: 'marketing' as DepartmentType },
    { name: 'Robert Lee', role: 'Recruiter', dept: 'hr' as DepartmentType },
  ];

  const stageOptions: StageType[] = ['honeymoon', 'self-reflection', 'soul-searching', 'steady-state'];

  for (let i = 0; i < 20; i++) {
    const user = sampleUsers[i % sampleUsers.length];
    const dominantStage = stageOptions[Math.floor(Math.random() * 4)];

    // Generate realistic distribution with dominant stage
    const distributions: Record<StageType, StageDistribution> = {
      honeymoon: { honeymoon: 45, 'self-reflection': 25, 'soul-searching': 20, 'steady-state': 10 },
      'self-reflection': { honeymoon: 20, 'self-reflection': 40, 'soul-searching': 25, 'steady-state': 15 },
      'soul-searching': { honeymoon: 15, 'self-reflection': 25, 'soul-searching': 40, 'steady-state': 20 },
      'steady-state': { honeymoon: 10, 'self-reflection': 20, 'soul-searching': 25, 'steady-state': 45 },
    };

    activities.push({
      id: `activity-${i + 1}`,
      userId: `user-${i + 1}`,
      userName: user.name,
      userRole: user.role,
      department: user.dept,
      completedAt: new Date(now - i * msPerHour * 3).toISOString(),
      dominantStage,
      stageDistribution: distributions[dominantStage],
      completionTime: 8 + Math.random() * 8, // 8-16 minutes
    });
  }

  return activities.sort((a, b) =>
    new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );
};

export const MOCK_RECENT_ACTIVITIES: AssessmentActivity[] = generateRecentActivities();

// Organization-wide metrics
export const MOCK_ORG_METRICS: OrganizationMetrics = {
  totalEmployees: MOCK_DEPARTMENTS.reduce((sum, dept) => sum + dept.employeeCount, 0),
  assessmentsCompleted: Math.round(
    MOCK_DEPARTMENTS.reduce((sum, dept) =>
      sum + (dept.employeeCount * dept.assessmentCompletionRate / 100), 0
    )
  ),
  assessmentCompletionRate: Math.round(
    MOCK_DEPARTMENTS.reduce((sum, dept) =>
      sum + dept.assessmentCompletionRate, 0
    ) / MOCK_DEPARTMENTS.length
  ),
  avgHealthScore: Math.round(
    MOCK_DEPARTMENTS.reduce((sum, dept) => sum + dept.avgHealthScore, 0) / MOCK_DEPARTMENTS.length
  ),
  avgCompletionTime: 11.5,
  activeUsers30Days: 142,
  stageDistribution: {
    honeymoon: 18,
    'self-reflection': 30,
    'soul-searching': 28,
    'steady-state': 24,
  },
};

// Helper functions for filtering data
export const getTimeSeriesDataByRange = (days: 7 | 30 | 90): TimeSeriesDataPoint[] => {
  return MOCK_TIME_SERIES.slice(-days);
};

export const getActivitiesByDepartment = (department: DepartmentType): AssessmentActivity[] => {
  return MOCK_RECENT_ACTIVITIES.filter(activity => activity.department === department);
};

export const getActivitiesByDateRange = (startDate: Date, endDate: Date): AssessmentActivity[] => {
  return MOCK_RECENT_ACTIVITIES.filter(activity => {
    const activityDate = new Date(activity.completedAt);
    return activityDate >= startDate && activityDate <= endDate;
  });
};

// Calculate health score from stage distribution
export const calculateHealthScore = (distribution: StageDistribution): number => {
  // Higher weights for more mature stages
  const weights = {
    honeymoon: 0.6,
    'self-reflection': 0.8,
    'soul-searching': 0.7,
    'steady-state': 1.0,
  };

  const score =
    distribution.honeymoon * weights.honeymoon +
    distribution['self-reflection'] * weights['self-reflection'] +
    distribution['soul-searching'] * weights['soul-searching'] +
    distribution['steady-state'] * weights['steady-state'];

  return Math.round(score);
};
