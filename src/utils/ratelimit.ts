/**
 * Rate Limiter
 */

/**
 * Token bucket rate limiter
 */
export class RateLimiter {
  private tokens: number;
  private maxTokens: number;
  private refillRate: number;
  private lastRefill: number;

  constructor(options: {
    maxTokens?: number;
    refillRate?: number; // tokens per second
  } = {}) {
    this.maxTokens = options.maxTokens || 10;
    this.refillRate = options.refillRate || 1;
    this.tokens = this.maxTokens;
    this.lastRefill = Date.now();
  }

  /**
   * Try to consume token
   */
  tryConsume(tokens: number = 1): boolean {
    this.refill();

    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }

    return false;
  }

  /**
   * Wait for token
   */
  async waitForToken(tokens: number = 1): Promise<void> {
    while (!this.tryConsume(tokens)) {
      await sleep(100);
    }
  }

  /**
   * Refill tokens
   */
  private refill(): void {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    const tokensToAdd = elapsed * this.refillRate;
    
    this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }

  /**
   * Get available tokens
   */
  getAvailableTokens(): number {
    this.refill();
    return Math.floor(this.tokens);
  }
}

/**
 * Sliding window rate limiter
 */
export class SlidingWindowRateLimiter {
  private requests: number[] = [];
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * Try to make request
   */
  tryRequest(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter(t => now - t < this.windowMs);

    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }

    return false;
  }

  /**
   * Wait for request
   */
  async waitForRequest(): Promise<void> {
    while (!this.tryRequest()) {
      await sleep(100);
    }
  }

  /**
   * Get remaining requests
   */
  getRemainingRequests(): number {
    const now = Date.now();
    this.requests = this.requests.filter(t => now - t < this.windowMs);
    return this.maxRequests - this.requests.length;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default { RateLimiter, SlidingWindowRateLimiter };
