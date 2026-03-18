/**
 * Number Utilities
 */

/**
 * Clamp number
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Random number
 */
export function random(min: number = 0, max: number = 1): number {
  return Math.random() * (max - min) + min;
}

/**
 * Random integer
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(random(min, max + 1));
}

/**
 * Round to decimal places
 */
export function round(value: number, decimals: number = 0): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Floor to decimal places
 */
export function floor(value: number, decimals: number = 0): number {
  const multiplier = Math.pow(10, decimals);
  return Math.floor(value * multiplier) / multiplier;
}

/**
 * Ceil to decimal places
 */
export function ceil(value: number, decimals: number = 0): number {
  const multiplier = Math.pow(10, decimals);
  return Math.ceil(value * multiplier) / multiplier;
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format bytes
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

/**
 * Format percentage
 */
export function formatPercent(value: number, decimals: number = 0): string {
  return (value * 100).toFixed(decimals) + '%';
}

/**
 * Parse int
 */
export function parseInt(str: string, defaultValue: number = 0): number {
  const parsed = parseInt(str, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Parse float
 */
export function parseFloat(str: string, defaultValue: number = 0): number {
  const parsed = parseFloat(str);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Sum array
 */
export function sum(arr: number[]): number {
  return arr.reduce((acc, val) => acc + val, 0);
}

/**
 * Average
 */
export function average(arr: number[]): number {
  return arr.length > 0 ? sum(arr) / arr.length : 0;
}

/**
 * Median
 */
export function median(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 
    ? (sorted[mid - 1] + sorted[mid]) / 2 
    : sorted[mid];
}

/**
 * Min
 */
export function min(arr: number[]): number {
  return Math.min(...arr);
}

/**
 * Max
 */
export function max(arr: number[]): number {
  return Math.max(...arr);
}

/**
 * Range
 */
export function range(start: number, end: number, step: number = 1): number[] {
  const result: number[] = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
}

/**
 * Percent of
 */
export function percentOf(value: number, total: number): number {
  return total > 0 ? value / total : 0;
}

/**
 * Percent change
 */
export function percentChange(oldValue: number, newValue: number): number {
  return oldValue > 0 ? (newValue - oldValue) / oldValue : 0;
}

export default { clamp, random, randomInt, round, floor, ceil, formatNumber, formatBytes, formatPercent, parseInt, parseFloat, sum, average, median, min, max, range, percentOf, percentChange };
