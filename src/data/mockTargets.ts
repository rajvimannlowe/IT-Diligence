import type { StageDistribution } from '@/types';

// Target stage distributions for different organizational contexts
export interface TargetScenario {
  id: string;
  name: string;
  description: string;
  targetDistribution: StageDistribution;
  context: string;
}

export const TARGET_SCENARIOS: TargetScenario[] = [
  {
    id: 'growth',
    name: 'High Growth Phase',
    description: 'Ideal for scaling organizations with rapid hiring',
    targetDistribution: {
      honeymoon: 35,
      'self-reflection': 30,
      'soul-searching': 20,
      'steady-state': 15,
    },
    context: 'Fast-paced growth, new hires onboarding, expansion',
  },
  {
    id: 'stable',
    name: 'Stable Operations',
    description: 'Mature organization with established processes',
    targetDistribution: {
      honeymoon: 15,
      'self-reflection': 25,
      'soul-searching': 20,
      'steady-state': 40,
    },
    context: 'Predictable environment, established team, routine operations',
  },
  {
    id: 'transformation',
    name: 'Digital Transformation',
    description: 'Organization undergoing major tech/process changes',
    targetDistribution: {
      honeymoon: 20,
      'self-reflection': 35,
      'soul-searching': 30,
      'steady-state': 15,
    },
    context: 'Tech revolution, process overhaul, cultural shift',
  },
  {
    id: 'balanced',
    name: 'Balanced Mix',
    description: 'Healthy distribution across all stages',
    targetDistribution: {
      honeymoon: 25,
      'self-reflection': 30,
      'soul-searching': 25,
      'steady-state': 20,
    },
    context: 'General purpose, adaptable to various situations',
  },
];

// Calculate gap between current and target
export const calculateGap = (
  current: StageDistribution,
  target: StageDistribution
): StageDistribution => {
  return {
    honeymoon: target.honeymoon - current.honeymoon,
    'self-reflection': target['self-reflection'] - current['self-reflection'],
    'soul-searching': target['soul-searching'] - current['soul-searching'],
    'steady-state': target['steady-state'] - current['steady-state'],
  };
};

// Calculate total gap magnitude (sum of absolute differences)
export const calculateTotalGap = (gap: StageDistribution): number => {
  return Math.abs(gap.honeymoon) +
    Math.abs(gap['self-reflection']) +
    Math.abs(gap['soul-searching']) +
    Math.abs(gap['steady-state']);
};

// Determine gap severity
export const getGapSeverity = (totalGap: number): { level: string; color: string; description: string } => {
  if (totalGap <= 20) return {
    level: 'Low',
    color: 'text-green-600',
    description: 'Minor adjustments needed',
  };
  if (totalGap <= 40) return {
    level: 'Moderate',
    color: 'text-yellow-600',
    description: 'Some interventions recommended',
  };
  if (totalGap <= 60) return {
    level: 'High',
    color: 'text-orange-600',
    description: 'Significant changes required',
  };
  return {
    level: 'Critical',
    color: 'text-red-600',
    description: 'Urgent organizational attention needed',
  };
};

// Generate recommendations based on gap
export const generateRecommendations = (gap: StageDistribution): string[] => {
  const recommendations: string[] = [];

  if (gap.honeymoon > 10) {
    recommendations.push('📈 Increase hiring and onboarding activities to bring in fresh perspectives');
  } else if (gap.honeymoon < -10) {
    recommendations.push('⚖️ Focus on retention programs to reduce turnover and maintain stability');
  }

  if (gap['self-reflection'] > 10) {
    recommendations.push('🔍 Implement more feedback mechanisms and self-assessment opportunities');
  } else if (gap['self-reflection'] < -10) {
    recommendations.push('🚀 Move from analysis to action - reduce over-reflection paralysis');
  }

  if (gap['soul-searching'] > 10) {
    recommendations.push('💡 Create forums for questioning and innovation - encourage constructive challenge');
  } else if (gap['soul-searching'] < -10) {
    recommendations.push('🛡️ Provide more clarity and stability to reduce organizational uncertainty');
  }

  if (gap['steady-state'] > 10) {
    recommendations.push('🎯 Establish routines, processes, and documentation for consistency');
  } else if (gap['steady-state'] < -10) {
    recommendations.push('⚡ Introduce change initiatives to prevent stagnation and complacency');
  }

  if (recommendations.length === 0) {
    recommendations.push('✅ Organization is well-aligned with target state - maintain current trajectory');
  }

  return recommendations;
};

// Stage transition probabilities (for flow visualization)
export interface StageTransition {
  from: keyof StageDistribution;
  to: keyof StageDistribution;
  value: number; // number of employees
  percentage: number;
}

export const MOCK_STAGE_TRANSITIONS: StageTransition[] = [
  // From Honeymoon
  { from: 'honeymoon', to: 'self-reflection', value: 12, percentage: 40 },
  { from: 'honeymoon', to: 'soul-searching', value: 5, percentage: 17 },
  { from: 'honeymoon', to: 'steady-state', value: 8, percentage: 27 },

  // From Self-Reflection
  { from: 'self-reflection', to: 'honeymoon', value: 6, percentage: 12 },
  { from: 'self-reflection', to: 'soul-searching', value: 18, percentage: 35 },
  { from: 'self-reflection', to: 'steady-state', value: 14, percentage: 27 },

  // From Soul-Searching
  { from: 'soul-searching', to: 'honeymoon', value: 4, percentage: 10 },
  { from: 'soul-searching', to: 'self-reflection', value: 15, percentage: 37 },
  { from: 'soul-searching', to: 'steady-state', value: 10, percentage: 25 },

  // From Steady-State
  { from: 'steady-state', to: 'honeymoon', value: 7, percentage: 17 },
  { from: 'steady-state', to: 'self-reflection', value: 12, percentage: 29 },
  { from: 'steady-state', to: 'soul-searching', value: 8, percentage: 19 },
];
