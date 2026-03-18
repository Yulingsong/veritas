/**
 * String Utilities
 */

/**
 * Slugify string
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Camel case
 */
export function camelCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
      index === 0 ? word.toLowerCase() : word.toUpperCase())
    .replace(/\s+/g, '');
}

/**
 * Pascal case
 */
export function pascalCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, word => word.toUpperCase())
    .replace(/\s+/g, '');
}

/**
 * Kebab case
 */
export function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Snake case
 */
export function snakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}

/**
 * Truncate string
 */
export function truncate(str: string, length: number, suffix: string = '...'): string {
  if (str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Reverse string
 */
export function reverse(str: string): string {
  return str.split('').reverse().join('');
}

/**
 * Repeat string
 */
export function repeat(str: string, count: number): string {
  return str.repeat(count);
}

/**
 * Pad string
 */
export function pad(str: string, length: number, char: string = ' ', direction: 'left' | 'right' | 'both' = 'left'): string {
  const padLen = length - str.length;
  if (padLen <= 0) return str;
  
  const padStr = repeat(char, padLen);
  
  switch (direction) {
    case 'left': return padStr + str;
    case 'right': return str + padStr;
    case 'both': {
      const left = Math.floor(padStr.length / 2);
      return padStr.slice(0, left) + str + padStr.slice(left);
    }
  }
}

/**
 * Template literal
 */
export function template(strings: TemplateStringsArray, ...values: any[]): string {
  let result = strings[0];
  for (let i = 0; i < values.length; i++) {
    result += String(values[i]) + strings[i + 1];
  }
  return result;
}

/**
 * Escape HTML
 */
export function escapeHtml(str: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return str.replace(/[&<>"']/g, char => htmlEntities[char]);
}

/**
 * Unescape HTML
 */
export function unescapeHtml(str: string): string {
  const htmlEntities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'"
  };
  return str.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, entity => htmlEntities[entity]);
}

/**
 * Escape regex
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Strip tags
 */
export function stripTags(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}

/**
 * Word count
 */
export function wordCount(str: string): number {
  return str.trim().split(/\s+/).length;
}

/**
 * Random string
 */
export function randomString(length: number, charset: string = 'a-zA-Z0-9'): string {
  const pattern = new RegExp(`[${charset}]`, 'g');
  let result = '';
  let match;
  while (result.length < length) {
    match = pattern.exec('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.repeat(10));
    if (match && result.length < length) {
      result += match[0];
    }
  }
  return result.slice(0, length);
}

export default { slugify, camelCase, pascalCase, kebabCase, snakeCase, truncate, capitalize, reverse, repeat, pad, template, escapeHtml, unescapeHtml, escapeRegex, stripTags, wordCount, randomString };
