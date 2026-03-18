/**
 * URL Utilities
 */

/**
 * Parse URL
 */
export function parseUrl(url: string): URL {
  return new URL(url);
}

/**
 * Get query params
 */
export function getQueryParams(url: string): Record<string, string> {
  const params: Record<string, string> = {};
  const urlObj = new URL(url);
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

/**
 * Build URL with params
 */
export function buildUrl(baseUrl: string, params: Record<string, any>): string {
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

/**
 * Add query param
 */
export function addQueryParam(url: string, key: string, value: string): string {
  const urlObj = new URL(url);
  urlObj.searchParams.set(key, value);
  return urlObj.toString();
}

/**
 * Remove query param
 */
export function removeQueryParam(url: string, key: string): string {
  const urlObj = new URL(url);
  urlObj.searchParams.delete(key);
  return urlObj.toString();
}

/**
 * Get domain
 */
export function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

/**
 * Get path
 */
export function getPath(url: string): string {
  try {
    return new URL(url).pathname;
  } catch {
    return '';
  }
}

/**
 * Is valid URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Encode URL segment
 */
export function encodeUrlSegment(segment: string): string {
  return encodeURIComponent(segment);
}

/**
 * Decode URL segment
 */
export function decodeUrlSegment(segment: string): string {
  return decodeURIComponent(segment);
}

/**
 * Join URL parts
 */
export function joinUrl(...parts: string[]): string {
  return parts.map((part, i) => {
    if (i === 0) return part.replace(/\/+$/, '');
    if (i === parts.length - 1) return part.replace(/^\/+/, '');
    return part.replace(/^\/+|\/+$/g, '');
  }).filter(Boolean).join('/');
}

export default { parseUrl, getQueryParams, buildUrl, addQueryParam, removeQueryParam, getDomain, getPath, isValidUrl, encodeUrlSegment, decodeUrlSegment, joinUrl };
