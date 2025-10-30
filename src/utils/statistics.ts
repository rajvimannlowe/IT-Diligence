/**
 * Statistical Utility Functions
 * For data generation and analysis
 */

/**
 * Calculate mean (average) of an array of numbers
 */
export const mean = (values: number[]): number => {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
};

/**
 * Calculate standard deviation
 */
export const standardDeviation = (values: number[]): number => {
  if (values.length === 0) return 0;
  const avg = mean(values);
  const squaredDiffs = values.map(v => Math.pow(v - avg, 2));
  return Math.sqrt(mean(squaredDiffs));
};

/**
 * Generate a random number from normal distribution using Box-Muller transform
 * @param mean - Mean of the distribution
 * @param stdDev - Standard deviation
 * @returns Random number from normal distribution
 */
export const normalDistribution = (mean: number, stdDev: number): number => {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return z * stdDev + mean;
};

/**
 * Calculate correlation between two arrays
 */
export const correlation = (x: number[], y: number[]): number => {
  if (x.length !== y.length || x.length === 0) return 0;

  const n = x.length;
  const meanX = mean(x);
  const meanY = mean(y);

  let numerator = 0;
  let denomX = 0;
  let denomY = 0;

  for (let i = 0; i < n; i++) {
    const diffX = x[i] - meanX;
    const diffY = y[i] - meanY;
    numerator += diffX * diffY;
    denomX += diffX * diffX;
    denomY += diffY * diffY;
  }

  if (denomX === 0 || denomY === 0) return 0;
  return numerator / Math.sqrt(denomX * denomY);
};

/**
 * Calculate Euclidean distance between two points
 */
export const euclideanDistance = (p1: number[], p2: number[]): number => {
  if (p1.length !== p2.length) throw new Error('Points must have same dimensions');

  let sum = 0;
  for (let i = 0; i < p1.length; i++) {
    sum += Math.pow(p1[i] - p2[i], 2);
  }
  return Math.sqrt(sum);
};

/**
 * Normalize array to 0-1 scale
 */
export const normalize = (values: number[]): number[] => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;

  if (range === 0) return values.map(() => 0.5);
  return values.map(v => (v - min) / range);
};

/**
 * Normalize matrix (2D array) column-wise
 */
export const normalizeMatrix = (matrix: number[][]): number[][] => {
  if (matrix.length === 0) return matrix;

  const numCols = matrix[0].length;
  const normalized: number[][] = Array(matrix.length).fill(0).map(() => Array(numCols).fill(0));

  // Normalize each column
  for (let col = 0; col < numCols; col++) {
    const column = matrix.map(row => row[col]);
    const min = Math.min(...column);
    const max = Math.max(...column);
    const range = max - min;

    for (let row = 0; row < matrix.length; row++) {
      normalized[row][col] = range === 0 ? 0.5 : (matrix[row][col] - min) / range;
    }
  }

  return normalized;
};

/**
 * Clamp value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

/**
 * Generate random integer between min and max (inclusive)
 */
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Random choice from array
 */
export const randomChoice = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Random choices with weighted probabilities
 * @param options - Array of options
 * @param weights - Array of weights (must sum to 1)
 */
export const weightedChoice = <T>(options: T[], weights: number[]): T => {
  if (options.length !== weights.length) {
    throw new Error('Options and weights must have same length');
  }

  const random = Math.random();
  let cumulative = 0;

  for (let i = 0; i < options.length; i++) {
    cumulative += weights[i];
    if (random <= cumulative) {
      return options[i];
    }
  }

  return options[options.length - 1];
};

/**
 * Seeded random number generator (for reproducible results)
 */
export class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    // Linear congruential generator
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  nextNormal(mean: number, stdDev: number): number {
    const u1 = this.next();
    const u2 = this.next();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return z * stdDev + mean;
  }

  choice<T>(array: T[]): T {
    return array[Math.floor(this.next() * array.length)];
  }
}
