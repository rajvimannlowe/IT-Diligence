/**
 * Chart Helper Utilities
 * Dynamic domain calculation, optimal ticks, and formatting
 */

/**
 * Calculate dynamic Y-axis domain based on data with padding
 * @param data - Array of data objects
 * @param key - Key to extract values from
 * @param padding - Padding percentage (default 0.1 = 10%)
 * @returns [min, max] domain tuple
 */
export const getDynamicDomain = (
  data: any[],
  key: string,
  padding: number = 0.1
): [number, number] => {
  if (!data || data.length === 0) return [0, 100];

  const values = data
    .map(d => {
      // Handle nested keys (e.g., "stageDistribution.honeymoon")
      const keys = key.split('.');
      let value = d;
      for (const k of keys) {
        value = value?.[k];
      }
      return value;
    })
    .filter(v => typeof v === 'number' && !isNaN(v));

  if (values.length === 0) return [0, 100];

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;

  // If range is very small (all values similar), use fixed range
  if (range < 5) {
    const center = (min + max) / 2;
    return [Math.max(0, center - 25), center + 25];
  }

  const pad = range * padding;

  return [Math.max(0, Math.floor(min - pad)), Math.ceil(max + pad)];
};

/**
 * Generate optimal tick values for axis
 * @param min - Minimum value
 * @param max - Maximum value
 * @param targetTickCount - Desired number of ticks (default 5)
 * @returns Array of tick values
 */
export const getOptimalTicks = (
  min: number,
  max: number,
  targetTickCount: number = 5
): number[] => {
  const range = max - min;
  if (range === 0) return [min];

  const roughStep = range / (targetTickCount - 1);

  // Find nice step values (1, 2, 5, 10, 20, 25, 50, 100, etc.)
  const niceSteps = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000];
  const step = niceSteps.find(s => s >= roughStep) || Math.ceil(roughStep);

  const ticks: number[] = [];
  const startTick = Math.floor(min / step) * step;

  for (let tick = startTick; tick <= max; tick += step) {
    ticks.push(tick);
  }

  // Ensure we have at least 2 ticks
  if (ticks.length < 2) {
    ticks.push(max);
  }

  return ticks;
};

/**
 * Format axis label with appropriate units
 * @param value - Numeric value
 * @param type - Type of value ('percentage', 'number', 'currency', 'time')
 * @returns Formatted string
 */
export const formatAxisLabel = (
  value: number,
  type: 'percentage' | 'number' | 'currency' | 'time' = 'number'
): string => {
  switch (type) {
    case 'percentage':
      return `${value}%`;
    case 'currency':
      if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
      return `$${value}`;
    case 'time':
      if (value >= 60) return `${Math.floor(value / 60)}h ${value % 60}m`;
      return `${value}m`;
    case 'number':
    default:
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
      return value.toString();
  }
};

/**
 * Calculate domain for multiple data keys (useful for stacked charts)
 * @param data - Array of data objects
 * @param keys - Array of keys to sum
 * @param padding - Padding percentage (default 0.1)
 * @returns [min, max] domain tuple
 */
export const getStackedDomain = (
  data: any[],
  keys: string[],
  padding: number = 0.1
): [number, number] => {
  if (!data || data.length === 0) return [0, 100];

  const stackedTotals = data.map(item =>
    keys.reduce((sum, key) => {
      const value = item[key];
      return sum + (typeof value === 'number' ? value : 0);
    }, 0)
  );

  const max = Math.max(...stackedTotals);
  const pad = max * padding;

  return [0, Math.ceil(max + pad)];
};

/**
 * Determine if Y-axis should start at 0 or use dynamic range
 * @param data - Array of data objects
 * @param key - Key to extract values from
 * @returns True if axis should start at 0
 */
export const shouldStartAtZero = (data: any[], key: string): boolean => {
  const values = data.map(d => d[key]).filter(v => typeof v === 'number');
  if (values.length === 0) return true;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;

  // If min is close to 0 (within 10% of range), start at 0
  if (min < range * 0.1) return true;

  // If all values are positive and min is less than 20% of max, start at 0
  if (min > 0 && min < max * 0.2) return true;

  return false;
};

/**
 * Round value to nearest nice number
 * @param value - Value to round
 * @returns Rounded value
 */
export const roundToNice = (value: number): number => {
  if (value === 0) return 0;

  const magnitude = Math.pow(10, Math.floor(Math.log10(Math.abs(value))));
  const normalized = value / magnitude;

  let rounded: number;
  if (normalized < 1.5) rounded = 1;
  else if (normalized < 3) rounded = 2;
  else if (normalized < 7) rounded = 5;
  else rounded = 10;

  return rounded * magnitude;
};
