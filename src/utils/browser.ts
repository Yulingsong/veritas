/**
 * Browser Utilities
 */

/**
 * Get user agent
 */
export function getUserAgent(): string {
  return navigator.userAgent;
}

/**
 * Is mobile
 */
export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Is iOS
 */
export function isIOS(): boolean {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/**
 * Is Android
 */
export function isAndroid(): boolean {
  return /Android/i.test(navigator.userAgent);
}

/**
 * Get viewport size
 */
export function getViewport(): { width: number; height: number } {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

/**
 * Get scroll position
 */
export function getScrollPosition(): { x: number; y: number } {
  return {
    x: window.scrollX || document.documentElement.scrollLeft,
    y: window.scrollY || document.documentElement.scrollTop
  };
}

/**
 * Scroll to position
 */
export function scrollTo(x: number, y: number): void {
  window.scrollTo(x, y);
}

/**
 * Scroll to element
 */
export function scrollToElement(element: Element): void {
  element.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Get cookies
 */
export function getCookies(): Record<string, string> {
  const cookies: Record<string, string> = {};
  document.cookie.split(';').forEach(cookie => {
    const [key, value] = cookie.trim().split('=');
    if (key) cookies[key] = value;
  });
  return cookies;
}

/**
 * Set cookie
 */
export function setCookie(name: string, value: string, days?: number): void {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/';
}

/**
 * Delete cookie
 */
export function deleteCookie(name: string): void {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

/**
 * Get local storage
 */
export function getStorage(key: string): string | null {
  return localStorage.getItem(key);
}

/**
 * Set local storage
 */
export function setStorage(key: string, value: string): void {
  localStorage.setItem(key, value);
}

/**
 * Remove local storage
 */
export function removeStorage(key: string): void {
  localStorage.removeItem(key);
}

/**
 * Clear local storage
 */
export function clearStorage(): void {
  localStorage.clear();
}

export default { getUserAgent, isMobile, isIOS, isAndroid, getViewport, getScrollPosition, scrollTo, scrollToElement, getCookies, setCookie, deleteCookie, getStorage, setStorage, removeStorage, clearStorage };
